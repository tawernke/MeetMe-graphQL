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
        if (loading) return <p></p>;
        const yelpPlaces = props.places.map(place => {
          if (!data) return null;
          let newPlace = {};
          data.places.forEach(savedPlace => {
            if (
              place.name === savedPlace.name &&
              savedPlace.type === "favourite"
            ) {
              newPlace.favouriteId = savedPlace.id;
            }
            if (place.name === savedPlace.name && savedPlace.type === "todo") {
              newPlace.toDoId = savedPlace.id;
            }
          });
          return (
            <Place
              key={newPlace.Id}
              place={{
                toDoId: newPlace.toDoId,
                favouriteId: newPlace.favouriteId,
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
              isToDoSaved={newPlace.isToDoSaved}
              isFavourited={newPlace.isFavourited}
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
