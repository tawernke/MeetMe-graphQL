import React, { Component } from 'react';
import { DatePicker } from "antd";
import moment from "moment";

class MyDatePicker extends Component {

  dateChange = newDateMoment => {
    this.props.updatePageDateChange(newDateMoment, this.props.boundary === "start" ? "start" : "end");
  }

  render() {
    return (
      <>
        <DatePicker
          disabled={this.props.loading}
          onChange={this.dateChange}
          value={moment(this.props.eventDate)}
        />
      </>
    );
  }
}

export default MyDatePicker;