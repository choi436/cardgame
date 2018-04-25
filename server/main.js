import { Meteor } from 'meteor/meteor';
import { Games } from '../imports/api/collections/games.js'; // import Games collection
import { Stats } from '../imports/api/collections/stats.js';

Meteor.startup(() => {
  // code to run on server at startup
});

Accounts.onCreateUser((options, user) => {
  user['wins'] = 0;
  user['losses'] = 0;
  return user;
});

Meteor.publish("allusers", function() {
  return Meteor.users.find({}, {
    fields: {
      wins: 1, losses: 1
    }
  });
});

Meteor.users.allow({
  update: function(userId, user) {
    return true;
  }
});
