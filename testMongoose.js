const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-Parser');
const Schema = mongoose.Schema;
var app = express();
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost/mydb");
mongoose.connection.once('open', () => {
  console.log("Connected!");
}).on('error', (err) => {
  console.log(err + " has occured!");
})

function validator(v) {
  let temp = (v.match(/[a-zA-Z0-9 ]+/));
  return temp[0].length == temp.input.length;
}
var productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: 1,
    unique: true,
    validate: [validator, 'Name cannot have special characters!']
  },
  desc: {
    type: String,
    trim: 1,
    maxlength: [30, 'Maximum length of description is 30!'],
    default: ''
  },
  price: {
    type: Number,
    trim: 1,
    required: true,
    max: [10000000, 'Price cannot be greater than 1 crore!']
  },
  quantity: {
    type: Number,
    trim: 1,
    required: true,
    max: [30, 'Quantity has to be less than 30!']
  }
});

const mod = mongoose.model('Product', productSchema);
//
// var test = new mod({
//   name: 'Sansui TV 4',
//   price: 98500,
//   quantity: 3
// });

app.get('/form', (req, res) => {
  res.sendFile(__dirname + '/index.html');

});

app.post('/save', (req, res) => {
  var prod = new mod({
    name: req.body.name,
    desc: req.body.desc,
    price: req.body.price,
    quantity: req.body.quan
  });
  prod.save().then(() => {
    res.end("<h1>Saved Successfully!</h1>")
  }).catch((err) => {
    res.end("<h1>Couldn't save!</h1><br/> Error: "+err);
  });
})
app.post('/update',(req,res)=>{
  var prod = new mod({
    name: req.body.name,
    desc: req.body.desc,
    price: req.body.price,
    quantity: req.body.quan
  });
    var obj={
      name:prod.name
    }
    if(prod.desc)
      obj.desc=prod.desc;
    if(prod.price)
      obj.price=prod.price;
    if(prod.quantity)
      obj.quantity=prod.quantity;
    mod.find({name:req.body.name}).then((result)=>{
      mod.findByIdAndUpdate(result[0]._id,obj).then((result2)=>{
        res.end("<h1>Updated!</h1>");
      }).catch((err)=>{
        res.end("<h1>Coudlnt update</h1>");
      })
    }).catch((err)=>{
      console.log("Couldn't find");
    })
  });
  app.post('/delete',(req,res)=>{
    mod.find({name:req.body.name}).then((result)=>{
      mod.findByIdAndRemove(result[0]._id).then((result2)=>{
        res.end("<h1>Deleted!</h1>");
      }).catch((err)=>{
        res.end("<h1>No object without that name!</h1>");
      })
    }).catch((err)=>{
      res.end("Couldnt delete");
    })
  })
app.get('/cart',(req,res)=>{
  mod.find({}).then((result)=>{
      res.send(result);
  }).catch((err)=>{
    res.write("Error! "+err);
    res.end();
  });
})
app.listen(8080, () => {
  console.log("Server is up!");
})
