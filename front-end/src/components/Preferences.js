import React, { Component } from 'react'
import axios from 'axios'

class Preferences extends Component {
  
  addPreference = (e) => {
    e.preventDefault()
    const newPreference = {
      name: e.target.preferenceText.value,
      id: this.props.currentUser[0].id
    }
    if (e.target.preferenceText.value !== '') {
      e.target.preferenceText.value = ''
      axios
        .post('http://localhost:8080/preference', newPreference)
        .then(response => {
          const newPreferences = [...this.state.preferences].concat(response.data)
          this.setState({
            preferences: newPreferences
          })
        })
    }
  }

  deletePreference = (e, id) => {
    e.preventDefault()
    const remainingPreferences = this.state.preferences.filter(preference => {
      return preference.id !== id
    })
    this.setState({
      preferences: remainingPreferences
    })
    axios
      .delete('http://localhost:8080/preference', {data: {preferenceId: id}})
  }
  
  render() {
    return(
      <div className="preferences">
        <h3>Preferences</h3>
        <form onSubmit={this.addPreference}>
          <span>
            <input type="text" name="preferenceText" className="form-control preferences-input" placeholder="Add Preference" />
          </span>
          <button type="submit" className="btn btn-primary add-preference-button">Add Item</button>
        </form>
        <ul className="profile-preferencesList">
        {/* {preferencesJSX} */}
        </ul>
      </div>
    )
  }
}

export default Preferences