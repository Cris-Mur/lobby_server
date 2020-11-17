//const moment = require('moment');
require('dotenv').config();
var express = require('express');
var router = express.Router();
// const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Calendar = require('../models/Calendar/calendarModel');
const Event = require('../models/Calendar/eventModel');
const verifyAdminRole = require('../services/authAdmin');
//const jwt = require('jsonwebtoken');
//const { response } = require('express');
const chckAuth = require('../services/authUser');
// const { v4: uuidv4 } = require('uuid');
//PUBLIC METHODS //

router.post('/events', verifyAdminRole, function(req, res, next) {
  const { username } = chckAuth(req.get('accessToken'));
  if (req.body.start < Date.now()) {
    res.status(400).json({message: 'You not modify the past...'})
    return;
  }

  const _end = parseInt(req.body.start) + 3600000;
  console.log(req.body.limit)
  const event = new Event({
    _id: mongoose.Types.ObjectId(),
    start: req.body.start,
    title: username,
    end: _end,
    limit: req.body.limit || -1,
  });

  event.description = `created at ${Date.now()} by ${username}`;

  if (event.limit > 0) {
    event.color = '#0082FD';
  } else if (event.limit === 0) {
    event.color = '#FF6F73';
  } else {
    event.color = '#2ECC97';
  }

  event
    .save()
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    });
    Calendar.findOne()
    .exec()
    .then(result =>{
      result.events.push(event)
      result.save()
      res.status(200).json({id: event._id})
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    });
});


router.patch('/events', verifyAdminRole, function(req, res, next) {
  const { username } = chckAuth(req.get('accessToken'));

  if (req.body.start < Date.now()) {
    res.status(500).json({message: 'You not modify the past...'})
  }

  const new_data = {
    title: username,
  }

  if (req.body.limit != "" && req.body.limit != undefined) {
    new_data.limit = parseInt(req.body.limit);
    if (new_data.limit > 0) {
      new_data.color = '#0082FD';
    } else if (new_data.limit === 0) {
      new_data.color = '#FF6F73';
    } else {
      new_data.color = '#2ECC97';
    }
  }

  console.log(req.body.start);
  if (typeof(req.body.start) === 'string') {
    new_data.start = Date.parse(req.body.start);
    new_data.end = new_data.start + 3600000;
  }

  new_data.description = `Updated at ${Date.now()} by ${username}`

  console.log(new_data);
  Event.findOneAndUpdate({_id: req.body.id}, new_data).exec()
  .then(result => {
    console.log(result);
    res.status(200).json(result);
  }).catch(err => {
    console.log(err)
    res.status(500).json({
      error: err
    })
  });

});

router.patch('/events/:eventId', function(req, res, next) {
  //console.log(chckAuth(req.get('authorization')));

  let user = {};

  if (req.get('accessToken') === undefined) {
    user = chckAuth(req.get('authorization'));
    if (chckAuth(req.get('authorization')) === false) {
      res.status(401).json({message: 'User Not Authorized'})
      return;
    }
  } else {
    user = chckAuth(req.get('accessToken'));
    if (chckAuth(req.get('accessToken')) === false) {
      res.status(401).json({message: 'User Not Authorized'})
      return;
    }
  }

  const eId = req.params.eventId;

  if (req.body.start < Date.now()) {
    res.status(500).json({message: 'You not modify the past...'})
    return;
  }

  Event.findOne({_id: eId}).then(function (record) {
    if (record.limit < 0 || record.limit > 0) {

      if (record.suscriptors[user._id] === undefined) {
        record.limit -= 1;
        if (record.limit === 0) {
          record.color = '#FF6F73';
        }
      } else {
        res.status(304).json({
          message: 'this user already exist :D '
        });
        return;
      }
      
      record.suscriptors[user._id] = {
        idx: Object.keys(record.suscriptors).length,
        username: user.username,
        avatar: user.avatar
      };
      record.__v = Object.keys(record.suscriptors).length
      record.markModified('suscriptors');

      record.save().then(result => {
        console.log(result);
        // (new Date(RT)).getUTCDay();
        res.status(201).json({
          message: `Added user to event ${eId}`,
          UpdatedSocket: result
        });
      })

    } else {
      res.status(304).json({message: 'Event is full (7u7)'})
    }
  })
  .catch(error => {
    console.log(error);
    res.status(404).json({error: 'Event not found'});
  });

});



router.delete('/events/:eventId/', function(req, res, next) {
  let user = {};

  if (req.get('accessToken') === undefined) {
    user = chckAuth(req.get('authorization'));
    if (chckAuth(req.get('authorization')) === false) {
      res.status(401).json({message: 'User Not Authorized'})
      return;
    }
  } else {
    user = chckAuth(req.get('accessToken'));
    if (chckAuth(req.get('accessToken')) === false) {
      res.status(401).json({message: 'User Not Authorized'})
      return;
    }
  }

  const eId = req.params.eventId;

  if (req.body.start < Date.now()) {
    res.status(500).json({message: 'You not modify the past...'})
    return;
  }

  Event.findOne({_id: eId}).then(function (record) {
      if (record.suscriptors[user._id] != undefined) {
        if (record.limit >= 0) {
          record.limit += 1;
        }
        if (record.limit > 0) {
          record.color = '#0082FD';
        } else if (record.limit === 0) {
          record.color = '#FF6F73';
        } else {
          record.color = '#2ECC97';
        }

        delete record.suscriptors[user._id];
        record.__v = Object.keys(record.suscriptors).length;
        record.markModified('suscriptors');
        record.save().then(result => {
          console.log(result);
          // (new Date(RT)).getUTCDay();
          res.status(201).json({
            message: `Added user to event ${eId}`,
            UpdatedSocket: result
          });
        })

      } else {
        res.status(304).json({
          message: `this user can't unsuscribe :D `
        });
        return;
      }
  })
  .catch(error => {
    console.log(error);
    res.status(404).json({error: 'Event not found'});
  });

});

router.delete('/events', verifyAdminRole, function(req, res, next) {
  const eventId = req.body._id
  Event.findById({ _id: eventId })
    .then(function (event) {
      event.remove() // doc.remove will trigger the remove middleware
      res.status(200).json({event})
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    });
  console.log(eventId);
});

router.post('/', verifyAdminRole, function(req, res, next) {
  const calendar = new Calendar({
    _id: mongoose.Types.ObjectId()
  });
  calendar
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({message: 'calendar set', calendar: calendar})
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    });
});

router.get('/', function(req, res, next) {
  console.log(chckAuth(req.get('accessToken')));
  if (chckAuth(req.get('accessToken'))) {
    Calendar.find().populate('events')
      .exec()
      .then(docs => {
        console.log({ 'Calendar founded': docs});
        res.status(200).json(docs[0]);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
      });
  } else {
    res.status(401).json({message: 'User Not Authorized'});
  }
});

router.get('/events', verifyAdminRole, function(req, res, next) {
    Event.find()
      .exec()
      .then(docs => {
        console.log('The events were found');
        res.status(200).json(docs);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
      });
  });

module.exports = router;