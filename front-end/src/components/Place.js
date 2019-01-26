import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { Icon } from "antd";
import gql from "graphql-tag";
import { ALL_PLACES_QUERY } from "./Places";

const CREATE_PLACE_MUTATION = gql`
  mutation CREATE_PLACE_MUTATION(
    $address1: String
    $city: String
    $country: String
    $image: String
    $name: String
    $phone: String
    $rating: Float
    $state: String
    $type: String
    $postal_code: String
    $price: String
  ) {
    createPlace(
      address1: $address1
      city: $city
      country: $country
      image: $image
      name: $name
      phone: $phone
      rating: $rating
      state: $state
      type: $type
      postal_code: $postal_code
      price: $price
    ) {
      id
      address1
      city
      country
      image
      name
      phone
      rating
      state
      type
      postal_code
      price
      user {
        id
        name
      }
    }
  }
`;

const DELETE_PLACE_MUTATION = gql`
  mutation DELETE_PLACE_MUTATION($id: ID!) {
    deletePlace(id: $id) {
      id
    }
  }
`;

class Place extends Component {
  createPlace = async (e, createPlaceMutation, placeType) => {
    await createPlaceMutation({
      variables: {
        type: placeType,
        ...this.props.place
      },
      refetchQueries: [
        {
          query: ALL_PLACES_QUERY
        }
      ]
    });
  };

  deletePlace = async(placeId, deletePlaceMutation) => {
    await deletePlaceMutation({
      variables: {id: placeId},
      refetchQueries: [{
        query: ALL_PLACES_QUERY
      }]
    })
  };

  render() {
    const { image, name, address1, phone, rating, price } = this.props.place;
    return (
      <Mutation mutation={CREATE_PLACE_MUTATION}>
        {(createPlace, { loading, error }) => (
          <div className="justify-content-center col-xl-3 col-lg-4 col-sm-6 col-xs-12 discover-card">
            <div className="card">
              <img className="card-img-top" src={image} alt="" />
              <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <p className="card-text">{address1}</p>
                <p className="card-text">{phone} </p>
                <p className="card-text">Rating: {rating} </p>
                <p className="card-text">Price: {price} </p>
                <Mutation mutation={DELETE_PLACE_MUTATION}>
                  {(deletePlace, { error, loading }) => {
                    return (
                      <>
                        {this.props.isToDoSaved ? (
                          <Icon
                            className="saveIcon"
                            type="star"
                            theme="filled"
                            style={{ fontSize: 25, color: "#FDBE34" }}
                            onClick={() =>
                              this.deletePlace(this.props.place.id, deletePlace)
                            }
                          />
                        ) : (
                          <Icon
                            className="saveIcon"
                            type="star"
                            theme="outlined"
                            style={{ fontSize: 25, color: "#FDBE34" }}
                            onClick={e =>
                              this.createPlace(e, createPlace, "todo")
                            }
                          />
                        )}
                        {this.props.isFavourited ? (
                          <Icon
                            className="saveIcon"
                            type="heart"
                            theme="filled"
                            style={{ fontSize: 25, color: "red" }}
                            onClick={() =>
                              this.deletePlace(this.props.place.id, deletePlace)
                            }
                          />
                        ) : (
                          <Icon
                            className="saveIcon"
                            type="heart"
                            theme="outlined"
                            style={{ fontSize: 25, color: "red" }}
                            onClick={e =>
                              this.createPlace(e, createPlace, "favourite")
                            }
                          />
                        )}
                      </>
                    );
                  }}
                </Mutation>
              </div>
            </div>
          </div>
        )}
      </Mutation>
    );
  }
}

export default Place;
