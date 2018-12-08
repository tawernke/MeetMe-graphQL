import React, { Component } from 'react'
import { Link } from "react-router-dom";
import 'antd/dist/antd.css'
import User from "./User";
import NavBarSearch from './NavBarSearch'

const usernameStorageKey = 'USERNAME'

class Navbar extends Component {

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
      <User>
            {({ data: { me }}) => (
              <div>
              <Link to="/">
                Home
              </Link>
              {me && (
                  <Link to="/discover">
                    Discover
                  </Link>
              )}
              {!me && (
                <Link to="/signup">
                  Sign up
                </Link>
              )}
              </div>
            )}
      </User>
    )}
}

export default Navbar