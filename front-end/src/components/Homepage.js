import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'

const usernameStorageKey = 'USERNAME'

class Homepage extends Component {

  state = {
    redirect: false,
    redirectUrl: ''
  }

  componentDidMount() {
    if (localStorage.getItem('USERNAME') !== null) {
      const loggedInUser = JSON.parse(localStorage.getItem(usernameStorageKey)).id
      this.setState({
        redirect: true,
        redirectUrl: `/${loggedInUser}`
      })
    }
  }
  
  render() {
    if(this.state.redirect) return <Redirect to={this.state.redirectUrl}/>
    return(
      <div className="row justify-content-center">
      <div className="card login-card">
        <img className="card-img-top" alt="" src="/logo.png"/>
        <div className="card-body">
          <form onSubmit={this.props.addUser}>
            <input name="name" className="form-control" placeholder="Enter your name here"/>
            <input name="username" className="form-control" placeholder="Enter your username here"/>
            <button type="submit" className="btn btn-primary logon-button">Login</button>
          </form>
        </div>
      </div>
      </div>
    )
  }
}

export default Homepage