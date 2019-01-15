import React, {Component} from 'react'
import { Select } from 'antd'
import 'antd/dist/antd.css'

const Option = Select.Option;

class MultiSelect extends Component {
  
  render() {
    const allUsersJSX = this.props.allUsers.map(user => {
      return <Option key={user.id}>{user.name}</Option>;
    });
    let users
    if(this.props.eventUsers) {
      users = this.props.eventUsers.map(user => {
        return user.id
      })
    }
    return(
      <div className="multi-select-div">
        <Select
          name="user"
          mode="multiple"
          defaultValue={users}
          style={{ width: '100%', height: '50px' }}
          placeholder="Please select"
          onChange={this.props.addUsersToState}
          >
          {allUsersJSX}
        </Select>
      </div>
    )
  }
}

export default MultiSelect