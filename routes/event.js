const express = require('express')
const router = express.Router()
const {createEvents, joinRequestByUsers,verifedByOrganizer,getEventDetails ,expirePendingJoinRequests} = require('../controller/events')
const {Authrization} = require('../Auth/auth')

router.post('/createEvent',Authrization, createEvents)
router.post('/request-for-joining/:eventId' ,Authrization, joinRequestByUsers)
router.put('/update/request/:requestId' ,Authrization, verifedByOrganizer)
router.get('/joinee-details/:eventId',Authrization,expirePendingJoinRequests, getEventDetails)
module.exports = router