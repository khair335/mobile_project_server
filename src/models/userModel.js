const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  uid: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true },
  favoriteDevices: [
    {
      _id: { type: Schema.Types.ObjectId, ref: 'DevicesData' },
      brand: String,
      deviceName: String,
      banner_img: String,
    }
  ],
  // comments: [
  //   {
  //     userName: { type: String, required: true },
  //     userImage: { type: String },
  //     comment: { type: String, required: true },
  //     timestamp: { type: Date, default: Date.now },
  //   }
  // ]
});

const UserModel = mongoose.model("siteUserList", userSchema);

module.exports = UserModel;
