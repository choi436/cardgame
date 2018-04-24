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

  handleBackToGameList() {
    var cb = document.getElementById("areyousure");
    if (cb.checked) {
      this.props.backToGameListHandler();
    }
  }

  handleClick(arr, col) {
    if (arr == 1) {
      let game = this.props.game;
      if (this.props.game.playerOne.username == this.props.user.username) {
        game.onechose = game.ontable[col];
        game.twochose = game.ontable[(col+1)%2];
      } else {
        game.twochose = game.ontable[col];
        game.onechose = game.ontable[(col+1)%2];
      }
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
        if (this.props.game.playerOne.username == this.props.user.username) {
          outgoes = game.onehand[col];
          game.onehand[col] = game.onechose;
        } else {
          outgoes = game.twohand[col];
          game.twohand[col] = game.twochose;
        }
      } else {
        if (this.props.game.playerOne.username == this.props.user.username) {
          outgoes = game.onechose;
        } else {
          outgoes = game.twochose;
        }
      }
      if (this.props.game.playerOne.username == this.props.user.username) {
        game.onechose = 0;
        game.deck.push(outgoes);
        game.onediscard = outgoes;
        game.onehand.sort(function(a,b) {return a-b});
        Games.update(game._id, {
          $set: {
            onechose: game.onechose,
            deck: game.deck,
            onediscard: game.onediscard,
            onehand: game.onehand,
            oneDeal: 0
          }
        });
      } else {
        game.twochose = 0;
        game.deck.push(outgoes);
        game.twodiscard = outgoes;
        game.twohand.sort(function(a,b) {return a-b});
        Games.update(game._id, {
          $set: {
            twochose: game.twochose,
            deck: game.deck,
            twodiscard: game.twodiscard,
            twohand: game.twohand,
            twoDeal: 0
          }
        });
      }
    }
  }

  handleDeal() {
    let game = this.props.game;
    if (game.playerOne.username == this.props.user.username) {
      Games.update(game._id, {
        $set: {oneDeal: 1}
      });
      if (game.twoDeal == 1 && game.twochose == 0) {
        Meteor.setTimeout(function() {
          let ri = Math.floor(Math.random() * game.deck.length);
          game.ontable[0] = game.deck.splice(ri, 1)[0];
          ri = Math.floor(Math.random() * game.deck.length);
          game.ontable[1] = game.deck.splice(ri, 1)[0];
          Games.update(game._id, {
            $set: {ontable: game.ontable, deck: game.deck}
          });
        }, 1000);
      }
    } else {
      Games.update(game._id, {
        $set: {twoDeal: 1}
      });
      if (game.oneDeal == 1 && game.onechose == 0) {
        Meteor.setTimeout(function() {
          let ri = Math.floor(Math.random() * game.deck.length);
          game.ontable[0] = game.deck.splice(ri, 1)[0];
          ri = Math.floor(Math.random() * game.deck.length);
          game.ontable[1] = game.deck.splice(ri, 1)[0];
          Games.update(game._id, {
            $set: {ontable: game.ontable, deck: game.deck}
          });
        }, 1000);
      }
    }
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

  whochoose() {
    if (this.props.game.playerOne.username == this.props.user.username) {
      return this.props.game.onechose;
    }
    return this.props.game.twochose;
  }

  ropponent() {
    if (this.props.game.playerOne.username == this.props.user.username) {
      if (this.props.game.twochose !== 0) {
        return (<img src="/PNG/card_back.png" width="69" height="105"/>);
      }
      return (<img src="/PNG/0.png" width="69" height="105"/>);
    } else {
      if (this.props.game.onechose !== 0) {
        return (<img src="/PNG/card_back.png" width="69" height="105"/>);
      }
      return (<img src="/PNG/0.png" width="69" height="105"/>);
    }
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
      if (this.props.game.playerTwo.username == this.props.user.username) {
        url = "/PNG/" + this.props.game.onediscard + ".png";
      } else {
        url = "/PNG/" + this.props.game.twodiscard + ".png";
      }
    } else {
      if (this.props.game.playerTwo.username == this.props.user.username) {
        url = "/PNG/" + this.props.game.twodiscard + ".png";
      } else {
        url = "/PNG/" + this.props.game.onediscard + ".png";
      }
    }
    return (<img src={url} width="69" height="105"/>);
  }

  rcard(col) {
    var gotten;
    var url;
    if (this.whochoose(this) === 0) {
      if (col !== 10) {
        if (this.props.game.playerOne.username == this.props.user.username) {
          gotten = this.props.game.onehand[col];
        } else {
          gotten = this.props.game.twohand[col];
        }
      } else {
        gotten = 0;
      }
      url = "/PNG/" + gotten + ".png";
      return (<img src={url} width="69" height="105"/>);
    } else if (col === 10) {
      if (this.props.game.playerOne.username == this.props.user.username) {
        gotten = this.props.game.onechose;
      } else {
        gotten = this.props.game.twochose;
      }
    } else {
      if (this.props.game.playerOne.username == this.props.user.username) {
        gotten = this.props.game.onehand[col];
      } else {
        gotten = this.props.game.twohand[col];
      }
    }
    url = "/PNG/" + gotten + ".png";
    return (<img src={url} width="69" height="105" onClick={this.handleClick.bind(this,2,col)}/>);
  }

  dealbutton() {
    if (this.props.user.username == this.props.game.playerOne.username) {
      return (this.props.game.oneDeal == 1);
    } else {
      return (this.props.game.twoDeal == 1);
    }
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
          <button type="button" onClick={this.handleDeal.bind(this)} disabled={this.dealbutton()}>Deal</button>
          <button onClick={this.handleBackToGameList.bind(this)}>Forfeit</button>
          <input type="checkbox" id="areyousure"/>
          <label htmlFor="areyousure">Confirm</label>
        </div>
      </div>
    )
  }
}
