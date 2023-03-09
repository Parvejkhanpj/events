const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name:{type: String},
  sport:{type: String},
  organizer:{ type: mongoose.Schema.Types.ObjectId, ref: "User"},
 start_time:{type: Date},
 end_Time:{type: Date},
 max_playeres: {type:Number},
 joined_playes:[{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
 is_user_joined:{type: Boolean}

});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;