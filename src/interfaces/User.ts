export default interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  dateCreated: Date;
  dateModified: Date;
}
