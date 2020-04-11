export default interface User {
  id?: string;
  storeId?: string;
  name: string;
  email: string;
  phoneNumber: string;
  emailVerified: boolean;
  password?: string;
  createdAt: string;
  modifiedAt: string;
}
