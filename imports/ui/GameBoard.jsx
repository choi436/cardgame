import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

export default class GameBoard extends Component {

  /*handleCellClick(row, col) {
    let currentPlayer = this.currentPlayer();
    let game = this.props.game;
    game.board[row][col] = currentPlayer;
    Games.update(game._id, {
      $set: {board: game.board}
    });
  }*/

  handleClick(arr, col) {
    if (arr == 1) {
      let game = this.props.game;
      game.twochose = game.ontable[col];
      game.onechose = game.ontable[(col+1)%2];
      game.ontable = [0, 0];
      Games.update(game._id, {
        $set: {
          twochose: game.twochose,
          onechose: game.onechose,
          ontable: game.ontable
        }
      });
    } else {
      let game = this.props.game;
      let outgoes;
      if (col != 10) {
        outgoes = game.twohand[col];
        game.twohand[col] = game.twochose;
      } else {
        outgoes = game.twochose;
      }
      game.twochose = 0;
      game.deck.push(outgoes, game.onechose);
      game.onediscard = game.onechose;
      game.onechose = 0;
      game.twodiscard = outgoes;
      game.twohand.sort();
      Games.update(game._id, {
        $set: {
          twochose: game.twochose,
          onechose: game.onechose,
          deck: game.deck,
          onediscard: game.onediscard,
          twodiscard: game.twodiscard,
          twohand: game.twohand,
          wait: false
        }
      });
    }
  }

  handleDeal() {
    let game = this.props.game;
    Games.update(game._id, {
      $set: {wait: true}
    });
    Meteor.setTimeout(function() {
      let ri = Math.floor(Math.random() * game.deck.length);
      game.ontable[0] = game.deck.splice(ri, 1)[0];
      ri = Math.floor(Math.random() * game.deck.length);
      game.ontable[1] = game.deck.splice(ri, 1)[0];
      Games.update(game._id, {
        $set: {ontable: game.ontable}
      });
    }, 1000);
  }

  /*renderCell(row, col) {
    let value = this.props.game.board[row][col];
    if (value === 0) return (<td>O</td>);
    if (value === 1) return (<td>X</td>);
    if (value === null) return (
      <td onClick={this.handleCellClick.bind(this, row, col)}></td>
    );
  }*/

  /*rcard(arr, col) {
    let game = this.props.game;
    var gotten;
    var url;
    if (arr === 0) {
      if (game.twochose !== 0) {
        return (<img src="/PNG/card_back.png" width="69" height="105">);
      }
      return (<img src="/PNG/0.png" width="69" height="105">);
    } else if (arr === 1) {
      if (game.twochose === 0) {
        return (<img src="/PNG/0.png" width="69" height="105">);
      }
      gotten = game.ontable[col];
    } else if (arr === 3) {
      if (col === 0) {
        url = "/PNG/" + game.onediscard + ".png";
      } else {
        url = "/PNG/" + game.twodiscard + ".png";
      }
      return (<img src=url width="69" height="105">);
    } else {
      if (game.twochose === 0) {
        if (col !== 10) {
          gotten = game.twohand[col];
        } else {
          gotten = 0;
        }
        url = "/PNG/" + gotten + ".png";
        return (<img src=url width="69" height="105">);
      } else if (col === 10) {
        gotten = game.twochose;
      } else {
        gotten = game.twohand[col];
      }
    }
    url = "/PNG/" + gotten + ".png";
    return (<img src=url width="69" height="105" onClick={this.handleClick.bind(this,arr,col)}>);
  }*/

  ropponent() {
    if (this.props.game.twochose !== 0) {
      return (<img src="/PNG/card_back.png" width="69" height="105"/>);
    }
    return (<img src="/PNG/0.png" width="69" height="105"/>);
  }

  rtable(col) {
    if (this.props.game.twochose !== 0) {
      return (<img src="/PNG/0.png" width="69" height="105"/>);
    }
    var url = "/PNG/" + this.props.game.ontable[col] + ".png";
    return (<img src={url} width="69" height="105" onClick={this.handleClick.bind(this,1,col)}/>)
  }

  rdiscard(col) {
    var url;
    if (col === 0) {
      url = "/PNG/" + this.props.game.onediscard + ".png";
    } else {
      url = "/PNG/" + this.props.game.twodiscard + ".png";
    }
    return (<img src={url} width="69" height="105"/>);
  }

  rcard(col) {
    var gotten;
    var url;
    if (this.props.game.twochose === 0) {
      if (col !== 10) {
        gotten = this.props.game.twohand[col];
      } else {
        gotten = 0;
      }
      url = "/PNG/" + gotten + ".png";
      return (<img src={url} width="69" height="105"/>);
    } else if (col === 10) {
      gotten = this.props.game.twochose;
    } else {
      gotten = this.props.game.twohand[col];
    }
    url = "/PNG/" + gotten + ".png";
    return (<img src={url} width="69" height="105" onClick={this.handleClick.bind(this,2,col)}/>);
  }

  render() {
    return (
      <div>
        <div className="theircards">
          <img src="/PNG/card_back.png" width="69" height="105"/>
          <img src="/PNG/card_back.png" width="69" height="105"/>
          <img src="/PNG/card_back.png" width="69" height="105"/>
          <img src="/PNG/card_back.png" width="69" height="105"/>
          <img src="/PNG/card_back.png" width="69" height="105"/>
          <img src="/PNG/card_back.png" width="69" height="105"/>
          <img src="/PNG/card_back.png" width="69" height="105"/>
          <img src="/PNG/card_back.png" width="69" height="105"/>
          <img src="/PNG/card_back.png" width="69" height="105"/>
          <img src="/PNG/card_back.png" width="69" height="105"/>
          {this.ropponent()}
        </div>
        <div className="ontable">
          {this.rdiscard(0)}
          {this.rtable(0)}
          {this.rtable(1)}
          {this.rdiscard(1)}
        </div>
        <div className="mycards">
          {this.rcard(0)}
          {this.rcard(1)}
          {this.rcard(2)}
          {this.rcard(3)}
          {this.rcard(4)}
          {this.rcard(5)}
          {this.rcard(6)}
          {this.rcard(7)}
          {this.rcard(8)}
          {this.rcard(9)}
          {this.rcard(10)}
        </div>
        <div>
          <button type="button" onClick={this.handleDeal.bind(this)} disabled={this.props.game.wait}>Deal</button>
        </div>
      </div>
    )
  }
}
