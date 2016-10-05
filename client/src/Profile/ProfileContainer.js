import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link } from 'react-router'
import { connect } from 'react-redux'
import Profile from './Profile.js'
import * as userActions from '../Redux/userReducer'
import friendScoreCalculator from '../friendTierCalculator'


class ProfileContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  tierRanking(friends) {
    var rankedFriends = [];
    var num = 0;
    if (friends.length <= 5) {
      num = friends.length;
    } else if (friends.length <= 20 && friends.length > 5) {
      num = Math.min(5, friends.length);
    } else {
      num = Math.min(10, friends.length);
    }
    for (var i = 0; i < num; i++) {
      rankedFriends.push(friends[i]);
    }
    return rankedFriends;
  }

  componentWillMount() {
    console.log('checking my props', this.props.user.username);
    var socket = this.props.socket
    socket.emit('login', this.props.user.username)
    var username = this.props.user.username
    //Logic to update users friends as they login/logout and add new friends
    socket.on('update', function() {
      console.log('updating', username);
      let myHeaders = new Headers({'Content-Type': 'application/graphql; charset=utf-8'});
      let options = {

        method: 'POST',
        headers: myHeaders,
        body: `
          { 
            
            findFriends(username: \"${username}\")
            {
                  username
                  profilePic
                  firstName
                  lastName
                  email
                  online
                  videoChatCount
                  textChatCount
                  lastChatTime
                }
          }`

      };
      fetch('/graphql', options).then((res) =>{
        return res.json().then((data) => {
          console.log('checking my friends data',data.data.findFriends);
          var friends = data.data.findFriends;
          // friendRanking() added score to each friend
          if(friends) {
            friendScoreCalculator(friends);
            var onlineFriends = friends.filter(friend => friend.online === true);
            var suggestedFriends = this.tierRanking(onlineFriends.slice().sort((friend0, friend1) => {return friend1.score - friend0.score}));
            this.props.dispatch(userActions.updateFriends(friends.slice()));
            this.props.dispatch(userActions.updateOnlineFriends(onlineFriends.slice()));
            this.props.dispatch(userActions.updateSuggestedFriends(suggestedFriends.slice()));
            this.props.dispatch(userActions.updateFriendCount(friends.length));
          }
        })
      })
    }.bind(this))
  }

  render() {
    return (
      <div>
        <Profile user = {this.props.user}     friendCount={this.props.friendCount}/>
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
    friendCount: state.userReducer.friendCount
  }
}

ProfileContainer.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(ProfileContainer)
