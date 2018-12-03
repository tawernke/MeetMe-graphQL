import React, { Component } from 'react'
import Favourites from './Favourites'
import ToDos from './ToDos'
import Preferences from './Preferences'
import PlacesModal from './PlacesModal'
import { Tabs, Icon, Upload, Checkbox } from 'antd'

const TabPane = Tabs.TabPane
const CheckboxGroup = Checkbox.Group

class YourPlaces extends Component {

  state = { 
    visible: false,
    place: {},
    isLoading: true,
    imageUrl: '',
    username: 'username'  
  }

  usersChange = (value, fullOption) => {
    this.props.addUsersCallendar(value, fullOption)
  }

  showModal = (placeId) => {
    const clickedPlace = this.props.currentUser[0].places.filter(place => {
        return place.id === placeId
      })
    this.setState({
      visible: true,
      place: clickedPlace[0],
      isLoading: false
    })
  }

  handleOk = (e) => {
    this.setState({
      visible: false,
    })
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    })
  }

  render() {
    // const profileToDos = this.props.currentUser[0].places.filter(place => {
    //   return place.type === 'todo'
    // })
    // const profileFavourites = this.props.currentUser[0].places.filter(place => {
    //   return place.type === 'favourite'
    // })
    // const users = this.props.users.map(user => {
    //    user = {
    //     label:user.name,
    //     value:user.id
    //   }
    //   return user
    // })
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    )
    const imageUrl = this.state.imageUrl
    return(
      <div>
        <PlacesModal
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          place={this.state.place}
          isLoading={this.state.isLoading}
        />
        <img className="profile-picture" src="./Tim_Wernke.jpg" alt=""/>
        {/* <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="//jsonplaceholder.typicode.com/posts/"
        beforeUpload={this.beforeUpload}
        onChange={this.handleChange}
        > */}
        {/* {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
        </Upload> */}
        <Tabs defaultActiveKey="1">
          <TabPane tab={<span><Icon type="star" />To Try</span>} key="1">
            <ToDos 
            // toDoPlaces={profileToDos}
            addPlace={this.props.addPlace}
            showModal={this.showModal}
            />
          </TabPane>
          <TabPane tab={<span><Icon type="heart" />Favourites</span>} key="2">
            <Favourites 
            // favouritePlaces={profileFavourites}
            addPlace={this.props.addPlace}
            showModal={this.showModal}
            />
          </TabPane>
        </Tabs>
        <Preferences
          currentUser={this.props.currentUser}
          />
        {/* <MultiSelect 
          users={this.props.users}
          usersChange={this.usersChange}
          /> */}
        
        <CheckboxGroup
          // options={users}
          onChange={this.props.checkBoxClick}
          />
      </div>
    )
  }
}

export default YourPlaces