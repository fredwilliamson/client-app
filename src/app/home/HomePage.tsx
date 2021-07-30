import React from "react";
import { Button, Container, Header, Image, Segment } from "semantic-ui-react";
import { useStore } from "../stores/Store";
import LoginForm from "../features/users/LoginForm";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import RegistrationForm from "../features/users/RegistrationForm";

export default observer(function HomePage() {
  const { modalStore, loginStore } = useStore();
  return (
    <Segment inverted textAlign={"center"} vertical className={"masthead"}>
      <Container text>
        <Header as={"h1"} inverted>
          <Image
            size="massive"
            src={"/static/assets/logo.png"}
            alt={"logo"}
            style={{ marginBottom: 12 }}
          />
          Activities
        </Header>
        <Header as={"h2"} inverted content="Welcome to Reactivities" />
        {loginStore.isLoggedIn ? (
          <Button as={Link} to={"/activities"} size={"huge"} inverted>
            Go to Activities!
          </Button>
        ) : (
          <>
            <Button onClick={() => modalStore.open(<LoginForm />)} inverted>
              Login !
            </Button>
            <Button
              onClick={() => modalStore.open(<RegistrationForm />)}
              inverted
            >
              Register
            </Button>
          </>
        )}
      </Container>
    </Segment>
  );
});
