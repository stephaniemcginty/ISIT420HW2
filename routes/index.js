var express = require('express');
var router = express.Router();

// mongoose is a API wrapper overtop of mongodb, just like
// .ADO.Net is a wrapper over raw SQL server interface
const mongoose = require("mongoose");

const Pets = require("../Pets");

// edited to include my non-admin, user level account and PW on mongo atlas
// and also to include the name of the mongo DB that the collection
const dbURI = "xxxxxxxx";
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

/* GET all Pets */
router.get('/Pets', function(req, res) {
  // find {  takes values, but leaving it blank gets all}
  Pets.find({}, (err, AllPets) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).json(AllPets);
  });
});




/* post a new Pet and push to Mongo */
router.post('/NewPet', function(req, res) {

    let oneNewPet = new Pets(req.body);  
    console.log(req.body);
    oneNewPet.save((err, pet) => {
      if (err) {
        res.status(500).send(err);
      }
      else {
      console.log(pet);
      res.status(201).json(pet);
      }
    });
});


router.delete('/DeletePet/:id', function (req, res) {
  Pets.deleteOne({ _id: req.params.id }, (err, note) => { 
    if (err) {
      res.status(404).send(err);
    }
    res.status(200).json({ message: "Pet successfully deleted" });
  });
});


router.put('/UpdatePet', function (req, res) {
  Pets.findOneAndUpdate(
    { _id: req.body.id },
    {
      name: req.body.name,
      age: req.body.age,
      breed: req.body.breed,
      gender: req.body.gender,
      status: req.body.status
    },
    { new: true },
    (err, pet) => {
      if (err) {
        res.status(500).send(err);
    }
    res.status(200).json(pet);
    })
  });


  /* GET one Pet */
router.get('/FindPet/:id', function(req, res) {
  console.log(req.params.id );
  Pets.find({ _id: req.params.id }, (err, onePet) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).json(onePet);
  });
});

module.exports = router;
