import React, { Component } from 'react'


class Favourites extends Component {

  addFavourite = (e) => {
    e.preventDefault()
    const form = e.target
    const {favouriteText} = form
    console.log(favouriteText.value)
    if (favouriteText.value !== '') {
      this.props.addPlace(favouriteText.value, false)
    }
  }

  render() {
    const placeJSX = this.props.favouritePlaces.map(place => {
      return <li className="your-places-item" onClick={() => this.props.showModal(place.id)}>{place.name}</li>
    })
    return(
      <div>
        <ul className = "your-places-list">{placeJSX}</ul>
      </div>
    )
  }
}

export default Favourites