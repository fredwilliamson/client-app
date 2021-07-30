import { Validator } from "../../api/validation/Validator";
import { Activity } from "../activity.model";

export function createValidator() {
  return new Validator<Activity>()
    .addRequired("title", (a) => a.title)
    .addRequired("description", (a) => a.description)
    .addRequired("city", (a) => a.city)
    .addRequired("category", (a) => a.category)
    .addRequired("date", (a) => a.date)
    .addRequired("venue", (a) => a.venue);
}
