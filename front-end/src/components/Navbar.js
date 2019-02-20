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

class Navbar extends React.Component {

  render() {
    return (
      <Query query={CURRENT_USER_QUERY}>
        {({ data: { me }, error, loading }) => (
          <Header style={{ position: "realtive", zIndex: 1, width: "100%" }}>
            {me && (
              <React.Fragment>
                {this.props.data.me ? (
                  <Subscription
                    subscription={EVENT_SUBSCRIPTION}
                    variables={{ id: this.props.data.me.id }}
                  >
                    {({ data, error, loading }) => {
                      if (loading) return <p></p>
                      if (!data.loading) {
                        toast(`You've just been invited to the event: ${data.newEvent.node.title}`);
                      }
                      return <ToastContainer />;
                    }}
                  </Subscription>
                ) : null}

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
        )}
      </Query>
    );
  }
}

export default graphql(CURRENT_USER_QUERY)(Navbar);
