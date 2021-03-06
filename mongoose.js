const mongoose = require('mongoose');
const enabled = require('debug').enabled;

// Use native promises
mongoose.Promise = global.Promise;

mongoose.connect(process.env.CORAL_AUTH_MONGO_URL);

if (enabled('coral-auth:db')) {
  mongoose.set('debug', true);
}

module.exports = mongoose;
