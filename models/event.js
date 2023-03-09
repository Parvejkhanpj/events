const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventType: { type: String, required: true },
  eventDateTime: { type: Date, required: true },
  eventLocation: { type: String, required: true },
  eventLimit: { type: Number, required: true },
  eventOrganizer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;