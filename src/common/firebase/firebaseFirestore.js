import firebaseApp from './firebaseApp';
import 'firebase/firestore';

const firebaseFirestore = firebaseApp.firestore();
firebaseFirestore.enablePersistence();

export default firebaseFirestore;
