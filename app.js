const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { shelterSchema, reviewSchema } = require('./schemas.js')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Shelter = require('./models/shelter');
const Review = require('./models/review');


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

const validateShelter = (req,res,next) => {
      const {error} =  shelterSchema.validate(req.body);
      if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
    
}


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

app.post('/shelters',validateShelter, catchAsync(async (req, res, next) => {
  
  
    const shelter = new Shelter(req.body.shelter);
    await shelter.save();
    res.redirect(`/shelters/${shelter._id}`);
    }));

app.get('/shelters/:id',catchAsync(async (req, res,) => {
    const shelter = await Shelter.findById(req.params.id).populate('reviews');
    res.render('shelters/show',{shelter});
}));

app.get('/shelters/:id/edit',catchAsync(async (req, res) => {
    const shelter = await Shelter.findById(req.params.id)
    res.render('shelters/edit',{shelter});
}));

app.put('/shelters/:id',validateShelter, catchAsync(async (req, res) => {
    const { id } = req.params;
    const shelter = await Shelter.findByIdAndUpdate(id,{ ...req.body.shelter });
    res.redirect(`/shelters/${shelter._id}`);
}));

app.delete('/shelters/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Shelter.findByIdAndDelete(id);
    res.redirect('/shelters');
}));

app.post('/shelters/:id/reviews',validateReview, catchAsync(async (req, res) => {
   const shelter = await Shelter.findById(req.params.id);
   const review = new Review(req.body.review);
   shelter.reviews.push(review);
   await review.save();
   await shelter.save();
   res.redirect(`/shelters/${shelter._id}`);
}));

app.delete('/shelters/:id/reviews/:reviewId', catchAsync(async(req,res) => {
    const { id, reviewId } = req.params;
    await Shelter.findByIdAndUpdate(id, {$pull: { reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/shelters/${id}`);
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) =>{
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!!!'
    res.status(statusCode).render('error', { err });
})

app.listen(3000, ()=>{
console.log('Serving on Port 3000');
})