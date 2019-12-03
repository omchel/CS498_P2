const User = require('../models/User') // Relative path to the User model from user.js

const is_whitelisted = (linkblue_username) => {
  // Attempt to pull the user from the user table using the linkblue username
  const user = User.query().findById(linkblue_username)
  // If a user is returned, return true
  if (user) {
    return true
  // Else, return false
  } else {
    return false
  }
}

module.exports.is_whitelisted = is_whitelisted
