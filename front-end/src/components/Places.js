import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Place from "./Place";

const ALL_PLACES_QUERY = gql`
  query ALL_PLACES_QUERY {
    places {
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

const Places = props => {
  return (
    <Query query={ALL_PLACES_QUERY}>
      {({ data, error, loading }) => {
        if (loading) return <p>Loading...</p>;
        console.log(data);
        const yelpPlaces = props.places.map(place => {
          let isToDoSaved = false;
          let isFavourited = false;
          if (data) {
            isToDoSaved = data.places.some(toDo => {
              return place.name === toDo.name && toDo.type === "todo";
            });
            isFavourited = data.places.some(savedPlace => {
              return (
                place.name === savedPlace.name &&
                savedPlace.type === "favourite"
              );
            });
          }
          return (
            <Place
              place={{
                address1: place.location.address1,
                city: place.location.city,
                country: place.location.country,
                image: place.photos[0],
                name: place.name,
                phone: place.phone,
                rating: place.rating,
                state: place.location.state,
                postal_code: place.location.postal_code,
                price: place.price
              }}
              isToDoSaved={isToDoSaved}
              isFavourited={isFavourited}
            />
          );
        });
        return yelpPlaces;
      }}
    </Query>
  );
};

export default Places;
export { ALL_PLACES_QUERY };
