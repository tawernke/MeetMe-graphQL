import React, {Component} from 'react'
import { Mutation, Query } from 'react-apollo'
import moment from 'moment'
import MultiSelect from './MultiSelect'
import { DatePicker, TimePicker } from 'antd'
import 'antd/dist/antd.css'
import gql from 'graphql-tag'

const SINGLE_EVENT_QUERY = gql`
  query SINGLE_EVENT_QUERY($id: ID!) {
    event(where: {id: $id}) {
      id
      title
      location
      description
      start
      end
    }
  }
`

const UPDATE_EVENT_MUTATION = gql `
  mutation UPDATE_EVENT_MUTATION(
    $id: ID!
    $title: String
    $location: String
    $description: String
    $start: String
    $end: String
  ) {
    updateEvent(
      id: $id
      title: $title
      location: $location
      description: $description
      start: $start
      end: $end
    ) {
      id
      title
      location
      description
      start
      end
    }
  }
`

class UpdateEvent extends Component {

  state = {
    newEvent: {}
  }

  startDateChange = (moment) => {
    this.dateChange(moment, 'start')
  }

  endDateChange = (moment) => {
    this.dateChange(moment, 'end')
  }

  startTimeChange = (moment) => {
    this.timeChange(moment, 'start')
  }

  endTimeChange = (moment) => {
    this.timeChange(moment, 'end')
  }

  timeChange = (time, boundary) => {
    //Time isn't being set correctly here
    let newState = this.state.newEvent
    newState[boundary] = moment(this.state[boundary]).set({
        'hour': moment(time).format("HH"),
        'minute': moment(time).format("mm")
      }).format()
    this.setState({
      newEvent: newState 
    })
  }

  dateChange = (date, boundary) => {
    //Date isn't being set correctly here
    let newState = this.state.newEvent
    newState[boundary] = moment(date).set({
        year: moment(date).format("YYYY"),
        month: moment(date).format("MM"),
        date: moment(date).format("DD")
      }).format()
    this.setState({
      newEvent: newState 
    })
  }

  handleChange = e => {
    const { name, type, value } = e.target
    let newState = this.state.newEvent
    newState[name] = value
    this.setState({
      newEvent: newState
    });
  };

  updateEvent = async (e, updateEventMutation) => {
    e.preventDefault()
    const res = await updateEventMutation({
      variables: {
        id: this.props.match.params.eventId,
        ...this.state.newEvent
      }
    })
  }
  
  render() {
    return (
      <Query 
        query={SINGLE_EVENT_QUERY}
        variables={{
          id: this.props.match.params.eventId
        }}
      >
        {({data, loading}) => {
          if(!data.event) return <p>Item not found for ID {this.props.id}</p>
          return (
            <Mutation mutation={UPDATE_EVENT_MUTATION} variables={this.state.newEvent}>
              {(updateEvent, { loading, error}) => {
                return(
                <div className="eventDetails">
                  <h1>Update Event</h1>
                  <form onSubmit={e => this.updateEvent(e, updateEvent)}>
                    <fieldset disabled={loading} aria-busy={loading}>
                      <div className="row">
                        <div className="col">
                          <p>Title:</p>
                          <input 
                            name="title" 
                            className="form-control placeholder-text" 
                            defaultValue={data.event.title} 
                            placeholder ="Add title Here"
                            onChange={this.handleChange}
                            />
                        </div>
                        <div className="col">
                          <p>Location:</p>
                          <input 
                            name="location" 
                            className="form-control placeholder-text" 
                            defaultValue={data.event.location} 
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
                            defaultValue={data.event.description} 
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
                            defaultValue={moment(data.event.start)}
                            />
                          <TimePicker 
                            use12Hours format="h:mm a" 
                            onChange={this.startTimeChange}
                            minuteStep={30}
                            defaultValue={moment(data.event.start)}
                            />
                        </div>
                        <div className="col">
                          <p>To:</p>
                          <DatePicker 
                            onChange={this.endDateChange}
                            defaultValue={moment(data.event.end)}
                            />
                          <TimePicker 
                            use12Hours format="h:mm a" 
                            onChange={this.endTimeChange}
                            minuteStep={30}
                            defaultValue={moment(data.event.end)}
                            />
                        </div>
                      </div>
                      <div className="row user-select">
                        <div className="col">
                          <p>Select Users:</p>
                          {/* <MultiSelect 
                            users={this.props.users}
                            currentEventUserNames={this.state.userNames}
                            selectedUsers={this.props.selectedUsers}
                            eventUsers={this.state.eventDetails.users}
                            /> */}
                        </div>
                        <div className="col">
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          <button className="btn btn-danger">Delete</button>
                        </div>
                        <div className="col">
                          <button type="submit" className="btn btn-primary">Save</button>
                        </div>
                      </div>
                    </fieldset>
                  </form>
                </div>
              )}}
            </Mutation>
          )
        }}
      </Query>
    )
  }
}

export default UpdateEvent