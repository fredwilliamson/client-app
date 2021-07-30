import React from "react";
import {
  Button,
  Container,
  Dropdown,
  DropdownMenu,
  Image,
  Menu,
} from "semantic-ui-react";
import { Link, NavLink, useHistory } from "react-router-dom";
import { useStore } from "../stores/Store";
import { observer } from "mobx-react-lite";

export default observer(function NavBar() {
  const history = useHistory();
  const { loginStore } = useStore();
  const { user, logout } = loginStore;
  return (
    <Menu inverted fixed={"top"}>
      <Container>
        <Menu.Item as={NavLink} exact to="/" header>
          <img
            src={"/static/assets/logo.png"}
            title={"logo"}
            style={{ marginRight: "10px" }}
          />
        </Menu.Item>
        <Menu.Item name={"Activities"} as={NavLink} to="/activities" />
        <Menu.Item>
          <Button
            positive
            content={"Create Activities"}
            as={NavLink}
            to="/createActivity"
          />{" "}
        </Menu.Item>
        <Menu.Item position={"right"}>
          <Image
            src={user?.image || "/static/assets/user.png"}
            avatar
            spaced={"right"}
          />
          <Dropdown pointing={"top left"} text={user?.displayName}>
            <DropdownMenu>
              <Dropdown.Item
                as={Link}
                to={`/profile/${user?.userName}`}
                text={"My profile"}
                icon={"user"}
              />
              <Dropdown.Item
                onClick={() => logout().then(() => history.push("/"))}
                text={"logout"}
                icon={"power"}
              />
            </DropdownMenu>
          </Dropdown>
        </Menu.Item>
      </Container>
    </Menu>
  );
});
