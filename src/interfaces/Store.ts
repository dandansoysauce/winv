import * as firebase from 'firebase/app';

export default interface Store {
  id?: string;
  inviteCode?: string;
  storeName: string;
  storeAddress: string;
  createdAt: firebase.firestore.Timestamp;
  modifiedAt: firebase.firestore.Timestamp;
}
