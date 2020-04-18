import * as firebase from 'firebase/app';
import BaseObject from './BaseObject';

export default interface Settings extends BaseObject {
  storeHours: firebase.firestore.Timestamp[];
  isAlwaysOpen: boolean;
  restockWarningThreshold: number;
  restockDangerThreshold: number;
}
