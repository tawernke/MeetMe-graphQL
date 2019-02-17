import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { ALL_USERS_QUERY } from "./EventDetails";

const ACCEPT_FRIEND_REQUEST_MUTATION = gql`
  mutation ACCEPT_FRIEND_REQUEST_MUTATION($id: ID!) {
    acceptFriendRequest(id: $id) {
      id
      name
    }
  }
`;

class AcceptFriendRequest extends Component {

  acceptRequest = async (e, acceptFriendRequest) => {
    e.preventDefault()
    await acceptFriendRequest({
      variables: {
        id: this.props.match.params.friendId
      },
      refetchQueries: [{
        query: ALL_USERS_QUERY
      }]
    })
    this.props.history.push(`/${this.props.match.params.friendId}`)
  }

  render() {
    return (
      <Mutation mutation={ACCEPT_FRIEND_REQUEST_MUTATION}>
        {(acceptFriendRequest, { error, loading }) => {
          return (
            <div>
              <p>Would you like to accept the friend request?</p>
              <button onClick={(e) => this.acceptRequest(e, acceptFriendRequest)}>Yes</button>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default AcceptFriendRequest;
