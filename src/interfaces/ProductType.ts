import BaseObject from './BaseObject';

export default interface ProductType extends BaseObject {
  PricePerItem: number;
  Properties: any[];
  Quantity: number;
  SuppliedBy: string;
}
