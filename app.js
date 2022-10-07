const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Shelter = require('./models/shelter');


mongoose.connect('mongodb://localhost:27017/shelter-camp',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"Connection error: "));
db.once("open",()=>{
    console.log("Database Connected");
});


const app = express();

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

app.get('/', (req,res) =>{
    res.render('home')
})

app.get('/makeShelter', async (req,res) =>{
   const camp = new Shelter({title: 'My Backyard', description: "Cheap Shelter"});
   await camp.save();
   res.send(camp);
})

app.listen(3000, ()=>{
console.log('Serving on Port 3000');
})