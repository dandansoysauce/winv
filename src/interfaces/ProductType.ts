import BaseObject from './BaseObject';

export default interface ProductType extends BaseObject {
  pricePerItem: number;
  properties: any[];
  quantity: number;
  suppliedBy: string;
}
