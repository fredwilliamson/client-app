import React, { ChangeEvent, useState } from "react";
import { Button, Form, Input } from "antd";
import { useStore } from "../../stores/Store";
import { useHistory } from "react-router-dom";
import { User } from "../../model/user.model";
import { observer } from "mobx-react-lite";
import { Header, Segment } from "semantic-ui-react";

export default observer(function RegistrationForm() {
  const history = useHistory();
  const { userStore, modalStore } = useStore();
  const { initiateRegistration } = userStore;
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
    initiateRegistration(user).then((response) => {
      if (
        response?.displayName !== null &&
        response?.displayName !== undefined
      ) {
        modalStore.close();
        history.push(`/`);
      }
    });
  }
  return (
    <>
      <Segment
        textAlign="center"
        attached="top"
        inverted
        color="teal"
        style={{ border: "none" }}
      >
        <Header>Activities Registration</Header>
      </Segment>
      <Segment attached>
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
              placeholder="User name"
              value={user.userName}
              name="userName"
              type={"text"}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item>
            <Input
              placeholder="Name displayed"
              value={user.displayName}
              name="displayName"
              type={"text"}
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
            loading={userStore.loading}
            name="Submit"
            className={"button-validation"}
            shape={"round"}
            onClick={() => handleSubmit()}
          >
            Submit
          </Button>
        </Form>
      </Segment>
    </>
  );
});
