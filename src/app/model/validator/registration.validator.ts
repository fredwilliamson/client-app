import { Validator } from "../../api/validation/Validator";
import { User } from "../user.model";

export function createValidator() {
  return new Validator<User>()
    .addRequired("email", (u) => u.email)
    .addRequired("password", (u) => u.password)
    .addRequired("displayed name", (u) => u.displayName)
    .addRequired("user name", (u) => u.userName)
    .add(
      "password must be complex",
      (u) =>
        u.password !== null &&
        u.password !== undefined &&
        u.password.match("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}") !== null
    );
}
