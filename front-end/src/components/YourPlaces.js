import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo'
import gql from 'graphql-tag'
import ProfilePlaces from './ProfilePlaces'
import Preferences from './Preferences'
import PlacesModal from './PlacesModal'
import { Tabs, Icon, Checkbox } from 'antd'

const TabPane = Tabs.TabPane
const CheckboxGroup = Checkbox.Group

const UPDATE_USER_MUTATION = gql`
  mutation UPDATE_USER_MUTATION(
    $id: ID!, 
    $image: String!
    ) {
    updateUser(id: $id, image: $image) {
      id
    }
  }
`;

const SINGLE_USER_QUERY = gql`
  query SINGLE_USER_QUERY($id: ID!) {
    user(id: $id) {
      id
      image
      name
    }
  }
`

class YourPlaces extends Component {
  state = {
    visible: false,
    place: {},
    loading: false,
    image: "",
    largeImage: '',
  };

  usersChange = (value, fullOption) => {
    this.props.addUsersCallendar(value, fullOption);
  };

  showModal = place => {
    this.setState({
      visible: true,
      place: place
    });
  };

  closeModal = () => {
    this.setState({
      visible: false
    });
  };

  uploadPhoto = async (event, updateUserMutation) => {
    const files = event.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "meetMe");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/da7dkfklm/image/upload",
      {
        method: "POST",
        body: data
      }
    );
    const file = await res.json();
    const variables = 
      {
        id: this.props.match.params.username,
      image: file.secure_url
      }
    updateUserMutation({ variables })
    this.setState({
      image: file.secure_url,
    });
  };

  render() {
    return (
      <Query 
        query={SINGLE_USER_QUERY}
        variables={{
          id: this.props.match.params.username
        }}
      >
        {({data, loading}) => {
          if (loading) return <p>Loading...</p>;
          return(
            <Mutation
              mutation={UPDATE_USER_MUTATION}
              variables={{ id: this.props.match.params, image: "test" }}
              refetchQueries={[{ SINGLE_USER_QUERY }]}
            >
              {(updateUser, { loading, error }) => {
                if (loading) return <p>Loading...</p>
                if (error) return <p>Error: {error.message}</p>
                return <React.Fragment>
                  <h1>Meet {data.user.name}</h1>
                  <PlacesModal visible={this.state.visible} onOk={this.closeModal} onCancel={this.closeModal} place={this.state.place} isLoading={this.state.isLoading} />
                  {this.state.image || data.user.image ? <img src={this.state.image || data.user.image} alt="" /> : <div className="upload-btn-wrapper">
                    <Icon className="upload-icon" type="user-add" />
                    <input type="file" onChange={e => this.uploadPhoto(e, updateUser)} name="myfile" />
                  </div>}
                  <Tabs defaultActiveKey="1">
                    <TabPane tab={<span>
                      <Icon type="star" />
                      To Try
                  </span>} key="1">
                      <ProfilePlaces showModal={this.showModal} match={this.props.match} type={"todo"} />
                    </TabPane>
                    <TabPane tab={<span>
                      <Icon type="heart" />
                      Favourites
                  </span>} key="2">
                      <ProfilePlaces showModal={this.showModal} match={this.props.match} type={"favourite"} />
                    </TabPane>
                  </Tabs>
                  <Preferences currentUser={this.props.currentUser} />
                  <CheckboxGroup onChange={this.props.checkBoxClick} />
                </React.Fragment>;
              }}
            </Mutation>
          )
        }}
      </Query>
    )
  }

}

export default YourPlaces