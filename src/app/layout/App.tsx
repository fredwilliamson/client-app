import React, { useEffect } from "react";
import "../../App.css";
import { Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import "react-calendar/dist/Calendar.css";
import "./styles.scss";
import ActivityDashBoard from "../features/activities/dashboard/ActivityDashBoard";
import { Route, useLocation } from "react-router-dom";
import HomePage from "../home/HomePage";
import ActivityForm from "../forms/ActivityForm";
import ActivityDetails from "../features/activities/details/ActivityDetails";
import { observer } from "mobx-react-lite";
import LoginForm from "../features/users/LoginForm";
import ModalContainer from "../modals/ModalContainer";
import RegistrationForm from "../features/users/RegistrationForm";
import { useStore } from "../stores/Store";

function App() {
  const location = useLocation();
  const { loginStore } = useStore();
  useEffect(() => {
    if (loginStore.authenticationService.getTokenFromStorage("access_token")) {
      loginStore.getUser().finally(() => loginStore.setAppLoaded());
    } else {
      loginStore.setAppLoaded();
    }
  }, [loginStore]);
  return (
    <>
      <ModalContainer />
      <Route exact path="/" component={HomePage} />
      <Route
        path={"/(.+)"}
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Route exact path="/activities" component={ActivityDashBoard} />
              <Route exact path="/activities/:id" component={ActivityDetails} />
              <Route
                key={location.key}
                path={["/createActivity", "/manage/:id"]}
                component={ActivityForm}
              />
              <Route exact path="/login" component={LoginForm} />
              <Route exact path="/register" component={RegistrationForm} />
              <Route exact path="/profile" component={RegistrationForm} />
            </Container>
          </>
        )}
      />
    </>
  );
}

export default observer(App);
