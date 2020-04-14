import * as firebase from 'firebase/app';

export default interface BaseObject {
  id?: string;
  storeId?: string;
  name: string;
  description?: string;
  modifiedAt: firebase.firestore.Timestamp;
  createdAt: firebase.firestore.Timestamp;
  modifiedBy: string;
  enabled: boolean;
}
