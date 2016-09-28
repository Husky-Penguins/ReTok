import React from 'react'
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router'

const LoggedInNav = (props) => {

  return (
    <div className="mainNav">
      <Link to="/" className="logo">ReTok</Link>
      <Link to="/chat">Chat</Link>
      <Link to="/store">Store</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/logout">Logout</Link>
    </div>
  )
}

export default LoggedInNav