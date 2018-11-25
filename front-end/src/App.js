import React, { Component } from 'react'
import Navbar from './components/Navbar'
import Homepage from './components/Homepage'
import Profile from './components/Profile'
import Discover from './components/Discover'
import {Route, Switch, withRouter} from 'react-router-dom'
import axios from 'axios'
import './App.css'

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
    const loggedInUser = JSON.parse(localStorage.getItem(usernameStorageKey))
    axios
      .get('http://localhost:8080/getUsers')
      .then(response => {
        this.setState({
          users: response.data,
          waitingForUsers: false,
          loggedInUser
        })
      })

    if (localStorage.getItem('USERNAME') !== null) {
      axios
        .get(`http://localhost:8080/discoverSavedPlaces/${loggedInUser.username}`)
        .then(response => {
          if(response.data.length > 0) {
            this.setState({
              savedPlaces: response.data[0].places,
            })
          }
        })
    }
  }

  addPlace = (newPlace) => {
    const loggedInUserId = JSON.parse(localStorage.getItem(usernameStorageKey)).id
    newPlace.user_id = [loggedInUserId]
    axios
      .post('http://localhost:8080/newPlace', newPlace)
      .then(response => {
        const newPlacesState = this.state.savedPlaces.concat(response.data)
        this.setState({
          savedPlaces: newPlacesState
        })
      })
  }

  deletePlace = (placeIdToDelete) => {
    const remainingPlaces = this.state.savedPlaces.filter(place => {
      return place.id !== placeIdToDelete
    })
    this.setState({
      savedPlaces: remainingPlaces
    })
    axios
      .delete('http://localhost:8080/place', {data: {placeId: placeIdToDelete}})
    }
  
  addUser = (e) => {
    e.preventDefault()
    const newUser = {
      username: e.target.username.value,
      name: e.target.name.value
    }
    const existingUser = this.state.users.find(user => {
      return user.username.toLowerCase() === newUser.username.toLowerCase()
    })
    if(existingUser) {
      localStorage.setItem(usernameStorageKey, JSON.stringify(existingUser))
      this.props.history.push(`/${existingUser.id}`)
      this.setState({
        imageChange: true
      })
    }
    else {
      axios
        .post('http://localhost:8080/addUser', newUser)
        .then(response => {
          localStorage.setItem(usernameStorageKey, JSON.stringify(response.data))
          this.setState({
            loggedInUser: response.data,
            imageChange: true
          }, () => window.location.reload())
        })
    }
  }

  logOut = () => {
    this.setState({
      currentUser: {}
    }, () => localStorage.removeItem(usernameStorageKey))
    window.location.reload()
  }
  
  render() {
    const {loggedInUser, imageChange} = this.state
    return(
      <div className="entire-app" style={!loggedInUser && !imageChange ? this.styleBefore : this.styleAfter}>
      <Navbar 
        logOut={this.logOut}
        users={this.state.users}
        history={this.props.history}
      />
      <div className="app">
        <Switch>
          <Route 
          exact path='/' 
          render={() => <Homepage
            addUser={this.addUser}
            logout={this.logout}
            loggedInUser={this.state.loggedInUser}
            />}
          />
          <Route
            path='/discover'
            render={() => <Discover
              addPlace={this.addPlace}
              savedPlaces={this.state.savedPlaces}
              deletePlace={this.deletePlace}
            />}
          />
          <Route
            path='/:username'
            render={(routeProps) => <Profile
              {...routeProps}
              { ...this.state}
              showModal={this.showModal}
            />}
          />
        </Switch>
      </div>
      </div>
    )
  }
}

export default withRouter (App)
