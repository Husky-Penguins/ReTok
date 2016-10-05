import React from 'react'
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router'

const SuggestedFriends = (props) => {
  //inline CSS-style. fills the entire SuggestedFriends div with photo
    const divStyle = {
      backgroundImage: 'url(' +props.friend.profilePic+ ')',
      backgroundPosition:'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }
  return (
    <div className = "oneFriend" style={divStyle}>
        <button className="videoButton" onClick={(e)=>{e.preventDefault;props.videoChat(props.friend);}}>Video Chat</button>
        <button className="chatButton">Chat</button>
          <div className="oneFriendWrapper">
          </div>
      </div>
  )
}

export default SuggestedFriends