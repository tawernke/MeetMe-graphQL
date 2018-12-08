import React, { Component } from 'react'
import { Query } from "react-apollo";
import gql from "graphql-tag";
import axios from 'axios'
import {Redirect} from 'react-router-dom'
import Place from './Place'
import {Spin} from 'antd'

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
`;

const usernameStorageKey = 'USERNAME'

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

  componentDidMount() {
    const location = new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(pos => {
        const coord = {
          lat: pos.coords.latitude,
          long: pos.coords.longitude
        }
        resolve(coord)
      })
    })
    location
      .then(res => {
        axios
          .get(`http://localhost:8080/discover/${res.lat}/${res.long}/`)
          .then(response => {
            this.setState({
              placeSuggestions: response.data.businesses,
              isLoading: false,
            })
          })
      })
  }

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
    )
  }
}

export default Discover