import React, { PropTypes } from 'react'
import LoggedInNav from './LoggedInNav'
import axios from 'axios'
import { connect } from 'react-redux'
import { Router, Route, IndexRoute, Link } from 'react-router'
import * as userActions from '../../Redux/userReducer'
import updateHelper from '../../updateHelper.js'


class LoggedInNavContainer extends React.Component {
  constructor(props, context) {
      super(props, context);
      //states are used to control when to show chat button on client to allow them to enter a chat together
      this.state = {
        toggle: null,
        hide: false
      }
  } 

  componentWillUnmount() {
    var socket = this.props.socket;
    socket.emit('updateFriends', this.props.friends);
  }

  componentWillMount() {
    var socket = io();
    console.log('socket' , socket)
    this.props.dispatch(userActions.sendSocket(socket));
    this.props.dispatch(userActions.createRoom(this.props.user.username))
    var friends = this.props.friends;
    socket.emit('updateFriends', friends);
    socket.on('invite', function(caller) {
      this.invitation();
      this.props.dispatch(userActions.createRoom(caller.caller));
    }.bind(this))
    socket.on('update', () => updateHelper(this))
    updateHelper(this);
  }
    
  
  logout() {
    var socket = this.props.socket;
    axios.get('/logout').then( () => {
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
	  socket.emit('updateFriends', this.props.friends);
          socket.emit('endTextChat', this.props.user.username, this.props.user.coin);
	  socket.disconnect()
          this.props.dispatch(userActions.sendSocket(null))
          this.context.router.push('/')
	           
        })
    })
    .catch((error) => console.log(error))
 })
  .catch( (error) => console.log(error))
  }

  invitation() {
    this.setState({
      hide:true
    })
    var toggling = setInterval(function() {
      var background = document.getElementById('chat').style.backgroundColor;
       if (background == "rgb(255, 145, 0)") {
           document.getElementById('chat').style.background = "rgb(26,255,0)";
       } else {
           document.getElementById('chat').style.background = "rgb(255,145,0)";
       }
    })
    this.setState({
      toggle: toggling
    })
  }

  accept() {
    clearInterval(this.state.toggle);
    document.getElementById('chat').style.background = "#4d4d4d";
    this.setState({
      hide:false
    })
    this.context.router.push('/chat')
  }



  searchReTok(query) {

    if (query.indexOf(' ') !== -1) {
      query = query.split(' ')[0];
    }
    console.log('IAM SEARCHING FOR', query)
    let myHeaders = new Headers({'Content-Type': 'application/graphql; charset=utf-8'});
    let options = {

      method: 'POST',
      headers: myHeaders,
      body: `
        {

          search(name: \"${query}\")
              {
               id
               username
               firstName
               lastName
               email   
               profilePic
              }
        }`
    };
    fetch('/graphql', options).then((res) =>{
      return res.json().then((data) => {
        var searchresult = data.data.search.slice();
        this.props.dispatch(userActions.updateSearch(searchresult));
        this.context.router.push('/search')
        })
    })
  }

 
  render() {
    return(
      <div>
        <LoggedInNav coin={this.props.user.coin}hide={this.state.hide} logout= {this.logout.bind(this)} accept={this.accept.bind(this)} searchReTok={this.searchReTok.bind(this)}/>
      </div>
      )
  }

}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.userReducer.isLoggedIn,
    search: state.userReducer.search,
    user: state.userReducer.user,
    room: state.userReducer.room,
    socket: state.userReducer.socket,
    friends: state.userReducer.friends
  }
}

LoggedInNavContainer.contextTypes = {
  router: PropTypes.object.isRequired
}


export default connect(mapStateToProps)(LoggedInNavContainer)

