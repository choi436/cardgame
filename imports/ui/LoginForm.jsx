import { Random } from 'meteor/random';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Stats from '../api/collections/stats.js';

export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  }

  handleUsernameChange(e) {
    this.setState({username: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    let username = this.state.username.trim();
    if (username === '') return;
    let password = this.state.password.trim();
    if (password === '') return;
    Meteor.loginWithPassword(username, password);
  }

  register(e) {
    e.preventDefault();
    let username = this.state.username.trim();
    if (username === '') return;
    let password = this.state.password.trim();
    if (password === '') return;
    Accounts.createUser({
      username: username,
      password: password
    }, function(err) {
      if (err) console.log(err);
      else {
        Stats.newPlayer(Meteor.user());
      }
    });
  }

  handleGuest(e) {
    e.preventDefault();
    let username = "guest" + Math.floor(Math.random() * 1000000);
    Accounts.createUser({
      username: username,
      password: Random.secret()
    });
  }

  render() {
    return (
      <form name="login-form" onSubmit={this.handleSubmit.bind(this)}>
        <h1>Login</h1>
        <input type="text" onChange={this.handleUsernameChange.bind(this)} placeholder="Enter your name"/>
        <br />
        <input type="text" onChange={this.handlePasswordChange.bind(this)} placeholder="Enter your password"/>
        <br />
        <input type="submit" name="li" value="Login"/>
        <button onClick={this.register.bind(this)}>Register</button>
        <button onClick={this.handleGuest.bind(this)}>Enter as Guest</button>
      </form>
    )
  }
}
