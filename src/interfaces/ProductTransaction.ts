import BaseObject from './BaseObject';

export default interface ProductTransaction extends BaseObject {
  productCode: string;
  pricePerItem: number;
  suppliedBy: string;
  quantity: number;
  productTypeId: string;
}
