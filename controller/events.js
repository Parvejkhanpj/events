const { Event } = require("../models/event");
const cron = require("node-cron");
const { JoinRequest } = require("../models/joinRequest");

exports.createEvents = async (req, res) => {
  const { name, sport, start_Time, end_Time, max_playeres } = req.body;

  try {
    if (!name || !sport || !start_Time || !end_Time || !max_playeres) {
      return res.status(400).json({ error: "Please Provide Required Field" });
    }
    let event = new Event(req.body);
    event.organizer = req.user._id;
    event = await event.save();
    res.send(event);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.joinRequestByUsers = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    const event = await Event.findOne({ _id: eventId });

    const requests = await JoinRequest.find({
      event: eventId,
      user: req.user._id,
    });
    // console.log(requests, "requests")
    if (requests.length > 0) {
      return res.status(400).json({ error: "Your query is already submmited" });
    }

    if (Number(event.max_playeres) === Number(event.joined_players.length)) {
      return res.status(400).json({
        error: "Sorry You can't Join Game Limit is Fulll, Try next Time",
      });
    } else {
      let joiningRequest = new JoinRequest({
        user: req.user._id,
        event: eventId,
        message: req.body.message,
      });

      joiningRequest = await joiningRequest.save();
      console.log(joiningRequest, "joining requst");
      res.status(200).json(joiningRequest);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.verifedByOrganizer = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    let request = await JoinRequest.findOne({ _id: requestId });
    let event = await Event.findOne({ _id: request.event });
    let currntDate = new Date();
    //* if orgnizer want to accppect request
    console.log(req.user._id, "1");
    console.log(event.organizer.toString(), "2");
    if (req.user._id.toString() === event.organizer.toString()) {
      if (currntDate < event.start_Time && req.body.status === "accepted") {
        event.joined_players.push(request.user);
        request.status = "accepted";
      }

      // if orgnizer want to reject request
      if (currntDate < event.start_Time && req.body.status === "rejected") {
        request.status = "rejected";
        let removeRejectPlayer = event.joined_playes.filter(
          (id) => id !== request.user
        );
        event.joined_players = removeRejectPlayer;
      }

      request = await request.save();
      event = await event.save();

      res.json(`your query is ${req.body.status}`);
    } else {
      res.status(400).json({ error: "You are not Orgnizer" });
    }
  } catch (eroor) {
    res.status(400).json({ error: eroor.message });
  }
};

exports.getEventDetails = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = await Event.findById(eventId)
      .populate({
        path: "joined_players",
        select: "_id fName lName email",
      })
      .populate({
        path: "organizer",
        select: "_id fName lName email",
      });
    if (!event) {
      return res.status(400).json({ message: "Invaild Event Id" });
    }
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.expirePendingJoinRequests = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const event = await Event.findById(eventId);
    const now = new Date();

    if (now >= event.start_Time && !event.is_pending_requests_expired) {
      const pendingJoinRequests = await JoinRequest.find({
        event: eventId,
        status: "pending",
      });

      for (const joinRequest of pendingJoinRequests) {
        joinRequest.status = "rejected";
        await joinRequest.save();
      }

      event.is_pending_requests_expired = true;
      await event.save();
    }

    next();
  } catch (error) {
    next(error);
  }
};

// -----------------------------------
