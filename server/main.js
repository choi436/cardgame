import { Meteor } from 'meteor/meteor';
import { Games } from '../imports/api/collections/games.js'; // import Games collection
import { Stats } from '../imports/api/collections/stats.js';

Meteor.startup(() => {
  // code to run on server at startup
});

Accounts.onCreateUser((options, user) => {
  if (!user.profile) user.profile = {};
  user.profile['wins'] = 0;
  user.profile['losses'] = 0;
  return user;
});
