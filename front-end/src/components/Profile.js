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

const ALL_USER_EVENTS_QUERY = gql`
  query ALL_USER_EVENTS_QUERY($id: ID!) {
    events(userId: $id){
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
    selectedDateStart: {}
  }

  eventClick = (calEvent) => {
    this.props.history.push(`${this.props.match.url}/updateEvent/${calEvent.id}`)
  }

  // timeChange = (time, boundary) => {
  //   this.setState({
  //     [boundary]: moment(this.state[boundary]).set({
  //       'hour': moment(time).format("HH"),
  //       'minute': moment(time).format("mm")
  //     })
  //   })
  // }

  // dateChange = (date, boundary) => {
  //   this.setState({
  //     [boundary]: moment(date).set({
  //       year: moment(date).format("YYYY"),
  //       month: moment(date).format("MM"),
  //       date: moment(date).format("DD")
  //     })
  //   })
  // }

  eventDrop = (event) => {
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
    this.setState({
      selectedDateStart: date
    })
    this.props.history.push(this.props.match.url + '/newEvent')
  }

  select = (start, end) => {
    this.setState ({
      selectedDate: moment(start).set('hour', moment().get('hour')),
      selectedDateEnd: moment(end).subtract(60, 'minute').set('hour', moment().get('hour'))
    }, () => this.props.history.push(this.props.match.url + '/newEvent'))
  }
  
  render() {
    return(
      <div className="entire-profile">
        < div className = "profile-yourPlaces" >
          <YourPlaces match={this.props.match}/>
        </div>
        <div className="profile-main">
          <Switch/>
              <Route
                path={this.props.match.url + "/newEvent"}
                render={(routeProps) => <EventDetails
                  {...routeProps}
                  selectedDateStart={this.state.selectedDateStart}
                  selectedUsers={this.selectedUsers}
                  timeChange={this.timeChange}
                  dateChange={this.dateChange}
                  
                />}
              />
              <Route
                path={this.props.match.url + "/updateEvent/:eventId"}
                render={(routeProps) => <UpdateEvent
                  {...routeProps}
                  userId={this.props.match.params.username}
                />}
              />
              <Route
                exact path={this.props.match.url}
                render={() => <Query fetchPolicy={'network-only'} query={ALL_USER_EVENTS_QUERY} variables={{id: this.props.match.params.username}}>
                  {({ data, error, loading}) => {
                    if(loading) return null
                    if(error) return <p>Error: {error.message}</p>
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
export {ALL_USER_EVENTS_QUERY}
