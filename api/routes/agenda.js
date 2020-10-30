require('dotenv').config();
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Agenda = require('../models/agendaModel');
const Socket = require('../models/dispSockModel');
const verifyAdminRole = require('../services/authAdmin');
const jwt = require('jsonwebtoken');

function chck_auth(Authorization) {
  if (!Authorization) {
    console.log('Authorization not found');
    response.status(401).json({ message: 'Authorization token missing' });
  }
  const accessToken = Authorization.split(' ')[1];
  const token = jwt.verify(accessToken, process.env.tokenSeed);
  return token;
};


// ADMINISTRATOR METHODS
// Add weekly agenda
router.post('/new', verifyAdminRole, function(request, response, next) {
  
  chck_auth(request.get('accessToken'));

  const start_y = request.body.start_year;
  const start_m = request.body.start_month;
  const start_d = request.body.start_day;
  const start = `${start_y}-${start_m}-${start_d}`;
  if ((new Date(start)).getUTCDay() != 1) {
    console.log('NOT MONDAY');
    response.status(401).json({message: 'Not Monday'})
  }
  let end_d = parseInt(start_d);
  end_d = end_d + 6;
  const end = `${start_y}-${start_m}-${end_d}`;
  if ((new Date(end)).getUTCDay() != 0) {
    console.log('NOT Not Sunday');
    response.status(401).json({message: 'Not Sunday'})
  }

  const agenda = new Agenda({
    _id: mongoose.Types.ObjectId(),
    start_day: start,
    end_day: end,
  });
  // agenda
  //   .save()
  //   .then(result => {
  //     console.log(result);
  //     response.status(201).json({
	//       message: "Handling post Request",
	//       createdAgenda: agenda
  //     })
  //   })
  //   .catch(error => {
  //     console.log(error);
  //     response.status(500).json({
  //       error: 'oh no D: this agenda cannot be created, does it already exist?'
  //     })
  //   });
  response.status(200).json({message: 'testing'});
});

// see weekly agenda
router.get('/', verifyAdminRole, function(request, response, next) {
  chck_auth();
  
  Agenda.find()
    .exec()
    .then(docs => {
      console.log(docs);
      response.status(200).json(docs);
    })
    .catch(error => {
      console.log(error);
      response.status(500).json({error: error});
    });
});

// see especific disponibility space
router.get('/disp/:str_time', verifyAdminRole, function(request, response) {
  chck_auth();

  console.log(_id);
  str_T = request.params.str_time;
  console.log(str_T);
  Socket.find({time: str_T })
      .exec()
      .then(doc => {
        // console.log(doc);
        if (!doc[0]) {
          response.status(404).json({error: 'disponibility not found'});
        }
        response.status(200).json({message: 'disponibility found'});
      })
      .catch(err => {
        // console.log(err);
        response.status(500).json({error: 'disponibility not found'});
      });
// response.status(200).json({message: 'testing'});
});

// displimit ADMIN

router.put('/disp/:str_time', verifyAdminRole, function(request, response) {
  chck_auth();

  N_Limit = request.body.limit;
  console.log(_id);
  str_T = request.params.str_time;
  console.log(str_T);
  Socket.findOne({time: str_T })
      .then(function (result){
        result.limit = parseInt(N_Limit);
        result.save()
        .then(result => {
          console.log(result);
          // (new Date(RT)).getUTCDay();
          response.status(201).json({
            message: "Created New Disponibility socket",
            UpdatedSocket: result
          });
        })
      })
      .catch(err => {
        // console.log(err);
        response.status(500).json({error: 'disponibility not found'});
      });
// response.status(200).json({message: 'testing'});
});

// SELF METHODS
router.post('/disp/new', function(request, response) {
  chck_auth();
  
  const week = ['sunday', 'monday', 'tuesday',
  'wednesday', 'thursday', 'friday', 'saturday'];

  const year = request.body.year;
  const month = request.body.month; 
  const day = request.body.day;
  const hour = request.body.hour;
  const TZ = request.body.timeZone || '+00';
  const RT = `${year}-${month}-${day}T${hour}:00:00.000${TZ}:00`;

  if (Date.parse(RT) < Date.now()) {
    response.status(500).json({message: 'You not modify the past...'})
  }

  console.log('getting monday');
  let prv_monday;
  let diff_day;
  if ((new Date(RT)).getUTCDay() != 1 && (new Date(RT)).getUTCDay() != 0) {
    diff_day = ((new Date(RT)).getUTCDay() - 1);
    prv_monday = new Date((Date.parse(RT) - ((diff_day * 86400000) + (parseInt(hour) * 3600000))));
  } else if ((new Date(RT)).getUTCDay() === 0) {
    diff_day = 6;
    prv_monday = new Date((Date.parse(RT) - ((diff_day * 86400000) + (parseInt(hour) * 3600000))));
  } else if ((new Date(RT)).getUTCDay() === 1) {
    diff_day = 0
    prv_monday = new Date((Date.parse(RT) - ((diff_day * 86400000) + (parseInt(hour) * 3600000))));
  }
  
  console.log(prv_monday);
  console.log(`this socket have agenda in: ${prv_monday}`);
  const sub = {
    usr_id: _id
  };
  console.log(sub);
  console.log(RT);

  const socket = new Socket({
    _id: mongoose.Types.ObjectId(),
    time: RT,
    suscribers: sub,
    day_name: week[(new Date(RT)).getUTCDay()]
  });

  console.log(socket);

  socket.save().then(result => {
      console.log(result);
      // (new Date(RT)).getUTCDay();
      response.status(201).json({
        message: "Created New Disponibility socket",
        CreatedSocket: socket
      })
    }).catch(function (){
        Socket.findOne({time: RT}).then(function (record){
          record.suscribers.push(sub);
          if (record.limit < 0 || record.limit > 0) {
            record.limit -= 1;
            record.save().then(result => {
              console.log(result);
              // (new Date(RT)).getUTCDay();
              response.status(201).json({
                message: "Created New Disponibility socket",
                UpdatedSocket: record
              });
            })

          } else {
            response.status(500).json({message: 'socket complete (7u7)'})
          }
        })
        .catch(error => {
          // console.log(err);
          response.status(500).json({error: 'disponibility not found'});
        });
      });

    // function () 
      // {
      //   Agenda.findOne({_id: '5f8610b7765c8038e3976942'}).then(function (record) 
      //   {
      //     record.week[(new Date(RT)).getUTCDay()].push(socket);
      //     record.save().then(result => 
      //     {
      //       console.log(result);
      //       response.status(201).json(
      //         {
      //           message: "Created New Disponibility socket",
      //           UpdatedSocket: record
      //         });
      //     }).catch(error => {
      //     // console.log(err);
      //     response.status(500).json({error: 'no se puede guardar en la agenda'});
      //   });
      //   }).catch(error => 
      //     {
      //       // console.log(err);
      //       response.status(500).json({error: 'Agenda not found'});
      //     });
      // }

  // response.status(200).json({message: 'testing'});
});

router.put('/:str_time', verifyAdminRole, function(request, response) {
  chck_auth();

  // console.log(_id);
  str_T = request.params.str_time;
  console.log(str_T);
  const disp = Socket.find({time: str_T });
  // const week = Agenda.find({start_day: str_T });
  console.log(Object.getOwnPropertyNames(disp));
  // console.log(week.model());
  // console.log(week.model()['monday']);
  console.log(disp.model());
  response.status(200).json({message: 'testing'});
});

module.exports = router;
