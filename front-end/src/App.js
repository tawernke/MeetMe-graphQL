import React, { Component } from 'react'
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Signin from './components/Signin'
import Profile from './components/Profile'
import Discover from './components/Discover'
import Signup from './components/Signup'
import {Route, Switch, Link} from 'react-router-dom'
import Signout from './components/Signout'
import PleaseSignIn from "./components/PleaseSignIn";
import RequestReset from "./components/RequestReset";
import Reset from "./components/Reset";
import './App.css'
import { Layout, Menu } from "antd";

const { Header } = Layout;

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
    // const {loggedInUser, imageChange} = this.state
    return <div>
        {/* <Navbar history={this.props.history} /> */}
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            // defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1"><Link to="/cjp9cm4zp75tx0a36oh4d614w">Home</Link></Menu.Item>
            <Menu.Item key="2"><Link to="/discover">Discover</Link></Menu.Item>
            <Menu.Item key="3"><Signout/></Menu.Item>
          </Menu>
        </Header>
        <div className="app">
          <Switch>
            <Route exact path="/" render={() => <Signin history={this.props.history}/>} />
            <Route path="/signup" render={(routeProps) => <Signup {...routeProps} />} />
            <Route path="/resetPassword/:resetToken" render={(routeProps) => <Reset {...routeProps}/>} />
            <Route path="/resetPassword/" render={(routeProps) => <RequestReset {...routeProps}/>} />
            <PleaseSignIn>
              <Query query={ALL_PLACES_QUERY}>
                {({ data, error, loading }) => {
                  if(loading) return <p>Loading..,</p>
                  if(error) return <p>Error: {error.message}</p>
                return <Switch>
                    <Route path="/:username" render={routeProps => <Profile {...routeProps} {...this.state} showModal={this.showModal} />} />
                    <Route path="/discover" render={() => <Discover savedPlaces={data.places} />} />
                  </Switch>;}}
              </Query>
            </PleaseSignIn>
          </Switch>
        </div>
      </div>;
  }
}

export default App
