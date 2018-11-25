import React, { Component } from 'react'
import 'antd/dist/antd.css'
import NavBarSearch from './NavBarSearch'

const usernameStorageKey = 'USERNAME'

class Navbar extends Component {

  state = {
    homeUrl: ''
  }

  componentDidMount() {
    if (localStorage.getItem('USERNAME') !== null) {
      let url = '/' + JSON.parse(localStorage.getItem(usernameStorageKey)).id
      this.setState({
          homeUrl: url
        })
    }
  }

  homepage = (e) => {
    e.preventDefault()
    this.props.history.push(this.state.homeUrl)
  }

  discover = (e) => {
    e.preventDefault()
    this.props.history.push('/discover')
  }

  render() {
    return(
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <ul className="navbar-nav nav-left">
            <NavBarSearch 
              users={this.props.users}
              history={this.props.history}
              />
          </ul>
          <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
            <li className="nav-item active">
              <a className="nav-link" onClick={this.homepage} href="">Home <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" onClick={this.discover} >Discover</a>
            </li>
            
            <li className="nav-item">
              <a className="nav-link" onClick={this.props.logOut} href="">Logout</a>
            </li>
          </ul>
        </div>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
      </nav>
    )
  }
}

export default Navbar