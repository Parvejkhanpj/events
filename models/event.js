const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name:{type: String},
  sport:{type: String},
  organizer:{ type: mongoose.Schema.Types.ObjectId, ref: "User"},
 start_Time:{type: Date},
 end_Time:{type: Date},
 max_playeres: {type:Number},
 joined_players:[{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
 is_pending_requests_expired: { type: Boolean, default: false },

});

const Event = mongoose.model('Event', eventSchema);

module.exports = {Event};