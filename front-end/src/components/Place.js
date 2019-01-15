import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { Icon} from 'antd'
import gql from 'graphql-tag'

const CREATE_PLACE_MUTATION = gql`
  mutation CREATE_PLACE_MUTATION(
    $address: String
    $city: String
    $country: String
    $image: String
    $name: String
    $phone: String
    $rating: Float
    $state: String
    $type: String
    $zip: String
    $price: String
  ) {
    createPlace(
      address: $address
      city: $city
      country: $country
      image: $image
      name: $name
      phone: $phone
      rating: $rating
      state: $state
      type: $type
      zip: $zip
      price: $price
    ) {
      id
      address
      city
      country
      image
      name
      phone
      rating
      state
      type
      zip
      price
      user {
        id
        name
      }
    }
  }
`;

class Place extends Component {

  createPlace = async (e, createPlaceMutation, placeType) => {
    const variables =
      {
        type: placeType,
        ...this.props.place
      }
      await createPlaceMutation({variables})
  }

  render() {
    const {name, address, image, rating, phone, price} = this.props.place
    return(
      <Mutation 
        mutation={CREATE_PLACE_MUTATION} 
        variables={this.props.place}
        >
        {(createPlace, { loading, error }) => (
          <div className="justify-content-center col-xl-3 col-lg-4 col-sm-6 col-xs-12 discover-card">
            <div className="card">
              <img className="card-img-top" src={image} alt='' />
              <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <p className="card-text">{address} </p>
                <p className="card-text">{phone} </p>
                <p className="card-text">Rating: {rating} </p>
                <p className="card-text">Price: {price} </p>
                {
                  this.props.isToDoSaved.length > 0 ? 
                    <Icon 
                      className="saveIcon" 
                      type="star" theme="filled" 
                      style={{ fontSize: 25, color: '#FDBE34' }} 
                      onClick={() => this.props.deletePlace(this.props.isToDoSaved[0].id)} /> :
                    <Icon 
                      className="saveIcon" 
                      type="star" theme="outlined" 
                      style={{ fontSize: 25, color: '#FDBE34' }} 
                      onClick={e => this.createPlace(e, createPlace, 'todo')}/>
                }
                {
                  this.props.isFavouriteSaved.length > 0 ? 
                    <Icon 
                      className="saveIcon" 
                      type="heart" theme="filled" 
                      style={{ fontSize: 25, color: "red" }} 
                      onClick={() => this.props.deletePlace(this.props.isFavouriteSaved[0].id)} /> :
                    <Icon 
                      className="saveIcon" 
                      type="heart" 
                      theme="outlined" 
                      style={{ fontSize: 25, color: 'red' }} 
                      onClick={e => this.createPlace(e, createPlace, 'favourite')} />
                }
              </div>
            </div>
          </div>
        )}
      </Mutation>
    )
  }
}

export default Place

