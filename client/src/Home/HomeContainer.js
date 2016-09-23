import React from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router'
import LoggedInNavContainer from '../Nav/LoggedInNav/LoggedInNavContainer'
import Login from '../Login/LoginContainer'

class HomeContainer extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
			<LoggedInNavContainer/>
			{this.props.children}
			</div>
		)
	}
} 

export default HomeContainer