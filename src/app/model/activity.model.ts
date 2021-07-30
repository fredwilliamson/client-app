import { PrimaryKey } from "./primaryKey.model";

export interface Activity extends PrimaryKey {
  title: string;
  date: Date | null;
  description: string;
  category: string;
  city: string;
  venue: string;
}
