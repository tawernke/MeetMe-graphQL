import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Signin from "./components/Signin";
import Profile from "./components/Profile";
import Discover from "./components/Discover";
import Signup from "./components/Signup";
import { Route, Switch } from "react-router-dom";
import PleaseSignIn from "./components/PleaseSignIn";
import Navbar from "./components/Navbar";
import RequestReset from "./components/RequestReset";
import Reset from "./components/Reset";
import "./App.css";

const ALL_PLACES_QUERY = gql`
  query ALL_PLACES_QUERY {
    places {
      id
      address
      city
      country
      name
      phone
      price
      rating
      state
      type
      zip
    }
  }
`;

class App extends Component {
  render() {
    return (
      <div>
        <Navbar history={this.props.history} />
          <Switch>
            <Route
              exact
              path="/"
              render={(routeProps) => <Signin {...routeProps} />}
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
              path="/resetPassword/"
              render={routeProps => <RequestReset {...routeProps} />}
            />
            <PleaseSignIn history={this.props.history}>
              <Query query={ALL_PLACES_QUERY}>
                {({ data, error, loading }) => {
                  if (loading) return <p>Loading..,</p>;
                  if (error) return <p>Error: {error.message}</p>;
                  return (
                    <Switch>
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

export default App;
