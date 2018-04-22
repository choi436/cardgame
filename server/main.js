import { Meteor } from 'meteor/meteor';
import Games from '../imports/api/collections/games.js'; // import Games collection

Meteor.startup(() => {
  // code to run on server at startup
  Games.remove({});  // remove all existing game documents

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

  onehand.sort();
  twohand.sort();
  
  let gameDoc = {
    onehand: onehand,
    onechose: 0,
    onediscard: 0,
    ontable: ontable,
    twohand: twohand,
    twochose: 0,
    twodiscard: 0,
    deck: deck
  };

  Games.insert(gameDoc); // insert a new game document into the collection
});
