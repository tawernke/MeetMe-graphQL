import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Places from "./Places";
import { Spin } from "antd";

const YELP_PLACES_QUERY = gql`
  query YELP_PLACES_QUERY($latitude: Float, $longitude: Float) {
    favoriteBusinesses(latitude: $latitude, longitude: $longitude) {
      business {
        name
        phone
        price
        location {
          address1
          city
          state
          postal_code
          country
        }
        photos
        rating
      }
    }
  }
`;

class Discover extends Component {
  state = {
    placeSuggestions: [],
    savedPlaces: [],
    redirect: false,
    city: "",
    street: "",
    streetNumber: "",
    isLoading: true,
    location: ""
  };

  componentDidMount() {
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(pos => {
        const coord = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };
        resolve(coord);
      });
    }).then(coord =>
      this.setState({
        location: coord,
        isLoading: false
      })
    );
  }

  render() {
    const { streetNumber, street, city } = this.state;
    return (
      <>
      {this.state.isLoading ? <p>Loading...</p> : 
      <Query query={YELP_PLACES_QUERY} variables={this.state.location}>
        {({ data, error, loading }) => {
          if (loading) return <Spin />;
          if (error) return <p>Error: {error.message}</p>;
          console.log(data.favoriteBusinesses.business);
          return <div className="discover-page">
              <div>
                <div>
                    <h5 className="discover-current-address">
                      {streetNumber}, {street}, {city}
                    </h5>
                    <img className="discover-location-icon" alt="" src="/location_on-24px.svg" />
                    <h4 className="discover-location-heading">
                      Showing places near you
                    </h4>
                  </div>
                <form className="discover-form-search" onSubmit={e => {
                    this.searchPlaces(e);
                  }}>
                  <input className="discover-search-textbox form-control" name="location" placeholder="Add a location here" />
                  <input className="discover-search-textbox form-control" name="searchTerm" placeholder="Add a search term here. (eg. coffee, bar)" />
                  <button className="btn btn-primary" type="submit">
                    Search
                  </button>
                </form>
                <div className="discover-container">
                  <div className="row justify-content-center">
                    <div className="card-deck">
                    <Places places={data.favoriteBusinesses.business}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>;
        }}
      </Query>
      }
      </>
    );
  }
}

export default Discover;
