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
    axios.get('/logout');
    context.props.dispatch(userActions.toggleLogIn(false));

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
          socket.emit('updateFriends', context.props.friends);
          socket.disconnect()
          context.props.dispatch(userActions.sendSocket(null))
          context.context.router.push('/')
        })
    })
    .catch((error) => console.log(error))
		    }
		  })

		// var emojis = this.props.emojis.slice();
		// var userEmojis = this.props.userEmojis.slice();

		// for (var i = 0; i < emojis.length; i++) {
		// 		var storeEmoji = JSON.stringify(emojis[i]);
		// 	for (var j = 0; j < userEmojis.length; j++) {
		// 		var userEmoji = JSON.stringify(userEmojis[j]);
		// 		if (userEmoji === storeEmoji) {
		// 			emojis[i]['purchased'] = true;
		// 		}
		// 	}
		// }
		// this.props.dispatch(userActions.updateEmojis(emojis));
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
