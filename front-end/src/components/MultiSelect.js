import React, {Component} from 'react'
import { Select } from 'antd'
import 'antd/dist/antd.css'

const Option = Select.Option;

class MultiSelect extends Component {

  usersChange = (userId, allUsers) => {
    const userIds = allUsers.map(user => {
      if(isNaN(Number(user.key))) {
         const oldUser =  this.props.eventUsers.find(userObj => {
           return user.key === userObj.name
         })
         return oldUser.id
      } else {
        return Number(user.key)
      }
    })
    this.props.selectedUsers(userIds)
  }
  
  render() {
    const usersJSX = this.props.users.map(user => {
      return <Option key={user.id}>{user.name}</Option>
    })
    return(
      <div className="multi-select-div">
        <Select
          mode="multiple"
          defaultValue={this.props.currentEventUserNames}
          style={{ width: '100%', height: '50px' }}
          placeholder="Please select"
          onChange={this.usersChange}
          >
          {usersJSX}
        </Select>
      </div>
    )
  }
}

export default MultiSelect