import BaseObject from './BaseObject';

export default interface Sale extends BaseObject {
  productId: string;
  quantity: number;
  totalSale: number;
  dateSale: string;
  soldBy?: string;
}
