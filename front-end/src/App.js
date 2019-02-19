import React, { Component } from "react";
import { Query, Subscription } from "react-apollo";
import gql from "graphql-tag";
import { graphql } from 'react-apollo'
import { ToastContainer, toast } from 'react-toastify';
import Signin from "./components/Signin";
import Profile from "./components/Profile";
import Discover from "./components/Discover";
import Signup from "./components/Signup";
import { Route, Switch } from "react-router-dom";
import PleaseSignIn from "./components/PleaseSignIn";
import Navbar from "./components/Navbar";
import RequestReset from "./components/RequestReset";
import Reset from "./components/Reset";
import AcceptFriendRequest from "./components/AcceptFriendRequest";
import "./App.css";
import 'react-toastify/dist/ReactToastify.css';

const ALL_PLACES_QUERY = gql`
  query ALL_PLACES_QUERY {
    places {
      id
      address1
      city
      country
      name
      phone
      price
      rating
      state
      type
      postal_code
    }
  }
`;

const EVENT_SUBSCRIPTION = gql`
  subscription {
    newEvent {
      node {
        id
        title
      }
    }
  }
`;

class App extends Component {

  componentDidUpdate() {
    if(!this.props.data.loading) {
      toast(`You've just been invited to the event: ${this.props.data.newEvent.node.title}`)
    }
  }

  render() {
    return (
      <div className="app">
        <ToastContainer/>
        <Navbar history={this.props.history} />
        <Switch>
          <Route
            exact
            path="/"
            render={routeProps => <Signin {...routeProps} />}
          />
          <Route exact path="/discover" render={() => <Discover />} />
          <Route
            path="/signup"
            render={routeProps => <Signup {...routeProps} />}
          />
          <Route
            path="/resetPassword/:resetToken"
            render={routeProps => <Reset {...routeProps} />}
          />
          <Route
            path="/requestReset"
            render={routeProps => <RequestReset {...routeProps} />}
          />
          <PleaseSignIn match={this.props.match} history={this.props.history}>
            <Query query={ALL_PLACES_QUERY}>
              {({ data, error, loading }) => {
                if (loading) return null;
                if (error) return <p>Error: {error.message}</p>;
                return (
                  <Switch>
                    <Route
                      path="/acceptFriendRequest/:friendId"
                      render={routeProps => (
                        <AcceptFriendRequest {...routeProps} />
                      )}
                    />
                    <Route
                      path="/:username"
                      render={routeProps => (
                        <Profile
                          {...routeProps}
                          {...this.state}
                          showModal={this.showModal}
                        />
                      )}
                    />
                  </Switch>
                );
              }}
            </Query>
          </PleaseSignIn>
        </Switch>
      </div>
    );
  }
}

export default graphql(EVENT_SUBSCRIPTION)(App);
