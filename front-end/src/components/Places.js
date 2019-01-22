import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Place from "./Place";

const ALL_PLACES_QUERY = gql`
  query ALL_PLACES_QUERY($id: ID!) {
    places(userId: $id) {
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
    }
  }
    me{
      name
      id
    }
`;

const Places = props => {
  return (
    <Query query={ALL_PLACES_QUERY} variables={{id: "cjp7mzgfh904e0a621qk0iugc"}}>
      {({ data, error, loading }) => {
        if (loading) return <p>Loading...</p>;
        console.log(data)
        return props.places.map(place => {
          return <Place place={place} />;
        });
      }}
    </Query>
  );
};

export default Places;
