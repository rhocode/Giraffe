const versionCompare = (v1: string, v2: string) => {
  let lexicographical = false,
    zeroExtend = false,
    v1parts = v1.split('.'),
    v2parts = v2.split('.');

  function isValidPart(x: string) {
    return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
  }

  if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
    return NaN;
  }

  if (zeroExtend) {
    while (v1parts.length < v2parts.length) v1parts.push('0');
    while (v2parts.length < v1parts.length) v2parts.push('0');
  }

  let v1parts_num: number[] = [];
  let v2parts_num: number[] = [];

  if (!lexicographical) {
    v1parts_num = v1parts.map(Number);
    v2parts_num = v2parts.map(Number);
  }

  for (let i = 0; i < v1parts_num.length; ++i) {
    if (v1parts_num.length === i) {
      return 1;
    }
    if (v1parts_num[i] === v2parts_num[i]) {
      continue;
    } else if (v1parts_num[i] > v2parts_num[i]) {
      return 1;
    } else {
      return -1;
    }
  }

  if (v1parts_num.length !== v2parts_num.length) {
    return -1;
  }

  return 0;
};

export default versionCompare;
