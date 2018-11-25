import React, { Component } from 'react'
import { Icon} from 'antd'

class Place extends Component {
  
  addPlaceType = (placeType, id) => {
    const {
      name,
      address1,
      city,
      state,
      country,
      zip,
      image,
      rating,
      phoneNumber,
      addPlace,
    } = this.props
    const newToDo = {
      name: name,
      address_1: address1,
      city: city,
      state: state,
      country: country,
      zip_code: zip,
      image: image,
      rating: rating.toString(),
      phone: phoneNumber,
      type: placeType
    }
    addPlace(newToDo)
  }

  render() {
    const {name, address, image, rating, phoneNumber, price, isToDoSaved, isFavouriteSaved} = this.props
    return(
      <div className="justify-content-center col-xl-3 col-lg-4 col-sm-6 col-xs-12 discover-card">
        <div className="card">
            <img className="card-img-top" src={image} alt=''/>
            <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <p className="card-text">{address} </p>
                <p className="card-text">{phoneNumber} </p>
                <p className="card-text">Rating: {rating} </p>
                <p className="card-text">Price: {price} </p>
                {
                  isToDoSaved.length > 0 ? <Icon className="saveIcon" type="star" theme="filled" style={{ fontSize: 25, color: '#FDBE34' }}onClick={() => this.props.deletePlace(this.props.isToDoSaved[0].id)}/> :
                <Icon className="saveIcon" type="star" theme="outlined" style={{ fontSize: 25, color: '#FDBE34' }}onClick={() => this.addPlaceType('todo')}/>
                }
                {
                  isFavouriteSaved.length > 0 ? <Icon className="saveIcon" type="heart" theme="filled" style={{ fontSize: 25, color: "red" }}onClick={() => this.props.deletePlace(this.props.isFavouriteSaved[0].id)}/> :
                  <Icon className="saveIcon" type="heart" theme="outlined" style={{ fontSize: 25, color: 'red' }}onClick={() => this.addPlaceType('favourite')}/>
                }
            </div>
        </div>
      </div>
    )
  }
}

export default Place

