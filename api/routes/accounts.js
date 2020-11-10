require('dotenv').config();
var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const verifyAdminRole = require('../services/authAdmin');
const jwt = require('jsonwebtoken');
const chckAuth = require('../services/authUser');
//PUBLIC METHODS //

router.post('/', function(req, res, next) {
  const user = new User({
    _id: mongoose.Types.ObjectId(),
    avatar: '/static/images/avatars/avatar_2.png',
    bio: req.body.bio,
    country: req.body.country,
    email: req.body.email,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    role: 'USER_ROLE',
    state: req.body.state,
    timezone: req.body.timezone,
  });
  user
    .save()
    .then(result => {
      console.log(`User created: ${result._id}`);
      res.status(201).json({
        message: "Handling post Request",
        createdUser: user
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    });
});

// SELF METHODS //
router.get('/me', function(req, res, next) {
  const Authorization = req.get('accessToken');
  const { _id } = chckAuth(Authorization);
  console.log(`User: ${_id}`);
  User.findById(_id)
  .exec()
  .then(doc => {
    if (doc) {
      res.status(200).json({user: doc});
    } else {
      res.status(401).json({message: 'Invalid authorization token'});
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({error: err});
  });
});

router.put('/profile', function(req, res, next){
  const Authorization = req.get('accessToken');
  const { _id } = chckAuth(Authorization);
  if (!_id) {
    console.log('Authorization not found');
    res.status(401).json({ message: 'Authorization token missing' });
  }
  const id = _id;
  const changes = {}
  for (const [key, value] of Object.entries(req.body)) {
    if (key != '_id' || key != 'username' || key != 'role') {
      if (key == 'password') {
        changes[key] = bcrypt.hashSync(value, 10);
      }
      else {
        changes[key] = value;
      }
    }
  }
  User.findOneAndUpdate({_id: id}, {$set: changes}, {new: true})
    .exec()
    .then(result => {
      console.log({ 'User modified': result});
      res.status(200).json({user: result});
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });
})

router.delete('/me', function(req, res, next) {
  const Authorization = req.get('Authorization');
  const { _id } = chckAuth(Authorization);
  User.findOneAndUpdate({_id: _id}, {status: false}, {new: true})
    .exec()
    .then(result => {
      console.log({ 'User deleted': result});
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });
});
// reactivate user
router.patch('/me', function(req, res, next) {
  const Authorization = req.get('Authorization');
  const { _id } = chckAuth(Authorization);
  User.findOneAndUpdate({_id: _id}, {status: true}, {new: true})
    .exec()
    .then(result => {
      console.log({ 'User activated': result});
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });
});

// ADMINISTRATOR METHODS //

router.get('/', verifyAdminRole, function(req, res, next) {
  const Authorization = req.get('Authorization');
  if (!Authorization) {
    console.log('Authorization not found');
    res.status(401).json({ message: 'Authorization token missing' });
  }

  const accessToken = Authorization.split(' ')[1];
  const { _id } = jwt.verify(accessToken,
                            process.env.tokenSeed).email;
  User.find()
    .exec()
    .then(docs => {
      console.log({ 'User list': docs});
      res.status(200).json(docs);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });
});

router.get('/:userId', verifyAdminRole, function(req, res, next) {
  const Authorization = req.get('Authorization');
  if (!Authorization) {
    console.log('Authorization not found');
    res.status(401).json({ message: 'Authorization token missing' });
  }

  const accessToken = Authorization.split(' ')[1];
  const { _id } = jwt.verify(accessToken,
                            process.env.tokenSeed).email;
  User.findById(req.params.userId)
    .exec()
    .then(docs => {
      console.log({ 'User': docs});
      res.status(200).json(docs);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });
});

router.delete('/:userId', verifyAdminRole, function(req, res, next) {
  const Authorization = req.get('Authorization');
  if (!Authorization) {
    console.log('Authorization not found');
    res.status(401).json({ message: 'Authorization token missing' });
  }

  const accessToken = Authorization.split(' ')[1];
  const { _id } = jwt.verify(accessToken,
                            process.env.tokenSeed).email;
  const id = req.params.userId;
  if (req.query.purge == 'true') {
    User.remove({_id: id})
      .exec()
      .then(result => {
        console.log({ 'User deleted': result});
        res.status(200).json(result);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
      });
  } else {
    User.update({_id: id}, {status: false})
      .exec()
      .then(result => {
        console.log({ 'User inactivated': result});
        res.status(200).json(result);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
      });
  }
});

// reactivate user by id
router.patch('/:userId', verifyAdminRole, function(req, res, next) {
  const Authorization = req.get('Authorization');
  if (!Authorization) {
    console.log('Authorization not found');
    res.status(401).json({ message: 'Authorization token missing' });
  }

  const accessToken = Authorization.split(' ')[1];
  const { _id } = jwt.verify(accessToken,
                            process.env.tokenSeed).email;
  const id = req.params.userId;
  User.update({_id: id}, {status: true})
    .exec()
    .then(result => {
      console.log({ 'User reactivated': result});
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });
});

router.put('/:userId', verifyAdminRole, function(req, res, next){
  const Authorization = req.get('Authorization');
  if (!Authorization) {
    console.log('Authorization not found');
    res.status(401).json({ message: 'Authorization token missing' });
  }

  const accessToken = Authorization.split(' ')[1];
  const { _id } = jwt.verify(accessToken,
                            process.env.tokenSeed).email;
  const id = req.params.userId;
  const changes = {}
  for (const [key, value] of Object.entries(req.body)) {
    if (key != '_id' || key != 'username') {
      changes[key] = value;
    }
  }
  User.update({_id: id}, {$set: changes})
    .exec()
    .then(result => {
      console.log({ 'User modified': result});
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });
});

module.exports = router;
