import BaseObject from './BaseObject';
import ProductPropertyType from './ProductPropertyType';

export default interface Product extends BaseObject {
  productCode: string;
  pricePerItem: number;
  suppliedBy: string;
  quantity: number;
  productTypeId: string;
  properties: ProductPropertyType[];
}
