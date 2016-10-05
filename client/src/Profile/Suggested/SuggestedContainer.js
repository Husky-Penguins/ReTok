import React, { PropTypes }  from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router'
import SuggestedFriends from './SuggestedFriends.js'
import * as userActions from '../../Redux/userReducer'


class SuggestedContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
  }

  componentWillMount() {
    console.log('i hit this component for suggestedFriends')
  }

  videoChat(friend) {
    console.log('i hit video chat for this friend', friend.username);
    var socket = this.props.socket;
    var info = {user: friend.username, caller: this.props.user.username}
    socket.emit('calling', info);
    this.context.router.push('/chat');


  }

  render() {
    console.log('this is suggestedFriends: ', this.props.suggestedFriends);
    return (
      <div className="SuggestedFriendsContainer">
        {this.props.suggestedFriends.map((item, index) => <SuggestedFriends key={index} friend={item} videoChat={this.videoChat.bind(this)}/>)}
      </div>
    )
  }
}

SuggestedContainer.contextTypes = {
  router: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.userReducer.isLoggedIn,
    user: state.userReducer.user,
    suggestedFriends: state.userReducer.suggestedFriends,
    socket: state.userReducer.socket
  }
}


export default connect(mapStateToProps)(SuggestedContainer)