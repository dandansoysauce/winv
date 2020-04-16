import BaseObject from './BaseObject';
import ProductPropertyType from './ProductPropertyType';

export default interface Product extends BaseObject {
  productCode: string;
  pricePerItem: number;
  salePrice: number;
  suppliedBy: string;
  quantity: number;
  productTypeId: string;
  manuallySetPrice: boolean;
  salePricePercentage: number;
  properties: ProductPropertyType[];
}
