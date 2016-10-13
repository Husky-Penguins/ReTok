import React, { PropTypes } from 'react'
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router'
import SignUpForm from './SignUpForm.js'
import axios from 'axios'
import { connect } from 'react-redux'
import * as userActions from '../Redux/userReducer'


class LoginContainer extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			exist: false,
			comma: false
		}
	}

	componentWillMount() {
		var context = this;
		axios.get('/auth')
		  .then(function(res) {
		    console.log('checking auth res data',res.data);

		    if(res.data) {
		    	console.log('go through to auth')
		      context.context.router.push('/text');
		    } else {
		    	context.props.dispatch(userActions.userUnauth());
		    }
		  })

	}

	signUp(user, password, firstName, lastName, email) {
		this.setState({
			exist: false,
			comma: false
		})
		if(!user.includes(',') && !user.includes(':') && !user.includes('^') && !user.includes('#')) {

			console.log('User ',user, ' Password ', password, 'firstName', firstName, 'lastName', lastName, 'email', email);
			var userInfo = {username: user, password: password};


			let myHeaders = new Headers({'Content-Type': 'application/graphql; charset=utf-8'});
			let options = {

				method: 'POST',
				headers: myHeaders,
				body: `mutation
					{
						addUser(username: \"${user}\" password: \"${password}\" firstName: \"${firstName}\" lastName: \"${lastName}\" email: \"${email}\")
						{
									username
									password
									firstName
									lastName
									email
								}
					}`



			};
			fetch('/graphql', options).then((res) =>{
				return res.json().then((data) => {
					console.log(data);
					if(data.data.addUser === null) {
						this.setState({
							exist: true
						})
					} else {
						// this.props.dispatch(userActions.userAuth(data));

						console.log('checking my data ------>', data);
						// console.log('checking router', this.context.router);
						// this.context.router.push('/profile');
						axios.post('/login', userInfo)
							.then((res) => {
								console.log('checking my data', res.data);
								this.props.dispatch(userActions.updateUser(res.data[0]));
								this.context.router.push('/upload');
							});
					}
				})
			})
		} else {
			this.setState({
				comma: true
			})
		}



	}

	render() {

		return(
			<div>
				<SignUpForm comma={this.state.comma} exist={this.state.exist} signUp={this.signUp.bind(this)}/>
			</div>
			)
	}
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.userReducer.isLoggedIn
  }
}

LoginContainer.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(LoginContainer)
