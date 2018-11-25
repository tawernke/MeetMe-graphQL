import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import { Select } from 'antd'
import 'antd/dist/antd.css'

const Option = Select.Option

class NavBarSearch extends Component {

  state = {
    redirect: false,
    redirectUrl: '',
    fireRedirect: false
  }
  
  onSelect = (value) => {
    const redirectUrl = `/${value}`
    this.props.history.push(redirectUrl)
    window.location.reload()

    this.setState({
      fireRedirect: true,
      redirectUrl: `/${value}`
    })
  }
  
  render() {

    const usersJSX = this.props.users.map((user, i) => {
      return <Option key={user.id} value={user.id}>{user.name}</Option>
    })
    return(
      <div>
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Search other profiles"
        optionFilterProp="children"
        onSelect={this.onSelect}
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        {usersJSX}
      </Select>
        {this.state.fireRedirect ? <Redirect to={`${this.state.redirectUrl}`}/> : null }
      </div>
    )
  }
}

export default NavBarSearch