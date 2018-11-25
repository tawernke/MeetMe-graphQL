import React, { Component } from 'react'

class ToDos extends Component {
  render() {
    const toDoJSX = this.props.toDoPlaces.map((todo, i) => {
      return <li key={i} className="your-places-item" onClick={() => this.props.showModal(todo.id)}>{todo.name}</li>
    })
    return(
      <div>
        <ul className="your-places-list">
          {toDoJSX}
        </ul>
      </div>
    )
  }
}

export default ToDos