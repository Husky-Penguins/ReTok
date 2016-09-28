import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute, Link } from 'react-router'

const SignUpForm = (props) => (
  <div>
    <form type='submit' className = "signUpForm" onSubmit={(e) => {e.preventDefault(); props.signUp(document.getElementById('newUser').value, document.getElementById('newPassword').value, document.getElementById('firstName').value, document.getElementById('lastName').value, document.getElementById('email').value);}}>
      <h2 id= "signUpHere">Sign Up Here</h2>
      <input id='newUser' className = "signUpInput" type='type/submit' placeholder='Username'/>
      <input id='newPassword' className = "signUpInput" type='type/submit' placeholder='Password' />
      <input id='firstName' className = "signUpInput" type='type/submit' placeholder='First Names'/>
      <input id='lastName' className = "signUpInput" type='type/submit' placeholder='Last Name'/>
      <input id='email' className = "signUpInput" type='type/submit' placeholder='Email'/>
      <input className="formButton" type='submit' value='Sign Up!'/>
    </form>
  </div>
)

export default SignUpForm;