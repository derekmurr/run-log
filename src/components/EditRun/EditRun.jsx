import React, { Component } from 'react';
import axios from 'axios';
import DateTimePicker from 'react-datetime-picker';
import { getToken } from '../../services/tokenService';
import moment from 'moment';

import '../AddNew/AddNew.css';

class EditRun extends Component {
  constructor(props) {
    super(props);
    this.state = {
      runId: this.props.run._id,
      userId: this.props.run.userId,
      title: this.props.run.title,
      distance: this.props.run.distance,
      start: this.props.run.start,
      end: this.props.run.end,
      workoutType: this.props.run.workoutType,
      notes: this.props.run.notes,
      message: ''
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleTimeChange = date => {
    this.setState({ date: date });
  }

  handleSubmit = async e => {
    e.preventDefault();
    const runEnd = moment(this.state.runStart).add(this.state.elapsedHours, 'hours').add(this.state.elapsedMinutes, 'minutes').add(this.state.elapsedSeconds, 'seconds').toDate();

    let assignedTitle = '';
    if (!this.state.title) {
      assignedTitle = `${this.state.distance}K ${this.state.workoutType}`;
    } else {
      assignedTitle = this.state.title;
    }

    try {
      const res = await axios.post(`/api/runs/edit`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'runId': this.state.runId
        },
        data: {
          distance: this.state.distance,
          title: assignedTitle,
          start: this.state.start,
          end: runEnd,
          userId: this.state.userId,
          workoutType: this.state.workoutType,
          notes: this.state.notes
        }
      });

      const newRun = {
        distance: this.state.distance,
        title: assignedTitle,
        start: this.state.start,
        end: runEnd,
        userId: this.state.userId,
        workoutType: this.state.workoutType,
        notes: this.state.notes
      }
      this.props.updateDisplay(newRun);

      console.log(`Edited record: ${res}`);
      this.props.setShowEdit(false);
    } catch (e) {
      this.setState({ message: e });
      console.log(this.state.message);
    }
  }

  render() {
    return (
      <div className='add-new-modal'>
        <div className='add-new-wrapper'>
          <h4>Edit Run</h4>
          <form autoComplete='off' onSubmit={this.handleSubmit}>
            <input name='distance' id='distance' type='number' min='0' step='0.1' onChange={this.handleChange} value={this.state.distance} />
            <label htmlFor='distance'>Distance (km)</label>

            <input name='title' id='title' type='text' value={this.state.title} onChange={this.handleChange} />
            <label htmlFor='title'>Workout name</label>

            <input name='elapsedHours' id='elapsedHours' type='number' min='0' max='12' onChange={this.handleChange} value={this.state.elapsedHours} />
            <label htmlFor='elapsedHours'>Hours</label>
            <input name='elapsedMinutes' id='elapsedMinutes' type='number' min='0' max='59' onChange={this.handleChange} value={this.state.elapsedMinutes} />
            <label htmlFor='elapsedMinutes'>Minutes</label>
            <input name='elapsedSeconds' id='elapsedSeconds' type='number' min='0' max='59' onChange={this.handleChange} value={this.state.elapsedSeconds} />
            <label htmlFor='elapsedSeconds'>Seconds</label>

            <DateTimePicker name='runDate' id='runDate' onChange={this.handleTimeChange} value={this.state.start} />
            <label htmlFor='runDate'>Date &amp; time</label>

            <select name='workoutType' id='workoutType' onChange={this.handleChange} value={this.state.workoutType}>
              <option value='Default'>Default</option>
              <option value='Easy'>Easy</option>
              <option value='Hills'>Hills</option>
              <option value='Tempo'>Tempo</option>
              <option value='Intervals'>Intervals</option>
              <option value='Long'>Long</option>
              <option value='Race'>Race</option>
            </select>
            <label htmlFor='workoutType'>Workout type</label>

            <textarea name='notes' id='notes' onChange={this.handleChange} value={this.state.notes} />
            <label htmlFor='notes'>Notes</label>

            <button className='cancel' onClick={() => this.props.setShowEdit(false)}>Cancel</button>
            <button className='submit' type='submit' onClick={this.handleSubmit}>Save</button>
          </form>
        </div>
      </div>
    );
  }
}

export default EditRun;