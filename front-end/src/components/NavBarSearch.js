import React, { Component } from "react";
import { Select } from "antd";
import "antd/dist/antd.css";
import { Query } from "react-apollo";
import { ALL_USERS_QUERY } from "./EventDetails";
import AddFriend from "./AddFriend";

const Option = Select.Option;

class NavBarSearch extends Component {
  state = {
    visible: false
  };

  onSelect = (userId, userDetails) => {
    const isFriends = userDetails.props.friends.some(user => {
      return user.id === this.props.me.id;
    });
    if (isFriends || userId === this.props.me.id) {
      this.props.history.push(`/${userId}`);
    } else {
      // this.props.history.push(`/addFriend`, [userDetails.props.children, userDetails.props.value]);
      this.setState({
        visible: true,
        friendRequestId: userId
      });
    }
  };

  closeModal = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    return (
      <>
        {this.state.visible ? (
          <AddFriend
            friendRequestId={this.state.friendRequestId}
            visible={this.state.visible}
            onOk={this.closeModal}
            onCancel={this.closeModal}
            place={this.state.place}
            me={this.props.me}
          />
        ) : null}
        <Query query={ALL_USERS_QUERY}>
          {({ data, error, loading }) => {
            if (loading) return <p>Loading...</p>;
            const userOptions = data.users.map(user => (
              <Option key={user.id} friends={user.friends} value={user.id}>
                {user.name}
              </Option>
            ));
            return (
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Search other profiles"
                optionFilterProp="children"
                onSelect={this.onSelect}
              >
                {userOptions}
              </Select>
            );
          }}
        </Query>
      </>
    );
  }
}

export default NavBarSearch;
