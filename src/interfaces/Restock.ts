import BaseObject from './BaseObject';
import * as firebase from 'firebase/app';

export default interface Restock extends BaseObject {
  restockDate: firebase.firestore.Timestamp;
  quantity: number;
  suppliedBy: string;
  productId: string;
  oldSupplierPrice: number;
  newSupplierPrice: number;
  newSalePrice: number;
  newSalePricePercentage: number;
  supplierInfoChanged: boolean;
  priceAdjust: boolean;
  percentageAdjust: boolean;
}
