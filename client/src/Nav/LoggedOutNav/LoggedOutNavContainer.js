import React, { PropTypes } from 'react'
import LoggedOutNav from './LoggedOutNav'
import axios from 'axios'
import { Router, Route, IndexRoute, Link } from 'react-router'
import { connect } from 'react-redux'
import * as userActions from '../../Redux/userReducer'


class LoggedOutNavContainer extends React.Component {
    constructor(props, context) {
      super(props);
      this.state = {
        loggedIn: true
      };
    } 

    componentWillMount() {

    }


  loggingIn(username, password) {
    console.log('User ',username, ' Password ', password);
    //Create logic for checking user and password
    var userInfo = {username: username, password: password};




    axios.post("http://127.0.0.1:3000/login?username="+username+"&password="+password)
      .then((res)=>{
        console.log('what is my res data for loggin in???',res.data);
        this.props.dispatch(userActions.userAuth(res.data));
        console.log('checking router', this.context.router);
        this.context.router.push('/profile')
      });
    //when we see confirmation of user, move user to their profile page
    //browserHistory.push('/' + user);
  }
 
  render() {
    return(
      <div>
        <LoggedOutNav loggingIn = {this.loggingIn.bind(this)}/>
      </div>
      )
  }

}


function mapStateToProps(state) {
  return {
    isLoggedIn: state.userReducer.isLoggedIn
  }
}

LoggedOutNavContainer.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(LoggedOutNavContainer)