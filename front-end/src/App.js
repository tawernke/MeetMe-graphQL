import React, { Component } from 'react'
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Navbar from './components/Navbar'
import Homepage from './components/Homepage'
import Profile from './components/Profile'
import Discover from './components/Discover'
import Signup from './components/Signup'
import axios from 'axios'
import {Route, Switch} from 'react-router-dom'
import PleaseSignIn from "./components/PleaseSignIn";
import './App.css'

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
        console.log(response)
        if(response.data.length > 0) {
          this.setState({
            savedPlaces: response.data[0].places,
          })
        }
      })
  }

  // deletePlace = (placeIdToDelete) => {
  //   const remainingPlaces = this.state.savedPlaces.filter(place => {
  //     return place.id !== placeIdToDelete
  //   })
  //   this.setState({
  //     savedPlaces: remainingPlaces
  //   })
  //   axios
  //     .delete('http://localhost:8080/place', {data: {placeId: placeIdToDelete}})
  //   }
  
  // addUser = (e) => {
  //   e.preventDefault()
  //   const newUser = {
  //     username: e.target.username.value,
  //     name: e.target.name.value
  //   }
  //   const existingUser = this.state.users.find(user => {
  //     return user.username.toLowerCase() === newUser.username.toLowerCase()
  //   })
  //   if(existingUser) {
  //     localStorage.setItem(usernameStorageKey, JSON.stringify(existingUser))
  //     this.props.history.push(`/${existingUser.id}`)
  //     this.setState({
  //       imageChange: true
  //     })
  //   }
  //   else {
  //     axios
  //       .post('http://localhost:8080/addUser', newUser)
  //       .then(response => {
  //         localStorage.setItem(usernameStorageKey, JSON.stringify(response.data))
  //         this.setState({
  //           loggedInUser: response.data,
  //           imageChange: true
  //         }, () => window.location.reload())
  //       })
  //   }
  // }
  
  render() {
    // const {loggedInUser, imageChange} = this.state
    return <div>
        <Navbar history={this.props.history} />
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
