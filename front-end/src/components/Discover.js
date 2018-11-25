import React, { Component } from 'react'
import axios from 'axios'
import {Redirect} from 'react-router-dom'
import Place from './Place'
import {Spin} from 'antd'
import {googleMapsApiKey} from '../ApiKey'

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
    if (localStorage.getItem(usernameStorageKey) === null) {
      this.setState({
        redirect: true,
      })
    } else {
      let city = ''
      let street = ''
      let streetNumber = ''
      navigator.geolocation.getCurrentPosition((pos) => {
        let latlng = pos.coords.latitude + "," + pos.coords.longitude
        axios
          .get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${googleMapsApiKey}`)
          .then((res) => {
            city = res.data.results[0].address_components[3].long_name
            street = res.data.results[0].address_components[1].short_name
            streetNumber = res.data.results[0].address_components[0].short_name
            axios
              .get(`http://localhost:8080/discover/${city}/${street}/${streetNumber}`)
              .then(response => {
                this.setState({
                  placeSuggestions: response.data.businesses,
                  streetNumber,
                  street,
                  city,
                  isLoading: false,
                })
              })
          })
      })
    }
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
      return <Place
        name = {placeSuggestion.name}
        address1 = {placeSuggestion.location.address1}
        city = {placeSuggestion.location.city}
        state = {placeSuggestion.location.state}
        zip = {placeSuggestion.location.zip_code}
        country = {placeSuggestion.location.country}
        image = {placeSuggestion.image_url}
        rating = {placeSuggestion.rating}
        phoneNumber = {placeSuggestion.phone}
        key = {i}
        price={placeSuggestion.price}
        addPlace={this.props.addPlace}
        deletePlace={this.props.deletePlace}
        isToDoSaved={isToDoSaved}
        isFavouriteSaved={isFavouriteSaved}
        addPlaceToState={this.addPlaceToState}
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