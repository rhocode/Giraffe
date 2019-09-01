async function createPullRequest(
  octokit,
  { owner, repo, title, body, base, head, changes }
) {
  let response = await octokit.repos.get({ owner, repo });

  if (!base) {
    base = response.data.default_branch;
  }

  let fork = owner;

  if (!response.data.permissions.push) {
    console.error('HAS PERMISSION');
    const user = await octokit.users.getAuthenticated();
    const forks = await octokit.repos.listForks({
      owner,
      repo
    });
    const hasFork = forks.data.find(
      fork => fork.owner.login === user.data.login
    );

    if (!hasFork) {
      await octokit.repos.createFork({
        owner,
        repo
      });
    }

    fork = user.data.login;
  }

  response = await octokit.repos.listCommits({
    owner,
    repo,
    sha: base,
    per_page: 1
  });
  let latestCommitSha = response.data[0].sha;
  const treeSha = response.data[0].commit.tree.sha;

  const fileContents = {};

  const allPromises = Object.keys(changes.files).map(path => {
    const contents = changes.files[path];
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = function() {
        const dataUrl = reader.result;
        const base64 = dataUrl.split(',')[1];
        resolve(base64);
      };
      reader.readAsDataURL(contents);
    })
      .then(data => {
        return octokit.git.createBlob({
          owner: fork,
          repo,
          content: data,
          encoding: 'base64'
        });
      })
      .then(data => {
        fileContents[path] = data.data.sha;
      });
  });

  await Promise.all(allPromises);

  response = await octokit.git.createTree({
    owner: fork,
    repo,
    base_tree: treeSha,
    tree: Object.keys(changes.files).map(path => {
      return {
        type: 'blob',
        path,
        mode: '100644',
        sha: fileContents[path]
      };
    })
  });

  const newTreeSha = response.data.sha;

  response = await octokit.git.createCommit({
    owner: fork,
    repo,
    message: changes.commit,
    tree: newTreeSha,
    parents: [latestCommitSha]
  });
  latestCommitSha = response.data.sha;

  await octokit.git.createRef({
    owner: fork,
    repo,
    sha: latestCommitSha,
    ref: `refs/heads/${head}`
  });

  return await octokit.pulls.create({
    owner,
    repo,
    head: `${fork}:${head}`,
    base,
    title,
    body
  });
}

function octokitCreatePullRequest(octokit) {
  octokit.createPullRequest = createPullRequest.bind(null, octokit);
}

export default octokitCreatePullRequest;
