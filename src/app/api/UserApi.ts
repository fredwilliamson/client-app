import { getData, post, RestApi } from "./RestApi";
import { User } from "../model/user.model";
import { appendValidationBehaviourParams } from "./validation/apiValidationHelper";
import { ValidationBehaviour } from "./validation/models";
import { Registration } from "../model/registration.model";

const accountUrl = "http://localhost:5003/api/v1/account/";

export class UserApi<T> extends RestApi<T> {
  login = async (user: User, validationBehaviour?: ValidationBehaviour) => {
    return await post<Registration>(
      appendValidationBehaviourParams(
        accountUrl + "login",
        validationBehaviour
      ),
      user
    );
  };
  register = async (user: User, validationBehaviour?: ValidationBehaviour) => {
    return await post<User>(
      appendValidationBehaviourParams(accountUrl, validationBehaviour),
      user
    );
  };
  current = async () => {
    return await getData<User>("http://localhost:5003/api/v1/account/");
  };
}
