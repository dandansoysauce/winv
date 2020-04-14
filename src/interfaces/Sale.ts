import * as firebase from 'firebase/app';
import BaseObject from './BaseObject';

export default interface Sale extends BaseObject {
  productId: string;
  productName: string;
  productSupplierPrice: number;
  quantity: number;
  totalSale: number;
  dateSale: firebase.firestore.Timestamp;
  soldBy?: string;
}
