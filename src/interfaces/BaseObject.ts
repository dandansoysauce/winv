export default interface BaseObject {
  id?: string;
  storeId?: string;
  name: string;
  description?: string;
  modifiedAt: string;
  createdAt: string;
  modifiedBy: string;
  enabled: boolean;
}
