const mongoose = require('mongoose');
const schema = mongoose.Schema;
const {userConnection} = require('../helpers/connections_multi_mongodb');
const bcrypt = require('bcrypt');

const UserSchema = new schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    require: true
  },
  password: {
    type: String,
    require: true,
  }
});

UserSchema.pre('save', async function(next){
  try {
    console.log('before....', this.email, this.password);
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(this.password, salt);
    this.password = hashPassword;
    next();
  } catch (error) {
    console.log('err...', error);
  }
});

UserSchema.methods.isCheckPassword = async function(password){
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.log('err...', error);
  }
}

module.exports = userConnection.model('user', UserSchema);