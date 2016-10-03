import React from 'react'
import {emojify} from 'react-emojione'

const StoreEmoji = (props) => {
  //inline CSS-style. fills the entire AllFriends div with photo
    // const divStyle = {
    //   backgroundImage: 'url(' +props.friend.profilePic+ ')',
    //   backgroundPosition:'center',
    //   backgroundSize: 'cover',
    //   backgroundRepeat: 'no-repeat'
    // }
    // const options = {
    //     convertShortnames: true,
    //     convertUnicode: true,
    //     convertAscii: true,
    //     styles: {
    //         backgroundImage: 'url(emojione.sprites.png)',
    //         width: '32px',
    //         height: '32px',
    //         margin: '4px'
    //     }}
  return(
    <div className="oneEmoji">
      <div className="emojiWrapper">
      {emojify(props.emoji.emoji, {output: 'unicode'})}
      </div>
      <div className="storeButtonWrapper">
      <button className="storeButton" onClick={(e)=>{e.preventDefault(); props.buyEmoji(props.emoji, props.index)}}>Buy Emoji</button>
      </div>
    </div>
    )
}

export default StoreEmoji

