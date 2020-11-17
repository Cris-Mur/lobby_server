equire('dotenv').config();
var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Chat = require('../models/Chat/chatModel');
const User = require('../models/userModel');
const Thread = require('../models/Chat/threadModel');
const Contact = require('../models/Chat/contactModel');
const verifyAdminRole = require('../services/authAdmin');
const jwt = require('jsonwebtoken');

router.get('/contacts', function(req, res, next) {
  const Authorization = req.get('accessToken');
  if (!Authorization) {
    console.log('Authorization not found');
    res.status(401).json({ message: 'Authorization token missing' });
  }
  const Token = Authorization.split(' ')[1];
  const { _id } = jwt.verify(Token,
  process.env.tokenSeed);
  console.log(_id);
  Chat.findOne({owner_id: _id}).populate('contacts')
  .exec()
  .then(result => {
    console.log(result);
    res.status(200).json({contacts: result})
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({error: err});
  })
});
router.get('/threads', function(req, res, next) {
  const Authorization = req.get('accessToken');
  if (!Authorization) {
    console.log('Authorization not found');
    res.status(401).json({ message: 'Authorization token missing' });
  }
  const Token = Authorization.split(' ')[1];
  const { _id } = jwt.verify(Token,
  process.env.tokenSeed);
  console.log(_id);
  Chat.findOne({owner_id: _id}).populate('threads')
  .exec()
  .then(result => {
    console.log(result);
    res.status(200).json({threads: result})
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({error: err});
  })
});
router.get('/thread/:threadKey', function(req, res, next) {
  const { threadKey } = config.params;
  const Authorization = req.get('accessToken');
  if (!Authorization) {
    console.log('Authorization not found');
    res.status(401).json({ message: 'Authorization token missing' });
  }
  const Token = Authorization.split(' ')[1];
  const { _id } = jwt.verify(Token,
  process.env.tokenSeed);
  console.log(_id);
  Thread.findOne({key: threadKey}).populate('messages')
  .exec()
  .then(result => {
    console.log(result);
    res.status(200).json({thread: result})
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({error: err});
  })
});
router.post('/messages/new', function(req, res, next) {
  const Authorization = req.get('accessToken');
  if (!Authorization) {
    console.log('Authorization not found');
    res.status(401).json({ message: 'Authorization token missing' });
  }
  const Token = Authorization.split(' ')[1];
  const { _id } = jwt.verify(Token,
  process.env.tokenSeed);
  const { userId, threadKey, body } = JSON.parse(request.data);
  const message = new Message ({
    body: body,
    contentType: 'text',
    senderId: userId
  });
  message
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
  //let thread = db.threads.find((_thread) => _thread.key === threadKey);
  if (Thread.exists({key: ThreadKey})) {
    Thread.findOne({key: threadKey}).populate('messages')
    .exec()
    .then(result => {
      let threadCache = result;
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    })
  } else {
    const thread = new Thread({
      key: threadKey,
      type: 'ONE_TO_ONE',
    });
    thread
    .save()
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
  }
  thread.push.messages(message)
  //const otherUser = db.contacts.find((contact) => contact.username === threadKey);
  Contact.findOne({username: threadKey})
  .exec()
  .then(result => {
    const otherUser = result
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({error: err});
  })
  if (!thread) {
    thread = {
      id: uuidv4(),
      key: threadKey,
      type: 'ONE_TO_ONE',
      messages: [message],
      participantIds: [
        otherUser.id,
        userId
      ],
      unreadCount: 0
    };

    _.assign(db, {
      threads: [...db.threads, thread]
    });
  } else {
    _.assign(thread, {
      messages: [...thread.messages, message]
    });
  }

  return [200, {
    threadKey,
    otherUserId: otherUser.id,
    message
  }];
});