import BaseObject from './BaseObject';

export default interface Supplier extends BaseObject {
  Address: string;
  ContactEmail: string;
  ContactNumber: string;
  Notes: string;
}
