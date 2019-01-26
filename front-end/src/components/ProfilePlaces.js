import React, { Component } from 'react'
import { Query } from "react-apollo";
import gql from "graphql-tag";

const ALL_PLACES_QUERY = gql`
  query ALL_PLACES_QUERY($id: ID! $type: String!) {
    places(userId: $id type: $type) {
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
    }
  }
`;

class Places extends Component {
  render() {
    return (
      <Query 
        query={ALL_PLACES_QUERY} 
        variables={{id: this.props.match.params.username, type: this.props.type}}
      >
        {({ data, error, loading }) => {
          if (loading) return <p>Loading...</p>
          if (error) return <p>Error: {error.message}</p>
          console.log(data)
          return <div>
              <ul className="your-places-list">
                {data.places.map(place => (
                  <li
                    key={place.id}
                    className="your-places-item"
                    onClick={() => this.props.showModal(place)}
                  >
                    {place.name}
                  </li>
                ))}
              </ul>
            </div>
        }}
      </Query>
    )
  }
}

export default Places