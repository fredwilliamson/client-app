import { PrimaryKey } from "./primaryKey.model";

export interface User extends PrimaryKey {
  userName: string;
  displayName: string;
  email: string;
  password: string;
  image: string;
}
