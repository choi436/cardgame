import React, { Component } from 'react';
import Games from '../api/collections/games.js';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

export default class GameList extends Component {
  handleNewGame() {
    var gameid = Games.newGame();
    Games.joinGame(gameid, Meteor.user());
  }

  handleLeaveGame(gameId) {
    Games.leaveGame(gameId, Meteor.user());
  }

  handleJoinGame(gameId) {
    Games.joinGame(gameId, Meteor.user());
  }

  handleEnterGame(gameId) {
    this.props.enterGameHandler(gameId);
  }

  handlelogout() {
    Meteor.logout();
  }

  myCurrentGameId() {
      // find game where the user is currently in
      if (Meteor.user() == null) return null;
      let game = _.find(this.props.games, (game) => {
        if (game.playerOne != null && game.playerTwo != null) {
          return (game.playerOne.userId === this.props.user._id ||
                  game.playerTwo.userId === this.props.user._id);
        } else if (game.playerOne != null) {
          return (game.playerOne.userId === this.props.user._id);
        } else {return false;}
      });
      if (game === undefined) return null;
      return game._id;
    }

  renderPlayers(game) {
    var player1;
    if (game.playerOne != null) player1 = game.playerOne.username;
    else player1 = '';
    var player2;
    if (game.playerTwo != null) player2 = game.playerTwo.username;
    else player2 = '';
      return (
        <span>[{player1}] vs [{player2}]</span>
      )
    }

    render() {
      return (
      <div>
        <div>
          <p>You are currently logged in as {this.props.user.username}</p>
          <button onClick={this.handlelogout.bind(this)}>Logout</button>
        </div>
        <div>
          <h1>List of games</h1>
          {this.props.games.map((game, index) => {
            return (
              <div key={game._id}>
                <span>Game {index+1}</span>
                {this.renderPlayers(game)}

  {/* can leave only if user is in the game, and the game is not started */}
                {this.myCurrentGameId() === game._id && game.playerTwo == null? (
                  <button onClick={this.handleLeaveGame.bind(this, game._id)}>Leave</button>
                ): null}

  {/* can join only if user is not in any game, and the game is not started */}
                {this.myCurrentGameId() === null && game.playerTwo == null? (
                  <button onClick={this.handleJoinGame.bind(this, game._id)}>Join</button>
                ): null}

  {/* can enter only if the game is started */}
                {game.playerTwo != null? (
                  <button onClick={this.handleEnterGame.bind(this, game._id)}>Enter</button>
                ): null}
              </div>
            )
          })}
        </div>

  {/* Only show new game button if player is not in any room */}
        {this.myCurrentGameId() === null? (
          <div>
            <button onClick={this.handleNewGame.bind(this)}>New Game</button>
          </div>
        ): null}
        <div>
          <h2>Rankings</h2>
          <ol>
          {Meteor.users.find({username: {$regex: /^(?!guest).*/}}, {sort: {wins: -1}}).map((u) => {
            return (<li key={u._id}>{u.username}: {u.wins}W{u.losses}L</li>);
          })}
          </ol>
        </div>
      </div>
      )
    }
}
