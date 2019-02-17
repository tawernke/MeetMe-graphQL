import React, { Component } from 'react'
import { Modal } from 'antd'

class PlacesModal extends Component {

  state = {
    isLoading: true
  }

  render() {
    const {name, address1, rating, phone, city, state, country} = this.props.place
    return(

        <Modal
          title={name}
          visible={this.props.visible}
          onOk={this.props.onOk}
          onCancel={this.props.onCancel}
          height={500}
        >
          <div>
            <iframe className= 'map-iframe' src={`https://www.google.com/maps/embed/v1/search?q=${address1}&key=AIzaSyAW_Dcil3II5E7B5xjyY2W3S4Tmq7oPNis`} allowFullScreen title="Google Map"></iframe> 
          </div>
          <p>Phone: {phone}</p>
          <p>Address: {address1}, {city}, {state}, {country}</p>
          <p>Rating: {rating}</p>
        </Modal>

    )
  }
}

export default PlacesModal