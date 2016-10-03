import React from 'react'
import {emojify} from 'react-emojione';

const StoreUserEmoji = (props) => {

  return(
    <div className="oneEmoji">
      <div className="emojiWrapper">
        {emojify(props.emoji.emoji, {output: 'unicode'})}
      </div>
    </div>
    )
}

export default StoreUserEmoji