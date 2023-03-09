const mongoose = require("mongoose");


const joinRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  message:{
    type:String
  }
});

const JoinRequest = mongoose.model("JoinRequest", joinRequestSchema);

module.exports = {JoinRequest};