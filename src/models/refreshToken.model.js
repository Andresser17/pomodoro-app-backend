import mongoose from "mongoose";
import authConfig from "../config/auth.config.js";
import { v4 as uuidv4 } from "uuid";

const RefreshTokenSchema = new mongoose.Schema({
  token: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  expiryDate: Date,
});

RefreshTokenSchema.statics.createToken = async function(user) {
  let expiredAt = new Date();

  expiredAt.setSeconds(
    expiredAt.getSeconds() + authConfig.jwtRefreshExpiration
  );

  let _token = uuidv4();

  let _object = new this({
    token: _token,
    user: user._id,
    expiryDate: expiredAt.getTime(),
  });

  console.log(_object);

  let refreshToken = await _object.save();

  return refreshToken.token;
};

RefreshTokenSchema.statics.verifyExpiration = (token) => {
  console.log(token)
  return token.expiryDate.getTime() < new Date().getTime();
};

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

// Methods
export const getRefreshToken = async (requestToken) => {
  const refreshToken = await RefreshToken.findOne({ token: requestToken });

  return refreshToken;
};

export default RefreshToken;
