import React, { PropTypes }  from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router'
import * as userActions from '../Redux/userReducer'
// import {emojify} from 'react-emojione';

class StoreContainer extends React.Component {
	constructor(props) {
		super(props)
	}

	componentWillMount() {

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
		        console.log('i hit StoreEmojisContainer', this.props.storeEmojis);
		  		})
				})
		

	}


	// buyEmoji(emoji) {
	// 	var emojiCost = emoji.cost;
	// 	var userCoinTotal = this.props.user.coin;

	// 	if (emojiCost > userCoinTotal) {
	// 		alert('you dont have enough coins to buy this emoji');
	// 	} else {
	// 		userCoinTotal = userCoinTotal - emojiCost;

	// 		    let options = {

	// 		      method: 'POST',
	// 		      headers: myHeaders,
	// 		      body: `
	// 		          mutation {
	// 		          updateUser(username: \"${this.props.user.username}\" coin:${userCoinTotal} emoji:${emoji})  {
	// 		            username
	// 		          }
	// 		          }
	// 		          `

	// 		    };
	// 		    fetch('/graphql', options).then((res) =>{
	// 		      return res.json().then((data) => {
	// 		        console.log('checking data after fetching', data);
	// 		        var userCopy = Object.assign({}, this.props.user, {coin: updatedCoin, emoji: emoji});
	// 		        this.props.dispatch(userActions.updateUser(userCopy));
			       
	// 		        console.log('checking my user data to see successful dispatch', this.props.user);
	// 		  })
	// 		})

	// 	}
	// }
	//TODO: Finish Store:
	render() {
		return (
			<div>
				<div className= "profileNav">
					<Link to="/store">Buy Emojis</Link>
					<Link to="/userinventory">Emojis I Own</Link>
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


export default connect(mapStateToProps)(StoreContainer)