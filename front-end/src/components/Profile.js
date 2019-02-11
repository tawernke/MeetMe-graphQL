import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import FullCalendar from "fullcalendar-reactwrapper";
import { Route, Switch } from "react-router-dom";
import moment from "moment";
import gql from "graphql-tag";
import { Spin } from "antd";
import { ApolloConsumer } from "react-apollo";
import EventDetails from "./EventDetails";
import UpdateEvent from "./UpdateEvent";
import YourPlaces from "./YourPlaces";
import "../fullcalendar.min.css";
import { UPDATE_EVENT_MUTATION } from "./UpdateEvent";

const ALL_USER_EVENTS_QUERY = gql`
  query ALL_USER_EVENTS_QUERY($id: [ID]!) {
    events(userId: $id) {
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

class Profile extends Component {
  state = {
    selectedDateStart: "",
    selectedDateEnd: "",
    overlayEvents: []
  };

  eventClick = calEvent => {
    this.props.history.push(
      `${this.props.match.url}/updateEvent/${calEvent.id}`
    );
  };

  eventDrop = async (eventDetails, updateEvent) => {
    await updateEvent({
      variables: {
        id: eventDetails.id,
        start: eventDetails.start,
        end: eventDetails.end
      },
      optimisticResponse: {
        __typename: "Mutation",
        updateEvent: {
          __typename: "Event",
          id: eventDetails.id,
          start: eventDetails.start,
          end: eventDetails.end,
          title: eventDetails.title,
          description: eventDetails.description,
          location: eventDetails.location,
          user: eventDetails.user
        }
      }
    });
  };

  dayClick = date => {
    this.setState({
      selectedDateStart: moment(date).set("hour", moment().get("hour"))
    });
    this.props.history.push(this.props.match.url + "/newEvent");
  };

  select = (start, end) => {
    this.setState(
      {
        selectedDateStart: moment(start).set("hour", moment().get("hour")),
        selectedDateEnd: moment(end)
          .subtract(60, "minute")
          .set("hour", moment().get("hour"))
      },
      () => this.props.history.push(this.props.match.url + "/newEvent")
    );
  };

  addOverlayCalendar = async (selectedUsers, client) => {
    if(selectedUsers.length === 0) {
      this.setState({
        overlayEvents:[]
      })
      return
    }
    const { data } = await client.query({
      query: ALL_USER_EVENTS_QUERY,
      variables: { id: selectedUsers }
    });
    const colours = ['red', 'green', 'yellow', 'purple']
    const coloredEvents = data.events.map(event => {
      event.color = 'red'
      return event
    })
    this.setState({
      overlayEvents: coloredEvents
    })
  };

  render() {
    return (
      <div className="entire-profile">
        <div className="profile-yourPlaces">
          <ApolloConsumer>
            {client => {
              return <YourPlaces match={this.props.match} addOverlayCalendar={selectedUsers => this.addOverlayCalendar(selectedUsers, client)} />;
            }}
          </ApolloConsumer>
        </div>
        <div className="profile-main">
          <Switch />
          <Route
            path={this.props.match.url + "/newEvent"}
            render={routeProps => (
              <EventDetails
                {...routeProps}
                userId={this.props.match.params.username}
                selectedDateStart={this.state.selectedDateStart}
                selectedDateEnd={this.state.selectedDateEnd}
                selectedUsers={this.selectedUsers}
                timeChange={this.timeChange}
                dateChange={this.dateChange}
              />
            )}
          />
          <Route
            path={this.props.match.url + "/updateEvent/:eventId"}
            render={routeProps => (
              <UpdateEvent
                {...routeProps}
                userId={this.props.match.params.username}
              />
            )}
          />
          <Route
            exact
            path={this.props.match.url}
            render={() => (
              <Query
                query={ALL_USER_EVENTS_QUERY}
                variables={{ id: [this.props.match.params.username] }}
              >
                {({ data, error, loading }) => {
                  if (loading) return <Spin />;
                  if (error) return <p>Error: {error.message}</p>;
                  return (
                    <Mutation mutation={UPDATE_EVENT_MUTATION}>
                      {(updateEvent, { loading, error }) => {
                        return (
                          <FullCalendar
                            id="your-custom-ID"
                            header={{
                              left: "prev,next today myCustomButton",
                              center: "title",
                              right: "month,basicWeek,basicDay"
                            }}
                            selectable={true}
                            select={this.select}
                            // defaultDate={moment()}
                            navLinks={true}
                            editable={true}
                            eventDrop={e => this.eventDrop(e, updateEvent)}
                            eventLimit={true}
                            events={data.events.concat(this.state.overlayEvents)}
                            eventClick={this.eventClick}
                            dayClick={this.dayClick}
                            se
                          />
                        );
                      }}
                    </Mutation>
                  );
                }}
              </Query>
            )}
          />
          <Switch />
        </div>
      </div>
    );
  }
}

export default Profile;
export { ALL_USER_EVENTS_QUERY };
