import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

export default class GameBoard extends Component {
  checkWin(player) {
    var hand;
    if (player == 1) {
      hand = this.props.game.onehand;
    } else {
      hand = this.props.game.twohand;
    }
    let groups = [];
    //check for sets
    for (var i = 1; i < 53; i++) {
      if (hand.indexOf(i) == -1) continue;
      var set = [i];
      var ulimit = Math.ceil(i/4);
      for (var j = 1; j < 4; j++) {
        if (Math.ceil((i+j)/4) != ulimit) break;
        if (hand.indexOf(i+j) != -1) set.push(i+j);
      }
      if (set.length >= 3) {
        for (var k = 0; k < set.length; k++) {
          hand.splice(hand.indexOf(set[k]), 1);
        }
        groups.push(set);
      }
    }
    //check for runs
    for (var ii = 1; ii < 53; ii++) {
      if (hand.indexOf(ii) == -1) continue;
      var run = [ii];
      var jj = ii + 4;
      var notfound = false;
      while (jj < 57 && !notfound) {
        notfound = false;
        if (hand.indexOf(jj) == -1 && hand.indexOf(jj % 52) == -1) {
          if (groups.length == 0) notfound = true;
          for (var kk = 0; kk < groups.length; kk++) {
            if ((groups[kk].indexOf(jj) != -1 || groups[kk].indexOf(jj % 52) != -1)
                && groups[kk].length >= 3) {
              notfound = false;
              if (jj != 52) {
                groups[kk].splice(groups[kk].indexOf(jj % 52));
                run.push(jj % 52);
              } else {
                groups[kk].splice(groups[kk].indexOf(52));
                run.push(52);
              }
              break;
            } else {notfound = true;}
          }
        } else {
          if (jj != 52) {
            run.push(jj % 52);
          } else {
            run.push(52);
          }
        }
        jj += 4;
      }
      if (run.length < 3) {
        jj = ii - 4;
        notfound = false;
        while (jj > 0 && !notfound) {
          notfound = false;
          if (groups.length == 0) notfound = true;
          for (var kk = 0; kk < groups.length; kk++) {
            if (groups[kk].indexOf(jj) != -1
                && groups[kk].length >= 3) {
              notfound = false;
              groups[kk].splice(groups[kk].indexOf(jj));
              run.push(jj);
              break;
            } else {notfound = true;}
          }
        }
      }
      if (run.length >= 3) {
        for (var k = 0; k < run.length; k++) {
          hand.splice(hand.indexOf(run[k]), 1);
        }
        groups.push(run);
      }
    }
    if (hand.length == 0) {
      var winning = [];
      for (var l = 0; l < groups.length; l++) {
        for (var ll = 0; ll < groups[l].length; ll++) {
          winning.push(groups[l][ll]);
        }
      }
      if (player == 1) {
        Games.update(this.props.game._id, {
          $set: {
            onehand: winning,
            winning: 1
          }
        });
        if (!this.props.game.playerOne.username.startsWith("guest")) {
          var wins = this.props.game.playerOne.wins + 1;
          var losses = this.props.game.playerOne.losses;
          var id = this.props.game.playerOne.userId;
          var name = this.props.game.playerOne.username;
          var newplayer = {
            userId: id,
            username: name,
            wins: wins,
            losses: losses
          }
          Games.update(this.props.game._id, {
            $set: {playerOne: newplayer}
          })
        }
        if (!this.props.game.playerTwo.username.startsWith("guest")) {
          var wins = this.props.game.playerTwo.wins;
          var losses = this.props.game.playerTwo.losses + 1;
          var id = this.props.game.playerTwo.userId;
          var name = this.props.game.playerTwo.username;
          var newplayer = {
            userId: id,
            username: name,
            wins: wins,
            losses: losses
          }
          Games.update(this.props.game._id, {
            $set: {playerTwo: newplayer}
          })
        }
      } else {
        Games.update(this.props.game._id, {
          $set: {
            twohand: winning,
            winning: 2
          }
        });
        if (!this.props.game.playerOne.username.startsWith("guest")) {
          var wins = this.props.game.playerOne.wins;
          var losses = this.props.game.playerOne.losses + 1;
          var id = this.props.game.playerOne.userId;
          var name = this.props.game.playerOne.username;
          var newplayer = {
            userId: id,
            username: name,
            wins: wins,
            losses: losses
          }
          Games.update(this.props.game._id, {
            $set: {playerOne: newplayer}
          })
        }
        if (!this.props.game.playerTwo.username.startsWith("guest")) {
          var wins = this.props.game.playerTwo.wins + 1;
          var losses = this.props.game.playerTwo.losses;
          var id = this.props.game.playerTwo.userId;
          var name = this.props.game.playerTwo.username;
          var newplayer = {
            userId: id,
            username: name,
            wins: wins,
            losses: losses
          }
          Games.update(this.props.game._id, {
            $set: {playerTwo: newplayer}
          })
        }
      }
    }
  }

  handleBackToGameList() {
    var cb = document.getElementById("areyousure");
    if (this.isthisone()) {
      Meteor.users.update({_id: this.props.user._id}, {
        $set: {wins: this.props.game.playerOne.wins, losses: this.props.game.playerOne.losses}
      })
    } else {
      Meteor.users.update({_id: this.props.user._id}, {
        $set: {wins: this.props.game.playerTwo.wins, losses: this.props.game.playerTwo.losses}
      })
    }
    if (cb.checked) {
      this.props.backToGameListHandler(this.props.game._id);
    }
  }

  didheleave() {
    if (this.props.game.playerOne == null || this.props.game.playerTwo == null) {
      return (<p>Your opponent has left the game!</p>);
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
        game.deck.sort(function(a,b) {return a-b});
        Games.update(game._id, {
          $set: {
            onechose: game.onechose,
            deck: game.deck,
            onediscard: game.onediscard,
            onehand: game.onehand,
            oneDeal: 0
          }
        });
        this.checkWin(1);
      } else {
        game.twochose = 0;
        game.deck.push(outgoes);
        game.twodiscard = outgoes;
        game.twohand.sort(function(a,b) {return a-b});
        game.deck.sort(function(a,b) {return a-b});
        Games.update(game._id, {
          $set: {
            twochose: game.twochose,
            deck: game.deck,
            twodiscard: game.twodiscard,
            twohand: game.twohand,
            twoDeal: 0
          }
        });
        this.checkWin(2);
      }
    }
  }

  handleDeal() {
    let game = this.props.game;
    if (this.isthisone()) {
      Games.update(game._id, {
        $set: {oneDeal: 1}
      });
      console.log("Player 1 pressed deal");
      if (game.twoDeal == 1 && game.twochose == 0) {
        console.log("Player 1 deals");
        Games.update(game._id, {
          $set: {inprogress: 1}
        });
        Meteor.setTimeout(function() {
          let ri = Math.floor(Math.random() * game.deck.length);
          game.ontable[0] = game.deck.splice(ri, 1)[0];
          ri = Math.floor(Math.random() * game.deck.length);
          game.ontable[1] = game.deck.splice(ri, 1)[0];
          Games.update(game._id, {
            $set: {ontable: game.ontable, deck: game.deck, inprogress: 0}
          });
        }, Math.floor(Math.random() * 2000) + 1000);
      }
    } else {
      Games.update(game._id, {
        $set: {twoDeal: 1}
      });
      console.log("Player 2 pressed deal");
      if (game.oneDeal == 1 && game.onechose == 0) {
        console.log("Player 2 deals");
        Games.update(game._id, {
          $set: {inprogress: 1}
        });
        Meteor.setTimeout(function() {
          let ri = Math.floor(Math.random() * game.deck.length);
          game.ontable[0] = game.deck.splice(ri, 1)[0];
          ri = Math.floor(Math.random() * game.deck.length);
          game.ontable[1] = game.deck.splice(ri, 1)[0];
          Games.update(game._id, {
            $set: {ontable: game.ontable, deck: game.deck, inprogress: 0}
          });
        }, Math.floor(Math.random() * 3000) + 1000);
      }
    }
  }

  whochoose() {
    if (this.props.game.playerOne == null) return this.props.game.twochose;
    if (this.props.game.playerTwo == null) return this.props.game.onechose;
    if (this.props.game.playerOne.username == this.props.user.username) {
      return this.props.game.onechose;
    }
    return this.props.game.twochose;
  }

  ropponent() {
    if (this.props.game.playerOne == null || this.props.game.playerTwo == null) {
      return(<img src="/PNG/0.png" width="69" height="105"/>);
    }
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
    if (this.props.game.playerOne == null || this.props.game.playerTwo == null) {
      return(<img src="/PNG/0.png" width="69" height="105"/>);
    }
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

  isthisone() {
    if (this.props.game.playerOne == null) return false;
    if (this.props.game.playerTwo == null) return true;
    return (this.props.game.playerOne.username == this.props.user.username);
  }

  rcard(col) {
    var gotten;
    var url;
    if (this.whochoose(this) === 0) {
      if (col !== 10) {
        if (this.isthisone()) {
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
      if (this.isthisone()) {
        gotten = this.props.game.onechose;
      } else {
        gotten = this.props.game.twochose;
      }
    } else {
      if (this.isthisone()) {
        gotten = this.props.game.onehand[col];
      } else {
        gotten = this.props.game.twohand[col];
      }
    }
    url = "/PNG/" + gotten + ".png";
    if (this.props.game.winning != 0) {
      return (<img src={url} width="69" height="105"/>);
    }
    return (<img src={url} width="69" height="105" onClick={this.handleClick.bind(this,2,col)}/>);
  }

  rlose(col) {
    if (this.props.game.playerOne == null || this.props.game.playerTwo == null) {
      return(<img src="/PNG/0.png" width="69" height="105"/>);
    }
    var amione = (this.props.game.playerOne.username == this.props.user.username);
    if (this.props.game.winning == 1 && !amione) {
      var url = "/PNG/" + this.props.game.onehand[col] + ".png";
      return (<img src={url} width="69" height="105"/>);
    } else if (this.props.game.winning == 2 && amione) {
      var url = "/PNG/" + this.props.game.twohand[col] + ".png";
      return (<img src={url} width="69" height="105"/>);
    } else {
      return (<img src="/PNG/card_back.png" width="69" height="105"/>);
    }
  }

  dealbutton() {
    if (this.props.game.winning != 0) return true;
    if (this.isthisone()) {
      return (this.props.game.oneDeal == 1);
    } else {
      return (this.props.game.twoDeal == 1);
    }
  }

  showWinMsg() {
    if (this.props.game.winning == 0) return;
    if ((this.props.game.winning == 1 && this.isthisone()) || (this.props.game.winning == 2 && !this.isthisone())) {
      return (<p>Congratulations, you won!</p>);
    } else {
      return (<p>Sorry, your opponent has gone Gin first!</p>);
    }
  }

  render() {
    return (
      <div>
        <div className="theircards">
          {this.rlose(0)}
          {this.rlose(1)}
          {this.rlose(2)}
          {this.rlose(3)}
          {this.rlose(4)}
          {this.rlose(5)}
          {this.rlose(6)}
          {this.rlose(7)}
          {this.rlose(8)}
          {this.rlose(9)}
          {this.ropponent()}
        </div>
        <div className="ontable">
          <img src="/PNG/0.png" width="69" height="105"/>
          <img src="/PNG/0.png" width="69" height="105"/>
          {this.rdiscard(0)}
          <img src="/PNG/0.png" width="69" height="105"/>
          {this.rtable(0)}
          {this.rtable(1)}
          <img src="/PNG/0.png" width="69" height="105"/>
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
        <div>
          {this.showWinMsg()};
          {this.didheleave()};
        </div>
      </div>
    )
  }
}
