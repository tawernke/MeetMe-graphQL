import React from "react";
import { Query } from "react-apollo";
import { Menu, Layout } from "antd";
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
      id
      title
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
  subscribeToNewFriend = (subscribeToMore, id) => {
    subscribeToMore({
      document: FRIEND_REQUEST_SUBSCRIPTION,
      variables: { id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        toast(
          `${subscriptionData.data.newFriendRequest.name} has just added you as a friend!`
        );
      }
    });
  };

  subscribeToNewEvent = (subscribeToMore, id) => {
    subscribeToMore({
      document: EVENT_SUBSCRIPTION,
      variables: { id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        toast(
          `You've just been invited to the event: ${
            subscriptionData.data.newEvent.title
          }`
        );
        return prev
      }
    });
  };

  render() {
    return (
      <>
        <ToastContainer />
        <Query query={CURRENT_USER_QUERY}>
          {({ data: { me }, error, loading, subscribeToMore }) => {
            if (loading) return null;
              this.subscribeToNewFriend(subscribeToMore, me.id);
              this.subscribeToNewEvent(subscribeToMore, me.id);
            return (
              <Header
                style={{ position: "realtive", zIndex: 1, width: "100%" }}
              >
                {me && (
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
                )}
              </Header>
            );
          }}
        </Query>
      </>
    );
  }
}

export default Navbar;
