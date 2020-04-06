export default interface BaseObject {
  id?: string;
  storeId?: string;
  name: string;
  description: string;
  modifiedAt: Date;
  createdAt: Date;
  modifiedBy: string;
  enabled: boolean;
}
