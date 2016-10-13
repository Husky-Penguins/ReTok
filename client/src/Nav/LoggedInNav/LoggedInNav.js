import React from 'react'
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router'

const LoggedInNav = (props) => {

  return (
    <div className="mainNav">
      <Link to="/text" className="logo">ReTok</Link>
      <form id= "searchForm" onSubmit={(event)=>{event.preventDefault(); props.searchReTok(document.getElementById('usernameSearch').value);}}>
        <input id ="usernameSearch" className="NavInputForm" placeholder="search users"/>
        <button className = "searchButton">
          search ReTok!
        </button>
      </form>
      {props.hide ? <Link id="chat" onClick={props.accept} to="/chat">Chat</Link> : null}
      <Link to="/store">Store</Link>
      <Link onClick={props.logout}>Logout</Link>
      <span><b>Coins:</b> {props.coin}</span>
    </div>
  )
}


export default LoggedInNav