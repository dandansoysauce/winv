import BaseObject from './BaseObject';

export default interface Sale extends BaseObject {
  productId: string;
  quantity: number;
  grandTotal: number;
  dateSale: Date;
}
