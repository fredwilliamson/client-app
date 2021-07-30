import React, { ChangeEvent, useState } from "react";
import { Button, Form, Input } from "antd";
import { useStore } from "../../stores/Store";
import { useHistory } from "react-router-dom";
import { User } from "../../model/user.model";
import { observer } from "mobx-react-lite";

export default observer(function LoginForm() {
  const history = useHistory();
  const { loginStore, modalStore } = useStore();
  const { initiateLogin } = loginStore;
  const [user, setUser] = useState<User>({
    password: "",
    email: "",
    userName: "",
    displayName: "",
    image: "",
  });

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  }
  function handleSubmit() {
    initiateLogin(user).then((response) => {
      if (response?.token !== null && response?.token !== undefined) {
        modalStore.close();
        history.push(`/activities/`);
      }
    });
  }
  return (
    <Form>
      <Form.Item>
        <Input
          placeholder="Login"
          value={user.email}
          name="email"
          type={"email"}
          onChange={handleInputChange}
        />
      </Form.Item>
      <Form.Item>
        <Input
          placeholder="Password"
          value={user.password}
          name="password"
          type={"password"}
          onChange={handleInputChange}
        />
      </Form.Item>
      <Button
        loading={loginStore.loading}
        name="Submit"
        className={"button-validation"}
        shape={"round"}
        onClick={() => handleSubmit()}
      >
        Submit
      </Button>
    </Form>
  );
});
