import React, { PropTypes }  from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import * as userActions from '../../Redux/userReducer'
import {emojify} from 'react-emojione'
import StoreEmoji from './StoreEmoji.js'

class StoreEmojisContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    console.log('i hit StoreEmojisContainer', this.props.storeEmojis);
  }

  buyEmoji(emoji, key) {
    var emojiCost = emoji.price;
    console.log('check whats is inside of emoji ------>', emoji);
    var userCoinTotal = this.props.user.coin;
    var storeEmojisCopy = this.props.storeEmojis.slice();
    var userEmojis = this.props.userEmojis.slice();

    if (emojiCost > userCoinTotal) {
      alert('you dont have enough coins to buy this emoji');
    } else {
      let myHeaders = new Headers({'Content-Type': 'application/graphql; charset=utf-8'});
      userCoinTotal = userCoinTotal - emojiCost;
      console.log('checking user coin total ---->', userCoinTotal);
          let options = {

            method: 'POST',
            headers: myHeaders,
            body: `mutation 

            {
                updateEmojiUser(username: \"${this.props.user.username}\" emoji: \"${emoji.emoji}\")  {
                  UserId
                  }
                }
                `

          };
          fetch('/graphql', options).then((res) =>{
            return res.json().then((data) => {


              let userOptions = {

                method: 'POST',
                headers: myHeaders,
                body: `
                    mutation {
                    updateUser(username: \"${this.props.user.username}\" coin:${userCoinTotal})  {
                      username
                    }
                    }
                    `

              };

              fetch('/graphql', userOptions).then((res) =>{
                return res.json().then((data) => {




              console.log('checking data after fetching', data);
              var userCopy = Object.assign({}, this.props.user, {coin: userCoinTotal, emoji: emoji});
              this.props.dispatch(userActions.updateUser(userCopy));

              var boughtEmoji = storeEmojisCopy.splice(key, 1);
              console.log('what is bought emoji', boughtEmoji);
              userEmojis.push(boughtEmoji[0]);

              this.props.dispatch(userActions.updateStoreEmojis(storeEmojisCopy));
              this.props.dispatch(userActions.updateUserEmojis(userEmojis));
             
              console.log('checking my user data to see successful dispatch', this.props.user);

            })
              })
        })
      })

    }
  }



  render() {
    return (

      <div className="storeEmojisContainer">
      {this.props.storeEmojis.map((item, index) => <StoreEmoji key={index} index={index} emoji={item} buyEmoji={this.buyEmoji.bind(this)}/>)}

      </div>
      )
  }
}


function mapStateToProps(state) {
  return {
    isLoggedIn: state.userReducer.isLoggedIn,
    storeEmojis: state.userReducer.storeEmojis,
    userEmojis: state.userReducer.userEmojis,
    user: state.userReducer.user,

  }
}



export default connect(mapStateToProps)(StoreEmojisContainer)
