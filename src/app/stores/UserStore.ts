import { UserApi } from "../api/UserApi";
import { User } from "../model/user.model";
import { makeAutoObservable, observable, runInAction } from "mobx";
import {
  statusFromApiResult,
  statusFromMessages,
  ViewStatus,
  ViewStatusType,
} from "../api/statuses";
import { createValidator } from "../model/validator/registration.validator";
import { processViewStatus } from "../api/validation/apiValidationHelper";
import { ApiStatus } from "../api/ApiResult";

const loginApi = new UserApi<User>("");

export default class UserStore {
  loading = false;
  user: User | null = null;

  @observable viewStatus: ViewStatus = { status: ViewStatusType.Ok };

  constructor() {
    makeAutoObservable(this);
  }

  initiateRegistration = async (user: User) => {
    const validationMessages = createValidator().validate(user);
    this.viewStatus = statusFromMessages(validationMessages, []);

    if (
      !processViewStatus(this.viewStatus, () => this.initiateRegistration(user))
    ) {
      return;
    }
    return await this.register(user);
  };

  register = async (user: User) => {
    runInAction(() => {
      this.loading = true;
    });
    const response = await loginApi.register(user);
    this.viewStatus = statusFromApiResult(response);
    runInAction(() => {
      this.loading = false;
    });
    if (
      processViewStatus(
        this.viewStatus,
        (newRegistryInfo) => this.register(user),
        {
          message: "Success",
          description: "Successfully registered",
        }
      )
    ) {
      if (response.status === ApiStatus.Ok) {
        runInAction(() => {
          this.user = user;
        });
        return response.value;
      }
    }
  };
}
