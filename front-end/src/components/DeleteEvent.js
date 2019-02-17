import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { ALL_USER_EVENTS_QUERY } from "./Profile";

const DELETE_EVENT_MUTATION = gql`
  mutation DELETE_EVENT_MUTATION($id: ID!) {
    deleteEvent(id: $id) {
      id
    }
  }
`;

class DeleteEvent extends Component {
  update = (cache, payload) => {
    //manually update the cache on the client so it matches the server
    //1. Query the cache for the events we want
    const data = cache.readQuery({
      query: ALL_USER_EVENTS_QUERY,
      variables: {
        id: this.props.userId
      }
    });
    //2. Filter the deleted event out of the page
    data.events = data.events.filter(
      event => event.id !== payload.data.deleteEvent.id
    );
    //3. put the events back
    cache.writeQuery({ query: ALL_USER_EVENTS_QUERY, data });
  };

  deleteEvent = async (e, deleteEventMutation) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this event?")) {
      await deleteEventMutation().then(() =>
        this.props.history.push(`/${this.props.userId}`)
      ).catch(err => {
        alert(err.message);
      });
    }
  };

  render() {
    return (
      <Mutation
        mutation={DELETE_EVENT_MUTATION}
        variables={{ id: this.props.eventId }}
        refetchQueries={[
          {
            query: ALL_USER_EVENTS_QUERY,
            variables: {
              id: this.props.userId
            }
          }
        ]}
        update={this.update}
      >
        {(deleteEvent, { error }) => {
          return (
            <button
              type="submit"
              className="btn btn-danger"
              onClick={e => this.deleteEvent(e, deleteEvent)}
            >
              Delete Event
            </button>
          );
        }}
      </Mutation>
    );
  }
}

export default DeleteEvent;
