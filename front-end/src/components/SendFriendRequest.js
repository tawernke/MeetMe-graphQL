import React, { Component } from "react";
import { Modal } from "antd";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { SINGLE_USER_QUERY } from "./YourPlaces";

const ADD_FRIEND_MUTATION = gql`
  mutation ADD_FRIEND_MUTATION(
    $email: String!
    $friendRequester: String!
    $id: ID
  ) {
    sendFriendRequest(
      email: $email
      friendRequester: $friendRequester
      id: $id
    ) {
      message
    }
  }
`;

class SendFriendRequest extends Component {
  sendFriendRequest =  (event, sendFriendRequest, newFriendDetails) => {
    sendFriendRequest({
      variables: {
        email: newFriendDetails.email,
        id: this.props.friendRequestId,
        friendRequester: this.props.me.name
      }
    });
    this.props.onCancel()
  };

  render() {
    return (
      <Query
        query={SINGLE_USER_QUERY}
        variables={{ id: this.props.friendRequestId }}
      >
        {({ data, error, loading }) => {
          if (loading) return null
          return (
            <Mutation mutation={ADD_FRIEND_MUTATION}>
              {(sendFriendRequest, { error, loading }) => {
                return (
                  <Modal
                    visible={this.props.visible}
                    onOk={event =>
                      this.sendFriendRequest(event, sendFriendRequest, data.user)
                    }
                    onCancel={this.props.onCancel}
                    height={500}
                  >
                    <img src={data.user.image} alt={data.user.name}/>
                    <p>Would you like to add {data.user.name} as a friend?</p>
                  </Modal>
                );
              }}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default SendFriendRequest;
