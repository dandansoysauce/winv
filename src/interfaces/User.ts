import * as firebase from 'firebase/app';

export default interface User {
  id?: string;
  storeId?: string;
  name: string;
  email: string;
  phoneNumber: string;
  emailVerified: boolean;
  password?: string;
  createdAt: firebase.firestore.Timestamp;
  modifiedAt: firebase.firestore.Timestamp;
}
