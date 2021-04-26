var express = require('express');
var router = express.Router();

// initiate hour and day at 0
var GlobalHourPurch = 0;
var GlobalDayPurch = 0;

// mongoose is a API wrapper overtop of mongodb, just like
// .ADO.Net is a wrapper over raw SQL server interface
const mongoose = require("mongoose");

const Orders = require("../Orders");

// edited to include my non-admin, user level account and PW on mongo atlas
// and also to include the name of the mongo DB that the collection
const dbURI = "xxxxxxxxx";
//
// 
// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10
};

mongoose.connect(dbURI, options).then(
  () => {
    console.log("Database connection established!");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);

function random(max) {
  return Math.floor(Math.random() * max);
}

function updateOrder(orderToUpdate)
{
  console.log("test5");
  
  // Increment GlobalHourPurch by a random number between 1 and 5
  GlobalHourPurch = GlobalHourPurch + (random(4)+1);

  // If GlobalHourPurch is greater than 23, subtract 23 and increment GlobalDayPurch by 1
  if (GlobalHourPurch > 23){
    GlobalHourPurch = GlobalHourPurch - 23;
    GlobalDayPurch += 1;
  }
  // Set order HourPurch and DayPurch to Global vars
  orderToUpdate.HourPurch = GlobalHourPurch;
  orderToUpdate.DayPurch = GlobalDayPurch;

  return(orderToUpdate);
}

/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile('index.html');
});

router.post('/', function(req, res) {

  let oneNewOrder = new Orders(req.body);
  //oneNewOrder.set(StoreID = 2222;
  //oneNewOrder.set('HourPurch', 1);
  //oneNewOrder.set('DayPurch', 1); 
  let updatedOrder = updateOrder(oneNewOrder);
  console.log(updatedOrder);
  res.status(200).json({ message: "good to go" });

})

router.post('/SubmitManyOrders', function(req, res) {

  let oneNewOrder = new Orders(req.body);
  let updatedOrder = updateOrder(oneNewOrder);  
  console.log(updatedOrder);
  updatedOrder.save((err, order) => {
    if (err) {
      res.status(500).send(err);
    }
    else {
    console.log(order);
    res.status(201).json(order);
    }
  });
});

/* GET all Orders */
router.get('/Orders', function(req, res) {
  // find {  takes values, but leaving it blank gets all}
  Orders.find({}, (err, AllOrders) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).json(AllOrders);
  });
});





/* post a new Order and push to Mongo */
router.post('/NewOrder', function(req, res) {

    let oneNewOrder = new Orders(req.body);  
    console.log(req.body);
    oneNewOrder.save((err, order) => {
      if (err) {
        res.status(500).send(err);
      }
      else {
      console.log(order);
      res.status(201).json(order);
      }
    });
});


router.delete('/DeleteOrder/:id', function (req, res) {
  Orders.deleteOne({ _id: req.params.id }, (err, note) => { 
    if (err) {
      res.status(404).send(err);
    }
    res.status(200).json({ message: "Order successfully deleted" });
  });
});


router.put('/UpdateOrder', function (req, res) {
  Orders.findOneAndUpdate(
    { _id: req.body.id },
    {
      StoreID: req.body.StoreID,
      SalesPersonID: req.body.SalesPersonID,
      CdID: req.body.CdID,
      PricePaid: req.body.PricePaid
    },
    { new: true },
    (err, order) => {
      if (err) {
        res.status(500).send(err);
    }
    res.status(200).json(order);
    })
  });


  /* GET one Order */
router.get('/FindOrder/:id', function(req, res) {
  console.log(req.params.id );
  Orders.find({ _id: req.params.id }, (err, oneOrder) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).json(oneOrder);
  });
});

module.exports = router;
