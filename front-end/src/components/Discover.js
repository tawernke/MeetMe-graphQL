import React, { Component } from 'react'
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import axios from 'axios'
import {Redirect} from 'react-router-dom'
import Place from './Place'
import {Spin} from 'antd'

//This page is in progress to create a new apollo client that reaches the YELP GraphQL API endpoint
const httpLink = createHttpLink({
  uri: "https://api.yelp.com/v3/graphql",
  fetchOptions: {
    mode: "no-cors"
  }
});

// const authLink = setContext((_, { headers }) => {
//   const token = "qHwBybthx8SOAu_231Jff9xKWrt9cq3p2lc1oytmPLmQSdyizg4mVm2wWVTgx9yjkvH-nJrNLdpnhoQRs0fhSWgZ8Ef1aQCAzPf15zPn6WC2nxLiDmpGiwOmGGm-WnYx";
//   // return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       ...headers,
//       authorization: `Bearer ${token}`,
//       'Content-Type': 'application/graphql',
//     }
//   }
// });

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = "qHwBybthx8SOAu_231Jff9xKWrt9cq3p2lc1oytmPLmQSdyizg4mVm2wWVTgx9yjkvH-nJrNLdpnhoQRs0fhSWgZ8Ef1aQCAzPf15zPn6WC2nxLiDmpGiwOmGGm-WnYx";
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      // ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const yelpClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

const YELP_PLACES_QUERY = gql`
  query YELP_PLACES_QUERY{
    search(term: "burrito", location: "san francisco") {
    total
    business {
      name
      rating
      review_count
      location {
        address1
        city
        state
        country
      }
    }
  }
}
`

// const ALL_PLACES_QUERY = gql`
//   query ALL_PLACES_QUERY($id: ID!) {
//     places(userId: $id) {
//       id
//       address
//       city
//       country
//       image
//       name
//       phone
//       rating
//       state
//       type
//       zip
//       price
//     }
//   }
// `;

class Discover extends Component {
  
  state = {
    placeSuggestions: [],
    savedPlaces: [],
    redirect: false,
    city: '',
    street: '',
    streetNumber: '',
    isLoading: true,
    showingSearchResults: false
  }

  // componentDidMount() {
  //   const location = new Promise((resolve, reject) => {
  //     navigator.geolocation.getCurrentPosition(pos => {
  //       const coord = {
  //         lat: pos.coords.latitude,
  //         long: pos.coords.longitude
  //       }
  //       resolve(coord)
  //     })
  //   })
  //   location
  //     .then(res => {
  //       axios
  //         .get(`http://localhost:8080/discover/${res.lat}/${res.long}/`)
  //         .then(response => {
  //           this.setState({
  //             placeSuggestions: response.data.businesses,
  //             isLoading: false,
  //           })
  //         })
  //     })
  // }

  searchPlaces = (e) => {
    e.preventDefault()
    const form = e.target
    const searchTerms = {
      location: form.location.value,
      keyWord: form.searchTerm.value,
    }
    axios
      .get(`http://localhost:8080/discoverSearch/${searchTerms.location}/${searchTerms.keyWord}`)
      .then(response => {
        this.setState({
          placeSuggestions: response.data.businesses,
          showingSearchResults: true
        })
      })
  }
  
  render() {
    
    if(this.state.redirect) return <Redirect to='/'/>

    const placeJSX = this.state.placeSuggestions.map((placeSuggestion, i) => {
      const isToDoSaved = this.props.savedPlaces.filter(savedPlace => {
        return placeSuggestion.name === savedPlace.name && savedPlace.type === "todo"
      })
      const isFavouriteSaved = this.props.savedPlaces.filter(savedPlace => {
        return placeSuggestion.name === savedPlace.name && savedPlace.type === "favourite"
      })
      const singlePlace = {
        name: placeSuggestion.name,
        address: placeSuggestion.location.address1,
        city: placeSuggestion.location.city,
        state: placeSuggestion.location.state,
        zip: placeSuggestion.location.zip_code,
        country: placeSuggestion.location.country,
        image: placeSuggestion.image_url,
        rating: placeSuggestion.rating,
        phone: placeSuggestion.phone,
        key:i,
        price: placeSuggestion.price,
      }
      return <Place
        place={singlePlace}
        isToDoSaved={isToDoSaved}
        isFavouriteSaved={isFavouriteSaved}
        />
    })
    const {streetNumber, street, city, showingSearchResults} = this.state
    return(
      <Query query={YELP_PLACES_QUERY} client={yelpClient}>
        {({data, error, loading}) => {
          if(loading) return <p>Loading..,</p>
          if(error) return <p>Error: {error.message}</p>
          console.log(data)
          return (
          <div className="discover-page">
        {this.state.isLoading ? <div className="discover-spin">{<Spin size="large" />}</div> :
        <div>
        {showingSearchResults ? <h4 className="discover-search-heading">Search Results</h4> :
        <div>
          <h5 className="discover-current-address">{streetNumber}, {street}, {city}</h5><img className="discover-location-icon" alt="" src="/location_on-24px.svg"/>
          <h4 className="discover-location-heading" >Showing places near you</h4>
        </div>
        }
        <form className="discover-form-search" onSubmit={(e) => {this.searchPlaces(e)}}>
          <input className="discover-search-textbox form-control" name="location" placeholder ="Add a location here"/>
          <input className="discover-search-textbox form-control" name="searchTerm" placeholder ="Add a search term here. (eg. coffee, bar)"/>
          <button className="btn btn-primary" type="submit">Search</button>
        </form>
        <div className="discover-container">
          <div className="row justify-content-center">
            <div className="card-deck">       
              {placeJSX}
              {/* <Query query={ALL_PLACES_QUERY} variables={}>
                  {({ data, error, loading }) => {
                    if(loading) return <p>Loading..,</p>
                    if(error) return <p>Error: {error.message}</p>

                }}
              </Query> */}
            </div>
          </div>
        </div>
        </div>
        }
      </div>
          )}}
      </Query>
    )
  }
}

export default Discover