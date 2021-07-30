import {
  statusFromApiResult,
  statusFromMessages,
  ViewStatus,
  ViewStatusType,
} from "../api/statuses";
import { processViewStatus } from "../api/validation/apiValidationHelper";
import { ApiStatus } from "../api/ApiResult";
import { User } from "../model/user.model";
import { UserApi } from "../api/UserApi";
import { createValidator } from "../model/validator/login.validator";
import { makeAutoObservable, observable, runInAction } from "mobx";
import { AuthenticationService } from "../core/authenticationService";
import { Registration } from "../model/registration.model";

const loginApi = new UserApi<Registration>("");

export default class LoginStore {
  loading = false;
  isLoggedIn = false;
  user: User | null = null;
  authenticationService = new AuthenticationService();

  @observable viewStatus: ViewStatus = { status: ViewStatusType.Ok };

  constructor() {
    makeAutoObservable(this);
  }

  initiateLogin = async (user: User) => {
    const validationMessages = createValidator().validate(user);
    this.viewStatus = statusFromMessages(validationMessages, []);

    if (!processViewStatus(this.viewStatus, () => this.initiateLogin(user))) {
      return;
    }
    return await this.login(user);
  };

  getUser = async () => {
    try {
      const user = await loginApi.current();
      runInAction(() => (this.user = user));
    } catch (error) {
      console.log(error);
    }
  };

  login = async (user: User) => {
    runInAction(() => {
      this.loading = true;
    });
    const response = await loginApi.login(user);
    this.viewStatus = statusFromApiResult(response);
    runInAction(() => {
      this.loading = false;
    });
    if (
      processViewStatus(this.viewStatus, (newLoginInfo) => this.login(user))
    ) {
      if (response.status === ApiStatus.Ok) {
        runInAction(() => {
          this.isLoggedIn = true;
          this.user = user;
          this.user.displayName = response.value.displayName;
        });
        this.authenticationService.setTokenToStorage(
          "access_token",
          response.value.token
        );
        return response.value;
      }
    }
  };
  logout = async () => {
    runInAction(() => {
      this.isLoggedIn = false;
      this.user = null;
    });
    this.authenticationService.removeAllStorage();
  };

  setAppLoaded = () => {
    this.isLoggedIn = true;
  };
}
