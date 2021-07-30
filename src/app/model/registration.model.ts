import { PrimaryKey } from "./primaryKey.model";

export interface Registration extends PrimaryKey {
  displayName: string;
  token: string;
}
