import React, { Component } from "react";
import { Modal } from "antd";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { SINGLE_USER_QUERY } from "./YourPlaces";

const ADD_FRIEND_MUTATION = gql`
  mutation ADD_FRIEND_MUTATION(
    $email: String!
    $friendRequester: String!
  ) {
    sendFriendRequest(
      email: $email
      friendRequester: $friendRequester
    ) {
      message
    }
  }
`;

class AddFriend extends Component {
  sendFriendRequest = async (event, sendFriendRequest, newFriendDetails) => {
    await sendFriendRequest({
      variables: {
        email: newFriendDetails.email,
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
          if (loading) return <p>loading...</p>;
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
                    <img src={data.user.image} />
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

export default AddFriend;
