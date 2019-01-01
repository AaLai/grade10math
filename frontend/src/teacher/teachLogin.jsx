import React from 'react';
import Cookies from 'universal-cookie';
import { API_ROOT, HEADERS } from '../secrets';
import RealTimeTest from './realTimeTest'
const cookies = new Cookies();

class TeacherLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomID: null,
      name: null,
      teacher_id: null,
      hasName: null,
      isReady: null
    }
  }

  componentDidMount = () => {
    const rand = this.getRandomString();
    console.log('test')
    this.setState({roomID: rand})
  }

  getRandomString = () => {
    var result = '';
    while (!result || result.length > 7 || result.length < 4)
      result = Math.random().toString(36).substring(7);
    return result;
  }

  handleChange = form => {
    this.setState({ name: form.target.value });
  };

  handleSubmitTest = form => {
    form.preventDefault();
    fetch(`${API_ROOT}/tests`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        name: this.state.roomID,
        teacher_id: this.state.teacher_id
      })
    }).then( resp => {
      if (resp.ok) {
        this.setState({isReady: true})
      }
    })

  };

  handleSubmitName = form => {
    form.preventDefault();
    fetch(`${API_ROOT}/teachers`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(this.state)
    })
    .then( resp => {
      if (resp.ok) {
        this.getTeacherId()
      }
    });
  };

  getTeacherId = () => {
    fetch(`${API_ROOT}/teachers/${this.state.name}/`)
      .then(res => res.json())
      .then(teacherInfo => this.setState({teacher_id: teacherInfo.id,
                                             hasName: true }));
  };


  render = () => {
    if (!this.state.hasName) {
      return (
        <div>
          <form onSubmit={this.handleSubmitName}>
            <label>User Name</label>
            <br />
            <input
              type='text'
              placeholder='please enter your name'
              onChange={this.handleChange}
            />
            <input type='submit' />
          </form>
        </div>
      );
    } else if (!this.state.isReady) {
      return (
        <div>
        <h1> If we get to it, use this page to set Parameters </h1>
        {this.state.teacher_id}<br/>
        {this.state.roomID}<br/>
        <button onClick={this.handleSubmitTest}> Create Test </button>
        </div>
      )
    } else if (this.state.isReady) {
      return (
        <RealTimeTest roomID={this.state.roomID} />
      )
    }
  }


}

export default TeacherLogin;