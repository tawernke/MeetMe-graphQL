import React, { Component } from 'react';
import { TimePicker } from "antd";
import moment from "moment";

class MyTimePicker extends Component {

  timeChange = newTimeMoment => {
    const { updatePageTimeChange, boundary } = this.props;
    updatePageTimeChange(newTimeMoment, boundary);
  }

  render() {
    return (
      <>
        <TimePicker
          use12Hours
          format="h:mm a"
          minuteStep={30}
          disabled={this.props.loading}
          onChange={this.timeChange}
          value={moment(this.props.eventTime)}
        />
      </>
    );
  }
}

export default MyTimePicker;