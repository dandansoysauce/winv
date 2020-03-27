import BaseObject from './BaseObject';
import ProductPropertyType from './ProductPropertyType';

export default interface ProductType extends BaseObject {
  properties: ProductPropertyType[];
}
