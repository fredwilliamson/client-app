import ActivityStore from "./ActivityStore";
import { createContext, useContext } from "react";
import LoginStore from "./LoginStore";
import ModalStore from "./ModalStore";
import UserStore from "./UserStore";

interface Store {
  activityStore: ActivityStore;
  loginStore: LoginStore;
  modalStore: ModalStore;
  userStore: UserStore;
}

export const store: Store = {
  activityStore: new ActivityStore(),
  loginStore: new LoginStore(),
  modalStore: new ModalStore(),
  userStore: new UserStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
