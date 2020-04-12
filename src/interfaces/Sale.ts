import BaseObject from './BaseObject';
import * as firebase from 'firebase/app';

export default interface Sale extends BaseObject {
  productId: string;
  productName: string;
  productSupplierPrice: number;
  quantity: number;
  totalSale: number;
  dateSale: firebase.firestore.Timestamp;
  soldBy?: string;
}
