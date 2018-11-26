import React, { Component } from 'react'
import { Query } from 'react-apollo'
import FullCalendar from 'fullcalendar-reactwrapper'
import {Route, Switch} from 'react-router-dom'
import moment from 'moment'
import axios from 'axios'
import gql from 'graphql-tag'
import { Spin } from 'antd'
import EventDetails from './EventDetails'
import UpdateEvent from './UpdateEvent'
import YourPlaces from './YourPlaces'
import '../fullcalendar.min.css'
import '../App.css'

const usernameStorageKey = 'USERNAME'

const ALL_EVENTS_QUERY = gql `
  query ALL_EVENTS_QUERY {
    events {
      id
      title
      location
      description
      start
      end
    }
    preferences {
      id
      name
    }
  }
`

class Profile extends Component {
  
  state = {
    selectedDate: "",
    currentEvent: {},
    events: [],
    userDetailsAndPlaces: {},
    isLoading: true,
    currentUser: {},
    redirect: false,
    eventUserIds: [],
    currentEventUserIds: [],
    usersCalendarsShown: []
  }

  componentDidMount() {
    if (localStorage.getItem('USERNAME') === null) {
      this.props.history.push('/')
    }
    axios
      .get(`http://localhost:8080/userProfile/${this.props.match.params.username}`)
      .then(response => {
        this.setState({
          userDetailsAndPlaces: response.data,
          isLoading: false
        })
      })
    if (localStorage.getItem('USERNAME') !== null) {
      const loggedInUser = JSON.parse(localStorage.getItem(usernameStorageKey))
      axios.get(`http://localhost:8080/calendar/${this.props.match.params.username}`)
        .then(response => {
          const coloredEvents = response.data.map(event => {
            event.color = '#3A87AD'
            return event
          })
          this.setState({
            events: coloredEvents,
            currentUser: loggedInUser
          })
        })
      }
  }

  checkBoxClick = (value) => {
    if(value.length !== 0) {
      const selectedUserEvents = this.state.events.filter(event => {
        let foundUser = event.users.findIndex(user => {
          return user.id === value[0]
        })
        return foundUser !== -1
      })
      const newSelectedUserEvents = selectedUserEvents.map(event => {
        event = { ...event, color: 'red' }
        return event
      })
      this.setState({
        events: this.state.events.concat(newSelectedUserEvents),
        additionalCallendars: value
      })
    } else {
      const removeUserEvents = this.state.events.filter(event => {
        return event.color === '#3A87AD'
      })
      this.setState({
        events: removeUserEvents
      })
    }
  }

  eventClick = (calEvent) => {
    this.props.history.push(`${this.props.match.url}/updateEvent/${calEvent.id}`)
    // this.state.events.some(event => {
    //   if(event.id === calEvent.id) {
    //     const currentEventUsers = event.users.map(user => {
    //       return user.name
    //     })
    //     const currentEventUserIds = event.users.map(user => {
    //       return user.id
    //     })
    //     this.setState({
    //       currentEvent: event,
    //       currentEventUsers: currentEventUsers,
    //       currentEventUserIds: currentEventUserIds,
    //       selectedDate: calEvent.start,
    //       selectedDateEnd: calEvent.end,
    //     }, () => this.props.history.push(`${this.props.match.url}/event/${calEvent.id}`))
    //   }
    //   return null
    // })
  }

  selectedUsers = (userIds) => {
    this.setState({
      eventUserIds: userIds
    })
  }

  timeChange = (time, boundary) => {
    this.setState({
      [boundary]: moment(this.state[boundary]).set({
        'hour': moment(time).format("HH"),
        'minute': moment(time).format("mm")
      })
    })
  }

  dateChange = (date, boundary) => {
    this.setState({
      [boundary]: moment(date).set({
        year: moment(date).format("YYYY"),
        month: moment(date).format("MM"),
        date: moment(date).format("DD")
      })
    })
  }

  addEvent = (e) => {
    e.preventDefault()
    const form = e.target
    const newEvent = {
      title: form.title.value,
      start: moment(this.state.selectedDate).format(),
      end: moment(this.state.selectedDateEnd).format(),
      location: form.location.value,
      description: form.description.value,
      users: this.state.eventUserIds !== 0 ? this.state.eventUserIds : this.state.currentEventUserIds,
      allDay: false
    }
    if (this.props.location.pathname.includes('newEvent')) {
      axios
        .post('http://localhost:8080/addEvent', newEvent)
        .then(response => {
          this.setState({
            events: this.state.events.concat(response.data),
            isLoading: false
          }, () => this.props.history.push(this.props.match.url))
        })
    } else {
      const newState = [...this.state.events]
      const pos = newState.findIndex((event, i) => {
        return event.id === this.state.currentEvent.id
      })
      newState[pos] = newEvent
      newState[pos].id = this.state.currentEvent.id
      axios
        .post('http://localhost:8080/updateEvent', newState[pos])
        .then(response => {
          this.setState({
            events: newState
          }, () => this.props.history.push(this.props.match.url))
        })
    }
  }

  deleteEvent = () => {
    const deletedEventId = this.state.currentEvent.id
    const remainingEvents = this.state.events.filter(event => event.id !== deletedEventId)
    let userIdsArray = []
    this.state.currentEvent.users.forEach(user => {
      userIdsArray.push(user.id)
    })
    const deleteObj = {}
    deleteObj.eventId = deletedEventId
    deleteObj.userIds = userIdsArray
    this.setState({
      events: remainingEvents,
      currentEvent: {}
    }, () => this.props.history.push(this.props.match.url))
    axios.delete('http://localhost:8080/deleteEvent', {data: deleteObj})
      .then(response => {
        console.log(response)
      })
  }

  eventDrop = (event) => {
    console.log(event)
    event.start = event.start
    const shiftedEvent = {
      id: event.id,
      start: event.start.format(),
      end: event.end.format(),
      users: event.users.map(user => user.id)
    }
    axios
      .post('http://localhost:8080/updateEvent', shiftedEvent)
  }

  dayClick = (date) => {
    this.setState ({
      selectedDate: date
    }, () => this.props.history.push(this.props.match.url + '/event/newEvent'))
  }

  select = (start, end) => {
    this.setState ({
      selectedDate: moment(start).set('hour', moment().get('hour')),
      selectedDateEnd: moment(end).subtract(60, 'minute').set('hour', moment().get('hour'))
    }, () => this.props.history.push(this.props.match.url + '/event/newEvent'))
  }
  
  render() {
    return(
      <div className="entire-profile">
        {this.state.isLoading ? <div className="profile-spin">{<Spin size="large" />}</div> :
        < div className = "profile-yourPlaces" >
        <h1>Meet {this.state.userDetailsAndPlaces[0].name}</h1>
          <YourPlaces
            currentUser={this.state.userDetailsAndPlaces}
            addPlace={this.addPlace}
            showModal={this.props.showModal}
            users={this.props.users}
            addUsersCallendar={this.addUsersCallendar}
            checkBoxClick={this.checkBoxClick}
            />
        </div>
        }
        <div className="profile-main">
          <Switch/>
              <Route
                path={this.props.match.url + "/event/:eventId"}
                render={(routeProps) => <EventDetails
                  addEvent={this.addEvent}
                  state={this.state}
                  deleteEvent={this.deleteEvent}
                  users={this.props.users}
                  currentUser={this.props.currentUser}
                  {...routeProps}
                  selectedDate={this.selectedDate}
                  selectedUsers={this.selectedUsers}
                  timeChange={this.timeChange}
                  dateChange={this.dateChange}
                  
                />}
              />
              <Route
                path={this.props.match.url + "/updateEvent/:eventId"}
                render={(routeProps) => <UpdateEvent
                  {...routeProps}
                />}
              />
              <Route
                exact path={this.props.match.url}
                render={() => <Query query={ALL_EVENTS_QUERY}>
                  {({ data, error, loading}) => {
                    if(loading) return <Spin size="large"/>
                    if(error) return <p>Error: {error.message}</p>
                    console.log(data.events)
                    return <FullCalendar
                        id = "your-custom-ID"
                        header = {{
                          left: 'prev,next today myCustomButton',
                          center: 'title',
                          right: 'month,basicWeek,basicDay'
                        }}
                        selectable= {true}
                        select={this.select}
                        defaultDate={moment()}
                        navLinks= {true}
                        editable= {true}
                        eventDrop={this.eventDrop}
                        eventLimit= {true}
                        events = {data.events}
                        eventClick = {this.eventClick}
                        dayClick={this.dayClick}
                        se
                      />
                  }}
                </Query>
                }
              />
          <Switch/>
        </div>
    </div>
    )
  }
}


export default Profile
