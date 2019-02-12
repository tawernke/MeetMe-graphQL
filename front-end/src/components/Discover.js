import React, { Component } from "react";
import { Query, ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";
import Places from "./Places";
import { Spin } from "antd";

const YELP_PLACES_QUERY = gql`
  query YELP_PLACES_QUERY($latitude: Float, $longitude: Float, $location: String, $term: String) {
    favoriteBusinesses(latitude: $latitude, longitude: $longitude, term: $term, location: $location) {
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
    city: '',
    street: '',
    streetNumber: '',
    isLoading: false,
    coordinates: {
      latitude:9.277371099999996, 
      longitude: -123.12789780000001
    },
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
        coordinates: coord,
        isLoading: false
      })
    );
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  searchResults = places => {
    this.setState({
      searchResults: places
    })
  }

  render() {
    const { streetNumber, street, city } = this.state;
    return (
      <>
        {this.state.isLoading ? (
          <p>Loading...</p>
        ) : (
          <ApolloConsumer>
            {client => {
              return (
                <Query
                  query={YELP_PLACES_QUERY}
                  variables={{
                    latitude: this.state.coordinates.latitude,
                    longitude: this.state.coordinates.longitude
                  }}
                >
                  {({ data, error, loading }) => {
                    if (loading) return <Spin />;
                    if (error) return <p>Error: {error.message}</p>;
                    return (
                      <div className="discover-page">
                        <div>
                          <div>
                            <h5 className="discover-current-address">
                              {streetNumber}, {street}, {city}
                            </h5>
                            <img
                              className="discover-location-icon"
                              alt=""
                              src="/location_on-24px.svg"
                            />
                            <h4 className="discover-location-heading">
                              Showing places near you
                            </h4>
                          </div>
                          <form
                            className="discover-form-search"
                            onSubmit={async e => {
                              e.preventDefault();
                              const { data } = await client.query(
                                {
                                  query: YELP_PLACES_QUERY,
                                  variables: {
                                    term: this.state.searchTerm,
                                    location: this.state.location
                                  }
                                }
                              );

                              this.searchResults(data.favoriteBusinesses.business)
                            }
                          }
                          >
                            <input
                              className="discover-search-textbox form-control"
                              name="location"
                              placeholder="Add a location here"
                              onChange={this.handleChange}
                            />
                            <input
                              className="discover-search-textbox form-control"
                              name="searchTerm"
                              placeholder="Add a search term here. (eg. coffee, bar)"
                              onChange={this.handleChange}
                            />
                            <button
                              className="btn btn-primary"
                              type="submit"
                            >
                              Search
                            </button>
                          </form>
                          <div className="discover-container">
                            <div className="row justify-content-center">
                              <div className="card-deck">
                                <Places
                                  places={
                                    this.state.searchResults || data.favoriteBusinesses
                                      .business
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                </Query>
              );
            }}
          </ApolloConsumer>
        )}
      </>
    );
  }
}

export default Discover;
