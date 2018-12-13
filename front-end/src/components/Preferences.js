import React, { Component } from 'react'

class Preferences extends Component {
  
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