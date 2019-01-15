import React from "react";
import { Query } from "react-apollo";
import { Menu, Layout } from "antd";
import { CURRENT_USER_QUERY } from "./User";
import { Link } from "react-router-dom";
import Signout from "./Signout";
import NavBarSearch from './NavBarSearch'
import "../App.css"

const { Header } = Layout;

const Navbar = props => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data: { me }, error, loading }) => (
      <Header
        style={{ position: "fixed", zIndex: 1, width: "100%" }}
      >
        {me && (
          <React.Fragment>
            <Menu theme="dark" mode="horizontal" style={{ lineHeight: "64px" }}>
              <Menu.Item key="1">
                <Link to={`/${me.id}`}>Home</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/discover">Discover</Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Signout />
              </Menu.Item>
              <Menu.Item key="4">
                <NavBarSearch history={props.history} />
              </Menu.Item>
            </Menu>
          </React.Fragment>
        )}
      </Header>
    )}
  </Query>
);

export default Navbar;
