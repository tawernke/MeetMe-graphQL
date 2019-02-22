import React from "react";
import { Query, Subscription } from "react-apollo";
import { Menu, Layout } from "antd";
import { graphql } from "react-apollo";
import { CURRENT_USER_QUERY } from "./User";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import { ToastContainer, toast } from "react-toastify";
import Signout from "./Signout";
import NavBarSearch from "./NavBarSearch";
import AcceptFriendRequest from "./AcceptFriendRequest";
import "../App.css";

const { Header } = Layout;

const EVENT_SUBSCRIPTION = gql`
  subscription($id: ID) {
    newEvent(id: $id) {
      node {
        id
        title
      }
    }
  }
`;

const FRIEND_REQUEST_SUBSCRIPTION = gql`
  subscription($id: ID) {
    newFriendRequest(id: $id) {
      name
      id
    }
  }
`;

class Navbar extends React.Component {
  render() {
    return (
      <Query query={CURRENT_USER_QUERY}>
        {({ data: { me }, error, loading }) => {
          if (loading) return null;
          return (
            <Header style={{ position: "realtive", zIndex: 1, width: "100%" }}>
              {me && (
                <React.Fragment>
                    <>
                      <Subscription
                        subscription={EVENT_SUBSCRIPTION}
                        variables={{ id: me.id }}
                      >
                        {({ data, error, loading }) => {
                          if (loading) return <p />;
                          console.log(data);
                          if (!data.loading) {
                            toast(
                              `You've just been invited to the event: ${
                                data.newEvent.node.title
                              }`
                            );
                          }
                          return <ToastContainer />;
                        }}
                      </Subscription>
                      <Subscription
                        subscription={FRIEND_REQUEST_SUBSCRIPTION}
                        variables={{ id: me.id }}
                      >
                        {({ data, loading }) => {
                          if (loading) return null
                          console.log(data);
                            toast(
                              `${
                                data.newFriendRequest.name
                              } has just added you as a friend!`
                            );
                        return <ToastContainer/>
                        }}
                      </Subscription>
                    </>

                  <Menu
                    theme="dark"
                    mode="horizontal"
                    style={{ lineHeight: "64px" }}
                  >
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
                      <NavBarSearch me={me} history={this.props.history} />
                    </Menu.Item>
                  </Menu>
                </React.Fragment>
              )}
            </Header>
          );
        }}
      </Query>
    );
  }
}

export default Navbar;
