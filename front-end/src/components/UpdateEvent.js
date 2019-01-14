import React, { Component } from "react";
import { Mutation, Query } from "react-apollo";
import moment from "moment";
import MultiSelect from "./MultiSelect";
import "antd/dist/antd.css";
import gql from "graphql-tag";
import DeleteEvent from "./DeleteEvent";
import { ALL_USERS_QUERY } from "./EventDetails";
import ALL_USER_EVENTS_QUERY from "./Profile";
import Event from "../styles/Event";
import MyDatePicker from './MyDatePicker'
import MyTimePicker from './MyTimePicker'

const LOCAL_STATE_QUERY = gql`
  query {
    eventTimes @client
  }
`

const SINGLE_EVENT_QUERY = gql`
  query SINGLE_EVENT_QUERY($id: ID!) {
    event(where: { id: $id }) {
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
`;

const UPDATE_EVENT_MUTATION = gql`
  mutation UPDATE_EVENT_MUTATION(
    $id: ID!
    $title: String
    $location: String
    $description: String
    $start: String
    $end: String
    $user: [ID]
  ) {
    updateEvent(
      id: $id
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
`;

class UpdateEvent extends Component {
  state = {
    newEvent: {
    }
  };

  timeChange = (time, boundary) => {
    let newState = this.state.newEvent;
    newState[boundary] = moment(time).format("YYYY-MM-DDTHH:mm:ss");
    this.setState({
      newEvent: newState
    });
  };

  dateChange = (date, boundary) => {
    let newState = this.state.newEvent;
    newState[boundary] = moment(date).format("YYYY-MM-DDTHH:mm:ss");
    this.setState({
      newEvent: newState
    });
  };

  handleChange = e => {
    const { name, type, value } = e.target;
    let newState = this.state.newEvent;
    newState[name] = value;
    this.setState({
      newEvent: newState
    });
  };

  addUsersToState = (userId, allUsers) => {
    const newState = { ...this.state.newEvent };
    newState.user = allUsers.map(user => user.key);
    this.setState({
      newEvent: newState
    });
  };

  updateEvent = async (e, updateEventMutation) => {
    e.preventDefault();
    await updateEventMutation({
      variables: {
        id: this.props.match.params.eventId,
        ...this.state.newEvent
      }
      // refetchQueries: [
      //   {
      //     query: ALL_USER_EVENTS_QUERY,
      //     variables: {
      //       id: this.props.userURL,
      //       awaitRefetchQueries: true
      //     }
      //   }
      // ]
    }).then(() => this.props.history.push(`/${this.props.userId}`));
  };

  // update = (cache, payload) => {
  //   console.log(payload)
  //   const data = cache.readQuery({ query: ALL_USER_EVENTS_QUERY, variables: { id: this.props.userURL}})
  // }

  render() {
    return (
      <Query
        query={SINGLE_EVENT_QUERY}
        variables={{
          id: this.props.match.params.eventId
        }}
      >
        {({ data, loading }) => {
          const event = data.event;
          if (loading) return <p>Loading...</p>;
          if (!event) return <p>Item not found for ID {this.props.id}</p>;
          return (
            <Mutation mutation={UPDATE_EVENT_MUTATION} update={this.update}>
              {(updateEvent, { loading, error }) => {
                return (
                  <div className="eventDetails">
                    <Event onSubmit={e => this.updateEvent(e, updateEvent)}>
                      <h1>Update Event</h1>
                      <fieldset disabled={loading} aria-busy={loading}>
                        <div className="row">
                          <div className="col">
                            <p>Title:</p>
                            <input
                              name="title"
                              className="form-control placeholder-text"
                              defaultValue={event.title}
                              placeholder="Add title Here"
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="col">
                            <p>Location:</p>
                            <input
                              name="location"
                              className="form-control placeholder-text"
                              defaultValue={event.location}
                              placeholder="Add location Here"
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
                              defaultValue={event.description}
                              placeholder="Add a description Here"
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="col" />
                        </div>
                        <div className="row">
                          <div className="col">
                            <p>From:</p>
                            <MyDatePicker 
                              eventDate={this.state.newEvent.start || event.start}
                              loading={loading}
                              boundary={"start"}
                              updatePageDateChange={this.dateChange}
                            />
                            <MyTimePicker
                              loading={loading}
                              eventTime={this.state.newEvent.start || event.start}
                              boundary={'start'}
                              updatePageTimeChange={this.timeChange}
                            />
                          </div>
                          <div className="col">
                            <p>To:</p>
                            <MyDatePicker
                              loading={loading}
                              eventDate={this.state.newEvent.end || event.end}
                              boundary={'end'}
                              updatePageDateChange={this.dateChange}
                            />
                            <MyTimePicker
                              loading={loading}
                              eventTime={this.state.newEvent.end || event.end}
                              boundary={'end'}
                              updatePageTimeChange={this.timeChange} 
                            />
                          </div>
                        </div>
                        <div className="row user-select">
                          <div className="col">
                            <p>Select Users:</p>
                            <Query query={ALL_USERS_QUERY}>
                              {({ error, loading, data }) => {
                                if (loading) return <p>Loading...</p>;
                                return (
                                  <MultiSelect
                                    allUsers={data.users}
                                    eventUsers={event.user}
                                    addUsersToState={this.addUsersToState}
                                  />
                                );
                              }}
                            </Query>
                          </div>
                          <div className="col" />
                        </div>
                        <div className="row">
                          <div className="col">
                            <DeleteEvent
                              userId={this.props.userId}
                              history={this.props.history}
                              eventId={event.id}
                            >
                              Delet{loading ? "ing" : "e"} Event
                            </DeleteEvent>
                          </div>
                          <div className="col">
                            <button type="submit" className="btn btn-primary">
                              Sav{loading ? "ing" : "e"}
                            </button>
                          </div>
                        </div>
                      </fieldset>
                    </Event>
                  </div>
                );
              }}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default UpdateEvent;
