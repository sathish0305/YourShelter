const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
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

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get('/', (req,res) =>{
    res.render('home')
})

app.get('/shelters', async(req,res) =>{
   const shelters = await Shelter.find({});
   res.render('shelters/index', {shelters});
})

app.get('/shelters/new', (req,res) => {
    res.render('shelters/new');
})

app.post('/shelters',async(req,res) => {
    const shelter = new Shelter(req.body.shelter);
    await shelter.save();
    res.redirect(`/shelters/${shelter._id}`);
})

app.get('/shelters/:id',async(req,res) => {
    const shelter = await Shelter.findById(req.params.id)
    res.render('shelters/show',{shelter});
})

app.get('/shelters/:id/edit',async(req,res) => {
    const shelter = await Shelter.findById(req.params.id)
    res.render('shelters/edit',{shelter});
})

app.put('/shelters/:id', async(req,res) => {
    const { id } = req.params;
    const shelter = await Shelter.findByIdAndUpdate(id,{ ...req.body.shelter });
    res.redirect(`/shelters/${shelter._id}`);
})

app.delete('/shelters/:id', async(req,res) => {
    const { id } = req.params;
    await Shelter.findByIdAndDelete(id);
    res.redirect('/shelters');
})

app.listen(3000, ()=>{
console.log('Serving on Port 3000');
})