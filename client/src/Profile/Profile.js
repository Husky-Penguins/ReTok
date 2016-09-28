import React from 'react'
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router'
import {Grid, Row, Col, Nav, NavItem} from 'react-bootstrap'



const Profile = (props) => {

  // const divStyle = {
  //   backgroundImage: 'url(' +props.userFacebook.profilePhotoUrl+ ')',
  //   backgroundPosition:'center',
  //   backgroundSize: 'cover',
  //   backgroundRepeat: 'no-repeat'
  // }


  //hardcoding data for now..
  return (

    <Grid>
      <Row className = "show-grid" id ="userProfileContainer">
        <div>
          <Col sm={4}><img id = "profilePhoto" src={props.user.profilePic}/></Col>
        </div>
        <Col sm={8}>
        <Row className ="show-grid profileRow">
          <span><b>Name: </b>{props.user.firstName}</span>
        </Row>
          <Row className ="show-grid profileRow">
            <span><b>Email: </b>{props.user.email}</span>
          </Row>
          <Row className ="show-grid profileRow">
            <span><b>Birthday:</b>{props.user.dob}</span>
          </Row>
          <Row className ="show-grid profileRow">
            <span><b>Friends Count:</b>1</span>
          </Row>
        </Col>
      </Row>
      <div className= "profileNav">
      <Link to="/">All Friends</Link>
      <Link to="/online">Online</Link>
      <Link to="/suggested">You Should Talk to...</Link>
      </div>


    </Grid>
  )



}



export default Profile