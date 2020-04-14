import BaseObject from './BaseObject';

export default interface Supplier extends BaseObject {
  address: string;
  contactEmail: string;
  contactNumber: string;
  notes: string;
}
