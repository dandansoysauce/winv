export default interface Store {
  id?: string;
  inviteCode?: string;
  storeName: string;
  storeAddress: string;
  createdAt: Date;
  modifiedAt: Date;
}
