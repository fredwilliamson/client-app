import { makeAutoObservable } from "mobx";

interface Modal {
  opened: boolean;
  body: JSX.Element | null;
}

export default class ModalStore {
  modal: Modal = {
    opened: false,
    body: null,
  };
  constructor() {
    makeAutoObservable(this);
  }
  open = (content: JSX.Element) => {
    this.modal.opened = true;
    this.modal.body = content;
  };
  close = () => {
    this.modal.opened = false;
    this.modal.body = null;
    return null;
  };
}
