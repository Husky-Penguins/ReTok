import React, {PropTypes} from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import Search from './Search.js'
import * as userActions from '../Redux/userReducer'
import axios from 'axios'
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router'

class SearchContainer extends React.Component {
	constructor(props,context) {
		super(props, context)
	}

  componentWillMount() {

    var context = this;
    axios.get('/auth')
      .then(function(res) {
        console.log('checking auth res data',res.data);

        if(!res.data) {
          console.log('no session...redirecting to sign up page');
              var socket = context.props.socket;
              axios.get('/logout').then( () => {
              context.props.dispatch(userActions.toggleLogIn(false));

              let myHeaders = new Headers({'Content-Type': 'application/graphql; charset=utf-8'});
              let options = {

                method: 'POST',
                headers: myHeaders,
                body: `mutation
                  {
                    updateUser(username:"${context.props.user.username}" online: false) 
                    {
                      username
                      online
                    }
                  }`
              };
              fetch('/graphql', options).then((res) =>{
                return res.json().then((data) => {
              socket.emit('updateFriends', context.props.friends);
                    socket.emit('endTextChat', context.props.user.username, context.props.user.coin);
                    socket.disconnect()
                    context.props.dispatch(userActions.sendSocket(null))
                    context.context.router.push('/')
                  })
              })
              .catch((error) => console.log(error))
           })
            .catch( (error) => console.log(error))
          } else {
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
        fetch('/graphql', options1)
          }

     })     
    .catch((error) => console.log(error))

  }

  addFriend(friend) {
    var socket = this.props.socket;
    console.log('i tried to add this friend', friend);
    console.log('im checking my own user info', this.props.user);

    let myHeaders = new Headers({'Content-Type': 'application/graphql; charset=utf-8'});
    let options = {

      method: 'POST',
      headers: myHeaders,
      body: `mutation
        {
          addFriendship(userOne: \"${this.props.user.username}\" userTwo: \"${friend.username}\")
          {
                userOne
                userTwo
                relationship
                videoChatCount
                textChatCount
                lastChatTime
              }
        }`

    };
    fetch('/graphql', options).then((res) =>{
      return res.json().then((data) => {
        console.log('what is my data',data);
        // this.props.dispatch(userActions.userAuth(data));
        // console.log('checking router', this.context.router);
        // this.context.router.push('/profile')
        var updatedCoin = this.props.user.coin + 50;

            let options = {

              method: 'POST',
              headers: myHeaders,
              body: `
                  mutation {
                  updateUser(username: \"${this.props.user.username}\" coin:${updatedCoin})  {
                    username
                  }
                  }
                  `

            };
            fetch('/graphql', options).then((res) =>{
              return res.json().then((data) => {
                console.log('checking data after fetching', data);
                var userCopy = Object.assign({}, this.props.user, {coin: updatedCoin});
                this.props.dispatch(userActions.updateUser(userCopy));
                var friendsCopy = this.props.friends.slice();
                friendsCopy.push(friend);
                this.props.dispatch(userActions.updateFriends(friendsCopy));
                var friendCountPlusOne = this.props.friendCount + 1;
                this.props.dispatch(userActions.updateFriendCount(friendCountPlusOne));
                console.log('checking my user data to see successful dispatch', this.props.user, this.props.friends);
                socket.emit('updateFriends',this.props.friends);
                socket.emit('updateFriends', [this.props.user]);
          })
        })


        })
    })
    

  }

	render() {
		return (
			<div>
      {this.props.search.map((item, index) => <Search key={index} friend={item} addFriend={this.addFriend.bind(this)}/>)}
			</div>
			)
	}
}


function mapStateToProps(state) {
  return {
    user: state.userReducer.user,
    search: state.userReducer.search,
    friends: state.userReducer.friends,
    friendCount: state.userReducer.friendCount,
    socket: state.userReducer.socket
  }
}

SearchContainer.contextTypes = {
  router: PropTypes.object.isRequired
}


export default connect(mapStateToProps)(SearchContainer)
