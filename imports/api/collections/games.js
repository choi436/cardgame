import { Mongo } from 'meteor/mongo';

export default Games = new Mongo.Collection('games');

_.extend(Games, {
  newGame() {
    var deck = [];
    for (var i = 1; i <= 52; i++) {
      deck.push(i);
    }
    function gri() {
      var ri = Math.floor(Math.random() * deck.length);
      return deck.splice(ri, 1)[0];
    }

    var onehand = [gri(), gri(), gri(), gri(), gri(), gri(), gri(), gri(), gri(), gri()];
    var ontable = [0, 0];
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
      oneDeal: 0,
      twoDeal: 0,
      deck: deck,
      playerOne: null,
      playerTwo: null,
      winning: 0,
      ruined: 0,
      inprogress: 0
    };
    let gameId = Games.insert(gameDoc); // insert a new game document into the collection
    return gameId;
  },

  joinGame(gameId, user) {
    let game = Games.findOne(gameId);
    if (game.playerOne == null) {
      game.playerOne = {
        userId: user._id,
        username: user.username,
        wins: user.wins,
        losses: user.losses
      };
    } else if (game.playerTwo == null) {
      game.playerTwo = {
        userId: user._id,
        username: user.username,
        wins: user.wins,
        losses: user.losses
      };
    } else {
      throw "game is full";
    }
    Games.update(game._id, {
      $set: {playerOne: game.playerOne, playerTwo: game.playerTwo}
    });
  },

  leaveGame(gameId, user) {
    let game = Games.findOne(gameId);
    if (game.playerOne == null) game.playerTwo = null;
    else if (game.playerTwo == null) game.playerOne = null;
    else if (game.playerOne.userId === user._id) {
      game.playerOne = null;
    } else {
      game.playerTwo = null;
    }
    Games.update(game._id, {
      $set: {playerOne: game.playerOne, playerTwo: game.playerTwo, ruined: 1}
    });
    if (game.playerOne == null && game.playerTwo == null) {
      Games.remove(game._id);
    }
  }
});
