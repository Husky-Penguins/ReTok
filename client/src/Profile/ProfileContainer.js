
import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link } from 'react-router'
import { connect } from 'react-redux'
import Profile from './Profile.js'
import * as userActions from '../Redux/userReducer'
import axios from 'axios';
import updateHelper from '../updateHelper.js'


class ProfileContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    var context = this;
    axios.get('/auth')
      .then(function(res) {
        console.log('checking auth res data',res.data);

        if(!res.data) {
          console.log('no session...redirecting to sign up page');
            var socket = context.props.socket;
    axios.get('/logout');
    this.props.dispatch(userActions.toggleLogIn(false));

    let myHeaders = new Headers({'Content-Type': 'application/graphql; charset=utf-8'});
    let options = {

      method: 'POST',
      headers: myHeaders,
      body: `mutation
        {
          updateUser(username:"${this.props.user.username}" online: false) 
          {
            username
            online
          }
        }`
    };
    fetch('/graphql', options).then((res) =>{
      return res.json().then((data) => {
          socket.emit('updateFriends', context.props.friends);
          socket.disconnect()
          context.props.dispatch(userActions.sendSocket(null))
          context.context.router.push('/')
        })
    })
    .catch((error) => console.log(error)) 
        }
      })

    console.log('checking my props', this.props.user.username);
    var socket = this.props.socket
    socket.emit('login', this.props.user.username)
    socket.emit('updateFriends', this.props.friends);
    var username = this.props.user.username
    //Logic to update users friends as they login/logout and add new friends
    // socket.on('update', () => updateHelper(this))
    // updateHelper(this);

  }

  goToUploadView() {
    console.log('hit goToUploadView');
    this.context.router.push('/upload');
  }

  render() {
    return (
      <div>
        <Profile user = {this.props.user} friendCount={this.props.friendCount} goToUploadView={this.goToUploadView.bind(this)}/>
        {this.props.children}
      </div>
    )
  }
}

//testing1234
function mapStateToProps(state) {
  return {
    isLoggedIn: state.userReducer.isLoggedIn,
    user: state.userReducer.user,
    socket: state.userReducer.socket,
    friendCount: state.userReducer.friendCount,
    friends: state.userReducer.friends,
  }
}

ProfileContainer.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(ProfileContainer)
