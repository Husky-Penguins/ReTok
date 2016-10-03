import React from 'react'
import {emojify} from 'react-emojione';

const StoreUserEmoji = (props) => {
  //inline CSS-style. fills the entire AllFriends div with photo
    // const divStyle = {
    //   backgroundImage: 'url(' +props.friend.profilePic+ ')',
    //   backgroundPosition:'center',
    //   backgroundSize: 'cover',
    //   backgroundRepeat: 'no-repeat'
    // }
  return(
    <div>
      {emojify(props.emoji.emoji, {output: 'unicode'})}
    </div>
    )
}

export default StoreUserEmoji