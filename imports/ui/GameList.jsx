import React, { Component } from 'react';
import Games from '../api/collections/games.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';

export default class GameList extends Component {
  handleNewGame() {
    var deck = [];
    for (var i = 1; i <= 52; i++) {
      deck.push(i);
    }
    function gri() {
      var ri = Math.floor(Math.random() * deck.length);
      return deck.splice(ri, 1)[0];
    }

    var onehand = [gri(), gri(), gri(), gri(), gri(), gri(), gri(), gri(), gri(), gri()];
    var ontable = [gri(), gri()];
    var twohand = [gri(), gri(), gri(), gri(), gri(), gri(), gri(), gri(), gri(), gri()];

    onehand.sort(function(a,b) {return a-b});
    twohand.sort(function(a,b) {return a-b});

    let gameDoc = {
      onehand: onehand,
      onechose: 0,
      onediscard: 0,
      ontable: ontable,
      twohand: twohand,
      twochose: 0,
      twodiscard: 0,
      wait: true,
      deck: deck
    };

    Games.insert(gameDoc);
  }

handleEnterGame(gameId) {
    this.props.enterGameHandler(gameId);
  }

render() {
    return (
    <div>
      <AccountsUIWrapper />
      <div>
        <button onClick={this.handleNewGame.bind(this)}>New Game</button>
      </div>
      <div>
        <h1>List of games</h1>
        {this.props.games.map((game, index) => {
          return (
            <div key={game._id}>
              <span>Game {index+1}</span>
              <button onClick={this.handleEnterGame.bind(this, game._id)}>Enter</button>
            </div>
          )
        })}
      </div>
    </div>
    )
  }
}
