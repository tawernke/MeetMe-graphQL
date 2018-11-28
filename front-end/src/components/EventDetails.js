import React, {Component} from 'react'
import { Mutation } from 'react-apollo'
import moment from 'moment'
import MultiSelect from './MultiSelect'
import { DatePicker, TimePicker } from 'antd'
import 'antd/dist/antd.css'
import gql from 'graphql-tag'

const CREATE_EVENT_MUTATION = gql `
  mutation CREATE_EVENT_MUTATION(
    $title: String
    $location: String
    $description: String
    $start: String
    $end: String
  ) {
    createEvent(
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

class EventDetails extends Component {

  state = {
    eventDetails: {},
    userNames: [],
    isLoading: true,
    newEvent: {}
  }

  // componentDidMount() {
  //   if (!isNaN(this.props.match.params.eventId)) {
  //   axios
  //     .get(`http://localhost:8080/event/${Number(this.props.match.params.eventId)}`)
  //     .then(results => {
  //       const defaultUserNames = results.data.users.map(user => {
  //         return user.name
  //       })
  //       this.setState({
  //         eventDetails: results.data,
  //         userNames: defaultUserNames,
  //         isLoading: false
  //       })
  //     })
  //   } else {
  //     this.setState({
  //       isLoading: false
  //     })
  //   }
  // }

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
    console.log(this.props.match.url.substring(0, 2))
    const { name, type, value } = e.target
    let newState = this.state.newEvent
    newState[name] = value
    this.setState({
      newEvent: newState
    });
  };
  
  render() {
    const {location, start, end, title, description} = this.state.eventDetails
    const {deleteEvent} = this.props
    return (
      <Mutation mutation={CREATE_EVENT_MUTATION} variables={this.state.newEvent}>
        {(createEvent, { loading, error}) => {
          return(
          <div className="eventDetails">
            <h1>Event Creation</h1>
            <form onSubmit={async e => {
              e.preventDefault()
              const res = await createEvent()
              console.log(res)
              this.props.history.push(this.props.match.url.substring(0, 2))
            }}>
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
                      defaultValue={start ? moment(start) : this.props.state.selectedDate}
                      />
                    <TimePicker 
                      use12Hours format="h:mm a" 
                      onChange={this.startTimeChange}
                      minuteStep={30}
                      defaultValue={start ? moment(start, 'HH:mm Z') : this.props.state.selectedDate}
                      />
                  </div>
                  <div className="col">
                    <p>To:</p>
                    <DatePicker 
                      onChange={this.endDateChange}
                      defaultValue={end ? moment(end) : this.props.state.selectedDateEnd}
                    />
                    <TimePicker 
                      use12Hours format="h:mm a" 
                      onChange={this.endTimeChange}
                      minuteStep={30}
                      defaultValue={end ? moment(end, 'HH:mm Z') : this.props.state.selectedDateEnd}
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
                    <button className="btn btn-danger" onClick={deleteEvent}>Delete</button>
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
  }
}

export default EventDetails

