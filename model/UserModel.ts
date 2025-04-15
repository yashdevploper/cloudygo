import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide with a username"],
    unique: false,
  },

  email: {
    type: String,
    required: [true, "Please provide with an email id"],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Please provide with a password"],
    unique: false,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },

  verifyToken: String,
  verifyTokenExpiry: Date,
  forgotToken: String,
  forgotTokenExpiry: Date,

  userHistory: [
    {
      city: {
        type: String,
        required: true,
      },
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number],
          required: true,
        },
      },
      temperature: {
        type: Number,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  favorites: [
    {
      cityName: {
        type: String,
        default: null,
      },
    },
  ],
});

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
export default UserModel;
