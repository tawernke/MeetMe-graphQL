import React, {Component} from 'react'
import { Mutation, Query } from 'react-apollo'
import moment from 'moment'
import MultiSelect from './MultiSelect'
import { DatePicker, TimePicker } from 'antd'
import gql from 'graphql-tag'
import Event from '../styles/Event'

const CREATE_EVENT_MUTATION = gql `
  mutation CREATE_EVENT_MUTATION(
    $title: String
    $location: String
    $description: String
    $start: String
    $end: String
    $user: [ID]
  ) {
    createEvent(
      title: $title
      location: $location
      description: $description
      start: $start
      end: $end
      user: $user
    ) {
      id
      title
      location
      description
      start
      end
      user {
        id
        name
      }
    }
  }
`
const ALL_USERS_QUERY = gql`
 query {
   users {
     id
     name
   }
 }
`

class EventDetails extends Component {

  state = {
    eventDetails: {},
    userNames: [],
    newEvent: {}
  }

  componentDidMount() {
    this.setState({
      newEvent: {
        start: moment(this.props.selectedDateStart).set('hour', moment().get('hour')),
        end: moment(this.props.selectedDateEnd).set('hour', moment().get('hour')),
      }
    });
  }

  addUsersToState = userIds => {
    const newState = {...this.state.newEvent}
    newState.user = userIds
    this.setState({
      newEvent: newState
    })
  }

  startDateChange = moment => {
    this.dateChange(moment, 'start')
  }

  endDateChange = moment => {
    this.dateChange(moment, 'end')
  }

  startTimeChange = moment => {
    this.timeChange(moment, 'start')
  }

  endTimeChange = moment => {
    this.timeChange(moment, 'end')
  }

  timeChange = (time, boundary) => {
    let newState = this.state.newEvent
    newState[boundary] = moment(time).format("YYYY-MM-DDTHH:mm:ss");
    this.setState({
      newEvent: newState
    })
  }

  dateChange = (date, boundary) => {
    let newState = this.state.newEvent
    newState[boundary] = moment(date).format("YYYY-MM-DDTHH:mm:ss");
    this.setState({
      newEvent: newState 
    })
  }

  handleChange = e => {
    const { name, value } = e.target
    let newState = this.state.newEvent
    newState[name] = value
    this.setState({
      newEvent: newState
    });
  };
  
  render() {
    const {location, title, description} = this.state.eventDetails
    const { deleteEvent } = this.props
    return (
      <Mutation 
        mutation={CREATE_EVENT_MUTATION} 
        variables={this.state.newEvent}
        >
        {(createEvent, { loading, error}) => {
          return(
          <div className="eventDetails">
            <Event onSubmit={async e => {
              e.preventDefault()
              await createEvent()
              this.props.history.push(`/${this.props.userId}`)
            }}>
              <h2>Create Event</h2>
              <fieldset disabled={loading} aria-busy={loading}>
                <div className="row">
                  <div className="col">
                    <p>Title:</p>
                    <input 
                      name="title" 
                      className="form-control placeholder-text" 
                      value={title} 
                      placeholder ="Add title Here"
                      onChange={this.handleChange}
                      />
                  </div>
                  <div className="col">
                    <p>Location:</p>
                    <input 
                      name="location" 
                      className="form-control placeholder-text" 
                      value={location} 
                      placeholder = "Add location Here"
                      onChange={this.handleChange}
                      />
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                  <p>Description:</p>
                    <input 
                      name="description" 
                      className="form-control placeholder-text" 
                      value={description} 
                      placeholder = "Add a description Here"
                      onChange={this.handleChange}
                      />
                  </div>
                  <div className="col">
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <p>From:</p>
                    <DatePicker 
                      onChange={this.startDateChange}
                      value={moment(this.state.newEvent.start)}
                      />
                    <TimePicker 
                      use12Hours format="h:mm a" 
                      onChange={this.startTimeChange}
                      minuteStep={30}
                      value={moment(this.state.newEvent.start)}
                      />
                  </div>
                  <div className="col">
                    <p>To:</p>
                    <DatePicker 
                      onChange={this.endDateChange}
                      value={moment(this.state.newEvent.end)}
                    />
                    <TimePicker 
                      use12Hours format="h:mm a" 
                      onChange={this.endTimeChange}
                      minuteStep={30}
                      value={moment(this.state.newEvent.end)}
                    />
                  </div>
                </div>
                <div className="row user-select">
                  <div className="col">
                    <p>Select Users:</p>
                    <Query query={ALL_USERS_QUERY}>
                      {({error, loading, data}) => {
                        if(loading) return <p>Loading...</p>
                        return (
                        <MultiSelect 
                          allUsers={data.users}
                          addUsersToState={this.addUsersToState}
                          />
                        )
                        }}
                    </Query>
                  </div>
                  <div className="col">
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <button className="btn btn-danger" onClick={deleteEvent}>Delete</button>
                  </div>
                  <div className="col">
                    <button type="submit" className="btn btn-primary">Sav{loading ? 'ing' : 'e'}</button>
                  </div>
                </div>
              </fieldset>
            </Event>
          </div>
        )}}
      </Mutation>
    )
  }
}

export { ALL_USERS_QUERY }
export default EventDetails

