var express = require('express');
var router = express.Router();

// mongoose is a API wrapper overtop of mongodb, just like
// .ADO.Net is a wrapper over raw SQL server interface
const mongoose = require("mongoose");

const Orders = require("../Orders");

// edited to include my non-admin, user level account and PW on mongo atlas
// and also to include the name of the mongo DB that the collection
const dbURI = "xxxxxxxxxxxxxxxxxxxx";
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



/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile('index.html');
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
