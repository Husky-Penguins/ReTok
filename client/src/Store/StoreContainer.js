import React, { PropTypes }  from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router'
import * as userActions from '../Redux/userReducer'
import axios from 'axios'

class StoreContainer extends React.Component {
	constructor(props,context) {
		super(props,context)
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
		
		let myHeaders = new Headers({'Content-Type': 'application/graphql; charset=utf-8'});
		let options = {

		  method: 'POST',
		  headers: myHeaders,
		  body: `
		    {  
		      getOtherEmoji(username: \"${this.props.user.username}\")
		      {
		      	emoji
		      	price
		          }
		    }`
		};

		    fetch('/graphql', options).then((res) =>{
		      return res.json().then((data) => {
		        console.log('checking Store emoji data after fetching', data.data.getOtherEmoji);
		        this.props.dispatch(userActions.updateStoreEmojis(data.data.getOtherEmoji));



		        let optionsUserEmoji = {

		          method: 'POST',
		          headers: myHeaders,
		          body: `
		            {  
		              getEmoji(username: \"${this.props.user.username}\")
		              {
		              	emoji
		              	price
		                  }
		            }`
		        };


		        fetch('/graphql', optionsUserEmoji).then((res) =>{
		          return res.json().then((data) => {
		          	console.log('checking data for user emoji', data);
		          	this.props.dispatch(userActions.updateUserEmojis(data.data.getEmoji));

		          })
		          })		        




		  		})
				})
		

	}


	//TODO: Finish Store:
	render() {
		return (
			<div>
				<div className= "profileNav">
					<Link to="/store" className="subNavLinks">Buy Emojis</Link>
					<Link to="/userinventory" className="subNavLinks">Emojis I Own</Link>
				</div>
				{this.props.children}
			</div>
			)
	}
}

function mapStateToProps(state) {
  return {
  		//TODO: Configure server and database to know what kind of object I get back for emojis
  	 emojis: state.userReducer.emojis,
  	 user: state.userReducer.user,
  	 userEmojis: state.userReducer.userEmojis,
  	 storeEmojis: state.userReducer.storeEmojis,
  }
}

StoreContainer.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(StoreContainer)
