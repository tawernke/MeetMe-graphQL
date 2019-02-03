import React, { Component } from "react";
import { Query } from "react-apollo";
import MultiSelectUsers from "./MultiSelectUsers";
import { ALL_USERS_QUERY } from "./EventDetails";

class OverlayCalendar extends Component {
  render() {
    return (
      <div>
        <Query query={ALL_USERS_QUERY}>
          {({ error, loading, data }) => {
            if (loading) return <p>Loading...</p>;
            return (
              <MultiSelectUsers
                allUsers={data.users}
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
