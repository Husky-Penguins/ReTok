import React, { PropTypes }  from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import OnlineFriends from './OnlineFriends.js'
import * as userActions from '../../Redux/userReducer'


class OnlineFriendsContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    console.log('i hit this component for onlinefriends')
  }

  videoChat(friend) {
    console.log('i hit video chat for this friend', friend);
  }

  render() {
    return (
      <div className="AllFriendsContainer">
        {this.props.onlineFriends.map((item, index) => <OnlineFriends key={index} friend={item} videoChat={this.videoChat.bind(this)}/>)}
      </div>
      )
  }
}


function mapStateToProps(state) {
  return {
    isLoggedIn: state.userReducer.isLoggedIn,
    user: state.userReducer.user,
    onlineFriends: state.userReducer.onlineFriends
  }
}


export default connect(mapStateToProps)(OnlineFriendsContainer)