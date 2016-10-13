import React, {PropTypes} from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import { Scrollbars } from 'react-custom-scrollbars';
import TextChat from './TextChat.js'
import FriendsListContainer from './FriendsList/FriendsListContainer.js'
import EmojiChatContainer from './EmojiChatContainer/EmojiChatContainer.js'
import shortToUnicode from '../../shortToUnicode.js'
import unicodeToShort from '../../unicodeToShort.js'
import axios from 'axios'
// import { _.escape, _.unescape, escapeMap ,unescapeMap} from 'underscore'
import * as userActions from '../Redux/userReducer'

class TextChatContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      chatSelected: false,
      currentFriend: null,
      newChatHistoryLog: {} 
    }
  }

  componentWillMount() {



    var context = this;
    axios.get('/auth')
      .then(function(res) {
        console.log('checking auth res data',res.data);

        if(!res.data) {
          console.log('no session...redirecting to sign up page');
          context.context.router.push('/');
        }
      })


    var socket = this.props.socket
    socket.emit('login', this.props.user.username)
    socket.emit('updateFriends', this.props.friends);
    var username = this.props.user.username

    
    console.log('check new Chats Log on mount', this.state.newChatHistoryLog);
    var context = this;

    let myHeaders = new Headers({'Content-Type': 'application/graphql; charset=utf-8'});
    let options = {

      method: 'POST',
      headers: myHeaders,
      body: `
           {
          findChatsRedis(user: \"${this.props.user.username}\")  {
            room
            text
          }
          }
          `

    };
    fetch('/graphql', options).then((res) =>{
      return res.json().then((data) => {
        var findChatsData = data.data.findChatsRedis;
        var newChatLog = {};

        for (var i = 0; i < findChatsData.length; i++) {

          var myChatData = findChatsData[i]['text'].split('#^');

            for (var j = 0; j < myChatData.length; j++) {
              myChatData[j] = decodeURI(myChatData[j]); 
            }


          newChatLog[findChatsData[i]['room']] = myChatData;
        }
        context.props.dispatch(userActions.updateChatLog(newChatLog));
        console.log('checking my chat log on will mount after fetching', context.props.chatLog);

      })
    })


    this.props.dispatch(userActions.createRoom(''));
    console.log('checking current chat --->', this.props.currentChat);
    console.log('checking  chatlog on mount --->', this.props.chatLog);

    var chatLogCopy = Object.assign({}, this.props.chatLog);


    socket.on('textmessagereceived', function(message) {
   
      var chat = context.props.currentChat.slice();
      chat.push(message);

   

      context.props.dispatch(userActions.updateCurrentChat(chat));

      var logCopy = Object.assign({}, context.props.chatLog);

      logCopy[context.props.room] = chat;

      context.props.dispatch(userActions.updateChatLog(logCopy));


      var logComponentCopy = Object.assign({}, context.state.newChatHistoryLog);

      logComponentCopy[context.props.room] = logComponentCopy[context.props.room] || [];

      logComponentCopy[context.props.room].push(message);

      context.setState({
        newChatHistoryLog: logComponentCopy
      })

  
    });

    socket.on('joinRoomSuccess', function(room, friend) {
      context.setState({
        chatSelected: true,
        currentFriend: friend
      })
      console.log('checking joinroom success chatlog', context.props.chatLog);

      var oldRoom = context.props.room;

      var chatLogCopy = Object.assign({}, context.props.chatLog);
      console.log('check chatlog before', chatLogCopy);
      chatLogCopy[oldRoom] = context.props.chatLog[oldRoom] || context.props.currentChat;
      console.log('check chatlog after', chatLogCopy);

      context.props.dispatch(userActions.createRoom(room));

      console.log('checking joinroom success chatlog a bit later', context.props.chatLog);

      if(!chatLogCopy.hasOwnProperty(room)) {
        console.log('i hit the falsy value for hasOwnProperty');
        chatLogCopy[room] = [];
        context.props.dispatch(userActions.updateChatLog(chatLogCopy));
        console.log('checking chatLog --->', context.props.chatLog);
        context.props.dispatch(userActions.updateCurrentChat([]));

      } else {
        console.log('i hit the truthy value for hasOwnProperty');
        context.props.dispatch(userActions.updateChatLog(chatLogCopy));
        context.props.dispatch(userActions.updateCurrentChat(chatLogCopy[room]));
        console.log('checking chatLog --->', context.props.chatLog);
      }


    })
  }

  componentWillUnmount() {
    var socket = this.props.socket;
    var clearChat = [];


    this.props.dispatch(userActions.updateCurrentChat(clearChat));

    socket.removeAllListeners("joinRoomSuccess");
    socket.removeAllListeners("textmessagereceived");

    let myHeaders = new Headers({'Content-Type': 'application/graphql; charset=utf-8'});
    let options = {

      method: 'POST',
      headers: myHeaders,
      body: `
          mutation {
          updateUser(username: \"${this.props.user.username}\" coin:${this.props.user.coin})  {
            username
          }
          }
          `

    };
    fetch('/graphql', options).then((res) =>{
      return res.json().then((data) => {
        console.log('unmounting');
      })
    })

  }

  handleWindowClose(){
      alert("Alerted Browser Close");
  }
  sendChat(message) {






    var updatedCoin = this.props.user.coin + this.state.currentFriend.score;
    var userCopy = Object.assign({},this.props.user, {coin: updatedCoin});
    this.props.dispatch(userActions.updateUser(userCopy));
    console.log('i am receiving a message', message);
    message = this.props.user.username+": "+message;
    this.props.socket.emit('textmessagesent', message, this.props.room);
    const emojiEscapedString = encodeURI(unicodeToShort(message));

    console.log('check encoded URI string', emojiEscapedString);
    let myHeaders = new Headers({'Content-Type': 'application/graphql; charset=utf-8'});
    let chatOptions = {
      method: 'POST',
      headers: myHeaders,
      body: `
          mutation {
          addChatRedis(room: \"${this.props.room}\" text: \"${emojiEscapedString}\")  {
            room
          }
          }
          `
    };
    fetch('/graphql', chatOptions).then((res) =>{
      return res.json().then((data) => {
        console.log('sending chat to Redis');
      })
    })

  }

  goToProfile() {
    this.setState({
      chatSelected: false,
      currentFriend: null
    })

    if(document.getElementsByClassName('chatFriendListSelected')[0]) {
      var oldSelectedEntry = document.getElementsByClassName('chatFriendListSelected')[0];
      oldSelectedEntry.classList.remove('chatFriendListSelected');
    }
    var socket = this.props.socket;

    socket.emit('leavetextchatview', this.props.room, this.props.user.username);
    this.props.dispatch(userActions.createRoom(this.props.user.username));
  }


  goToUploadView() {

    this.context.router.push('/upload');
  }


  render() {

    const divStyle = {
      backgroundImage: 'url(' +this.props.user.profilePic+ ')',
      backgroundPosition:'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    }


    var context = this;
    var chat = context.props.currentChat.map((message) => <div><div className="oneChatMessage">{shortToUnicode(message, context.props.userEmojis, context.props.user.username)}</div></div>);


    var chatInputWindow;
    if(this.state.chatSelected) {
      chatInputWindow = <div className ="chatWrapper">
      <div className= "chatHeader">
      <h4>Chatting With: <b>{this.state.currentFriend.username}</b></h4>
      </div>
      <div className="chatWindow">

            <Scrollbars style={{ height: 700 }}>

              {chat}

            </Scrollbars>
          </div>
          <div className="chatInputWrapper">

          <div className="chatInputWindow">
            <form id="chatInput" onSubmit={(e)=>{e.preventDefault(); this.sendChat(document.getElementById("chatInputField").value); document.getElementById("chatInput").reset();}}>
              <input id="chatInputField"/>
              <button className="textChatButton">
                Send Chat
              </button>
            </form>
          </div>
          </div>
          </div>
    } else {
      chatInputWindow = <div className = "chatProfile">
      <div className ="chatProfileInfo">
        <div className = "oneFriend" style={divStyle} onClick={()=>{this.goToUploadView();}}>
          <div className="oneFriendWrapper">
          </div>
        </div>
      </div>
    </div>
    }

    return (
      <div>


          <div className="chatFriendsList">
            <Scrollbars style={{ height: 700 }}>
              <FriendsListContainer goToProfile={this.goToProfile.bind(this)}/>
            </Scrollbars>
          </div>
          {this.props.children}
        <div>
         {chatInputWindow} 
        </div>
      </div>
      )


  }

};


function mapStateToProps(state) {
  return {
    user: state.userReducer.user,
    room: state.userReducer.room,
    socket: state.userReducer.socket,
    friends: state.userReducer.friends,
    chatLog: state.userReducer.chatLog,
    currentChat: state.userReducer.currentChat,
    userEmojis: state.userReducer.userEmojis
  }
}

TextChatContainer.contextTypes = {
  router: PropTypes.object.isRequired
}



export default connect(mapStateToProps)(TextChatContainer);
