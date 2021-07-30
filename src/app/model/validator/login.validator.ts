import { Validator } from "../../api/validation/Validator";
import { User } from "../user.model";

export function createValidator() {
  return new Validator<User>()
    .addRequired("email", (u) => u.email)
    .addRequired("password", (u) => u.password)
    .add(
      "password must be complex",
      (u) =>
        u.password !== null &&
        u.password !== undefined &&
        u.password.match("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}") !== null
    );
}
