import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router'
import Login from '../Login/LoginContainer'
import { connect } from 'react-redux'
import * as userActions from '../Redux/userReducer'
import * as imageUploadActions from '../Redux/uploadReducer'
import PhotoUpload from './PhotoUpload'
import axios from 'axios'

class PhotoUploadContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    // axios.get('/auth')
    //   .then(function(res) {
    //     console.log('checking auth res data',res.data);

    //     if(!res.data) {
    //       this.context.router.push('/');
    //     }
    //   })
  }

  handleImageChange(e) {
    e.preventDefault();
    console.log('i hit handleImageChange');
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.props.dispatch(imageUploadActions.handleImageChange(file, reader.result));
      
    }

    reader.readAsDataURL(file);
  }

  changeProfilePhoto(event) {
    var formData = new FormData();
    var context = this;
    var userPhoto = new Blob([this.props.file], { type: 'image/png'});
    formData.append('photo', userPhoto);

    console.log('i hit changeProfilePhoto. checking my form data', formData);
    axios.post('/user/upload/profilephoto',
      formData)
      .then((res) => {
        console.log('checking profile photo ---->', res.data);

        context.props.dispatch(userActions.updateUser(res.data[0]));
        console.log('checking my user now', this.props.user);
        this.props.dispatch(userActions.userAuth());

        context.context.router.push('/text'); 

      })
  }



  render() {
    return (
      <div>
      hit the photo upload container
      <PhotoUpload changeProfilePhoto={this.changeProfilePhoto.bind(this)} handleImageChange={this.handleImageChange.bind(this)}/>
      </div>
    )
  }
} 


function mapStateToProps(state){
  console.log(state, 'mapStateToProps state')
  return {
    file: state.uploadReducer.file,
    isLoggedIn: state.userReducer.isLoggedIn,
    user: state.userReducer.user,
    friendCount: state.userReducer.friendCount
  }
}

PhotoUploadContainer.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(PhotoUploadContainer)
