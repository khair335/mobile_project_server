const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Add this line to import Schema

const userSchema = new Schema({ // Use Schema directly here
  uid: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true },
  favoriteDevice: {
    type: Schema.Types.ObjectId,
    ref: 'DevicesData',
  },
});

const UserModel = mongoose.model("siteUserList", userSchema);

module.exports = UserModel;
