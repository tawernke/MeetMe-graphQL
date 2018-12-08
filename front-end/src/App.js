import React, { Component } from 'react'
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Navbar from './components/Navbar'
import Cookies from 'js-cookie'
import Homepage from './components/Homepage'
import Profile from './components/Profile'
import Discover from './components/Discover'
import Signup from './components/Signup'
import axios from 'axios'
import {Route, Switch, Link} from 'react-router-dom'
import PleaseSignIn from "./components/PleaseSignIn";
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

const usernameStorageKey = 'USERNAME'

class App extends Component {
  
  state = {
    redirect: false,
    users: [],
    loggedInUser: {},
    imageChange: false,
    savedPlaces: [],
  }

  styleBefore={
    height: "100%",
    backgroundPosition: "center",
    backgroundRepeat: "noRepeat",
    backgroundSize: "cover",
    backgroundImage: 'url(/cheers.jpg)'
}
  
  styleAfter={

  }
  componentDidMount() {
    // const token = Cookies.get();
    // console.log(token)
    axios
      .get('http://localhost:8080/getUsers')
      .then(response => {
        this.setState({
          users: response.data,
          waitingForUsers: false,
        })
      })
    axios
      .get(`http://localhost:8080/discoverSavedPlaces/tawernke`)
      .then(response => {
        if(response.data.length > 0) {
          this.setState({
            savedPlaces: response.data[0].places,
          })
        }
      })
  }
  
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
            {/* <Menu.Item key="3">Logout</Menu.Item> */}
          </Menu>
        </Header>
        <div className="app">
          <Switch>
            <Route exact path="/" render={() => <Homepage history={this.props.history}/>} />
            <Route exact path="/signup" render={() => <Signup />} />
            <Route path="/discover" render={() => (
              <PleaseSignIn>
                <Query query={ALL_PLACES_QUERY}>
                  {({ data, error, loading }) => {
                    if(loading) return <p>Loading..,</p>
                    if(error) return <p>Error: {error.message}</p>
                  return (
                  <Discover 
                    savedPlaces={data.places}/>
                  )
                  }}
                </Query>
              </PleaseSignIn>
            )}/>
            <Route path="/:username" render={routeProps => <Profile {...routeProps} {...this.state} showModal={this.showModal} />} />
          </Switch>
        </div>
      </div>;
  }
}

export default App
