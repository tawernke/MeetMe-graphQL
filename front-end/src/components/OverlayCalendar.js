import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from 'graphql-tag'
import MultiSelectUsers from "./MultiSelectUsers";

const ALL_FRIENDS_QUERY = gql`
  query ALL_FRIENDS_QUERY {
    friends {
      id
      name
    }
  }
`

class OverlayCalendar extends Component {
  render() {
    return (
      <div>
        <Query query={ALL_FRIENDS_QUERY}>
          {({ error, loading, data }) => {
            if (loading) return <p>Loading...</p>;
            console.log(data)
            return (
              <MultiSelectUsers
                allUsers={data.friends}
                addUsersToState={this.props.addOverlayCalendar}
              />
            );
          }}
        </Query>
      </div>
    );
  }
}

export default OverlayCalendar;
