import React, { Component } from "react";
import { Select } from "antd";
import "antd/dist/antd.css";
import { Query } from "react-apollo";
import { ALL_USERS_QUERY } from "./EventDetails";

const Option = Select.Option;

class NavBarSearch extends Component {
  onSelect = value => {
    this.props.history.push(`/${value}`);
  };

  render() {
    return (
      <Query query={ALL_USERS_QUERY}>
        {({ data, error, loading }) => {
          if (loading) return <p>Loading...</p>;
          const userOptions = data.users.map(user => (
            <Option key={user.id} value={user.id}>{user.name}</Option>
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
    );
  }
}

export default NavBarSearch;
