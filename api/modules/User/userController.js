const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const User = require("./userModel");
const Room = require("../Room/roomModel");

exports.auth = async (req, res, next) => {
  const { provider, accessToken } = req.body;

  try {
    let userInfo = await getUserDetailsFromOAuth(provider, accessToken);
    const userWithEmail = await User.findOne({ email: userInfo.email });

    if (userWithEmail) {
      const token = await signJwt(userWithEmail);
      return res.status(200).json({
        success: true,
        message: "Logged in successfully",
        token,
        user: userWithEmail,
      });
    }

    //SingUp
    const userName = `${userInfo.firstName}${userInfo.lastName}`;
    const oauthAvatarLink = userInfo.avatar;
    // const avatar = await getUserAvatarFromOAuth(
    //   provider,
    //   userName,
    //   oauthAvatarLink
    // );

    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      avatar: oauthAvatarLink,
      providers: [{ name: provider, id: userInfo.id }],
    });

    await newUser.save();

    const token = await signJwt(newUser);

    return res.status(200).json({
      success: true,
      message: "Signed Up successfully",
      token,
      user: newUser,
    });
  } catch (error) {
    console.log(error.toString());
    next(error);
  }
};

exports.getUserRooms = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const rooms = await Room.find({ owner: userId });
    return res.status(200).json(rooms);
  } catch (error) {
    next(error);
  }
};

const getUserDetailsFromOAuth = async (provider, accessToken) => {
  let userInfo = {};

  if (provider === "Google") {
    // Get user data from Google API
    const { data } = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    // Create userInfo object and return it
    userInfo.provider = "Google";
    userInfo.id = data.sub;
    userInfo.firstName = data.given_name;
    userInfo.lastName = data.family_name;
    userInfo.email = data.email;
    userInfo.avatar = data.picture;

    return userInfo;
  }
};

const signJwt = async (user) => {
  // console.log(user);
  const token = jwt.sign(
    {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    "confrenz-secret-this-is",
    { expiresIn: "35d" }
  );

  return token;
};

const getUserAvatarFromOAuth = async (provider, userName, oauthAvatarLink) => {
  // Set default avatar link
  let avatarLink = `${S3_BASE_URL}${S3_DEFAULT_AVATAR_KEY}`;

  if (provider === "Google") {
    // Increase size of profile picture obtained
    const googleAvatarLink = oauthAvatarLink.replace("s96", "s500");

    // Store profile picture temporarily
    const response = await axios.get(encodeURI(googleAvatarLink), {
      responseType: "arraybuffer",
    });

    // Upload profile picture to S3
    let s3BaseUrl = S3_BASE_URL;
    let avatarKey = uploadUserAvatar(userName, response.data);

    // Create avatarLink and return it
    avatarLink = `${s3BaseUrl}${avatarKey}`;
  } else if (provider === "Facebook") {
    // Define s3 base url and default avatar key
    let s3BaseUrl = S3_BASE_URL;
    let avatarKey = S3_DEFAULT_AVATAR_KEY;

    // If the user has uploaded profile picture on facebook, upload that to s3 and use that link
    if (await profilePicUploadedOnFacebook(oauthAvatarLink)) {
      const response = await axios.get(encodeURI(oauthAvatarLink), {
        responseType: "arraybuffer",
      });

      avatarKey = uploadUserAvatar(userName, response.data);
    }

    // Create userInfo object and return it
    avatarLink = `${s3BaseUrl}${avatarKey}`;
  }
  return avatarLink;
};

//Client Id
//785480849408-946edqftlrnrjffja0lsdha60vbqkbs9.apps.googleusercontent.com
//Client Secret
// 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
