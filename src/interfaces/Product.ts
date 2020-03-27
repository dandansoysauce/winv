import BaseObject from './BaseObject';

export default interface Product extends BaseObject {
  pricePerItem: number;
  suppliedBy: string;
  quantity: number;
  productTypeId: string;
  [customProperty: string]: any;
}
