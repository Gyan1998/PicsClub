const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
    default:
      'https://res.cloudinary.com/drvcwh5hs/image/upload/v1592477123/aa_tbsabb.jpg',
  },
  followers: [
    {
      type: ObjectId,
      ref: 'User',
    },
  ],
  following: [
    {
      type: ObjectId,
      ref: 'User',
    },
  ],
});

mongoose.model('User', userSchema);
