import { Observable } from "rxjs";

export class AuthenticationService {
  getTokenFromStorage(key: string) {
    const stringFromStorage = JSON.parse(<string>localStorage.getItem(key));
    return stringFromStorage && stringFromStorage.token
      ? stringFromStorage.token
      : null;
  }

  setTokenToStorage(key: string, value: string) {
    localStorage.setItem(
      key,
      JSON.stringify({
        token: value,
      })
    );
  }

  removeTokenFromStorage(key: string) {
    localStorage.removeItem(key);
  }

  /**
   * Getter for localStorage token
   */
  getTokenStorage(): string {
    return this.getTokenFromStorage("tokenUser");
  }

  /**
   * Setter for localStorage token
   * @param token
   */
  setTokenStorage(token: string) {
    this.setTokenToStorage("tokenUser", token);
  }

  /**
   * Setter for localStorage authorities
   * @param authorities
   */
  setAuthoritiesStorage(authorities: string[]) {
    localStorage.setItem(
      "authoritiesUser",
      JSON.stringify({
        authorities: authorities,
      })
    );
  }

  /**
   * Getter for localStorage vfqToken
   */
  getVfqTokenStorage(): string {
    return this.getTokenFromStorage("vfqToken");
  }

  /**
   * Setter for localStorage vfqToken
   * @param token
   */
  setVfqTokenStorage(token: string) {
    this.setTokenToStorage("vfqToken", token);
  }

  /**
   * Remove for localStorage vfqToken
   */
  removeVfqTokenStorage() {
    this.removeTokenFromStorage("vfqToken");
  }

  /**
   * Getter for localStorage taskToken
   */
  getTaskTokenStorage(): string {
    return this.getTokenFromStorage("taskToken");
  }

  /**
   * Setter for localStorage taskToken
   * @param token
   */
  setTaskTokenStorage(token: string) {
    this.setTokenToStorage("taskToken", token);
  }

  /**
   * Remove for localStorage taskToken
   */
  removeTaskTokenStorage() {
    this.removeTokenFromStorage("taskToken");
  }

  /**
   * For remove all the localStorage in the navigator
   */
  removeAllStorage() {
    localStorage.removeItem("tokenUser");
    localStorage.removeItem("authoritiesUser");
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("vfqToken");
    localStorage.removeItem("taskToken");
    localStorage.removeItem("refreshToken");
  }

  setRefreshToken(refreshToken: string) {
    if (!refreshToken) {
      localStorage.removeItem("refreshToken");
    } else {
      this.setTokenToStorage("refreshToken", refreshToken);
    }
  }

  getRefreshToken(): string {
    return this.getTokenFromStorage("refreshToken");
  }
}
