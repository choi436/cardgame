import { Mongo } from 'meteor/mongo';

export default Stats = new Mongo.Collection('stats');

_.extend(Stats, {
  newPlayer(user) {
    let playerDoc = {
      userId: user._id,
      username: user.username,
      wins: 0,
      losses: 0
    }
    let statId = Stats.insert(playerDoc);
    return statId;
  }
});
