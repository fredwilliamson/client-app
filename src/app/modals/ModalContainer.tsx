import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores/Store";
import { Modal } from "semantic-ui-react";

export default observer(function ModalContainer() {
  const { modalStore } = useStore();
  return (
    <Modal
      open={modalStore.modal.opened}
      onClose={modalStore.close}
      size={"mini"}
    >
      <Modal.Content>{modalStore.modal.body}</Modal.Content>
    </Modal>
  );
});
