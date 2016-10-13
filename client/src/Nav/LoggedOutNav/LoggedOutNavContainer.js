import React, { PropTypes } from 'react'
import LoggedOutNav from './LoggedOutNav'
import axios from 'axios'
import { Router, Route, IndexRoute, Link } from 'react-router'
import { connect } from 'react-redux'
import * as userActions from '../../Redux/userReducer'
import friendScoreCalculator from '../../friendTierCalculator'


class LoggedOutNavContainer extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.state = {
        exist: false
      }
    } 

  tierRanking(friends) {
    var rankedFriends = [];
    var num = 0;
    if (friends.length <= 10) {
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

  loggingIn(username, password) {

    console.log('User ',username, ' Password ', password);
    //Create logic for checking user and password
    var userInfo = {username: username, password: password};

    axios.post('/login', userInfo)
    .then((res)=>{
      console.log('what is my res data for loggin in???',res.data);
      console.log('checking router', this.context.router);
      if (res.data[0].username) {
        //TODO: FIgure out what server gives for emojis
        this.props.dispatch(userActions.updateUser(res.data[0]));
        this.props.dispatch(userActions.userAuth());
        let myHeaders = new Headers({'Content-Type': 'application/graphql; charset=utf-8'});
        let options1 = {

          method: 'POST',
          headers: myHeaders,
          body: `
              mutation {
              updateUser(username: \"${username}\" online: true)  {
                username
              }
              }
              `
        };
        fetch('/graphql', options1).then((res) =>{
          let myHeader = new Headers({'Content-Type': 'application/graphql; charset=utf-8'});
          let options = {

            method: 'POST',
            headers: myHeader,
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
              console.log('from loggedout: checking my friends data',data.data.findFriends);
              var friends = data.data.findFriends;
              if(friends) {
                friendScoreCalculator(friends);
                var onlineFriends = friends.filter(friend => friend.online === true);
                var suggestedFriends = this.tierRanking(onlineFriends.slice().sort((friend0, friend1) => {return friend1.score - friend0.score}));
                // console.log('suggested friends: ', suggestedFriends);

                this.props.dispatch(userActions.updateFriends(friends));
                this.props.dispatch(userActions.updateOnlineFriends(onlineFriends));
                this.props.dispatch(userActions.updateSuggestedFriends(suggestedFriends));
                this.props.dispatch(userActions.updateFriendCount(friends.length));
                console.log('user name',username);
                this.context.router.push('/text');
              } else {
                this.props.dispatch(userActions.updateFriends([]));
                this.props.dispatch(userActions.updateOnlineFriends([]));
                this.props.dispatch(userActions.updateFriendCount(0));
                this.context.router.push('/text');
              }
            })
          })
        })
      } else {
        this.setState({
          exist:true
        })
      }
    });
  }
 
  render() {
    return(
      <div>
        <LoggedOutNav loggingIn = {this.loggingIn.bind(this)} exist={this.state.exist}/>
      </div>
      )
  }

}


function mapStateToProps(state) {
  return {
    isLoggedIn: state.userReducer.isLoggedIn,
  }
}

LoggedOutNavContainer.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(LoggedOutNavContainer)