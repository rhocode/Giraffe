import { auth, initializeApp } from 'firebase/app';
import 'firebase/auth';
import { firebaseSecrets } from './firebaseSecrets';

const firebaseApp = initializeApp(firebaseSecrets);

const provider = new auth.GithubAuthProvider();
provider.addScope('public_repo');

export const firebaseGithubAuth = () => {
  return firebaseApp.auth().signInWithPopup(provider);
};

export default firebaseApp;
