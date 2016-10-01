import React, { PropTypes }  from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import * as userActions from '../../Redux/userReducer'
import {emojify} from 'react-emojione';
import StoreUserEmoji from './StoreUserEmoji.js'

class StoreUserEmojisContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {

  }


  render() {
    return (
      <div>
      {this.props.userEmojis.map((item, index) => <StoreUserEmoji key={index} emoji={item}/>)}
      </div>
      )
  }
}


function mapStateToProps(state) {
  return {
    userEmojis: state.userReducer.userEmojis,
    user: state.userReducer.user,

  }
}



export default connect(mapStateToProps)(StoreUserEmojisContainer)
