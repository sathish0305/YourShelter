const express = require('express');
const router = express.Router();
const { shelterSchema } = require('../schemas.js')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Shelter = require('../models/shelter');


const validateShelter = (req,res,next) => {
    const {error} =  shelterSchema.validate(req.body);
    if(error){
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
  } else {
      next();
  }
}

router.get('/', async(req,res) =>{
    const shelters = await Shelter.find({});
    res.render('shelters/index', {shelters});
 })
 
 router.get('/new', (req,res) => {
     res.render('shelters/new');
 })
 
 router.post('/',validateShelter, catchAsync(async (req, res, next) => {
     const shelter = new Shelter(req.body.shelter);
     await shelter.save();
     res.redirect(`/shelters/${shelter._id}`);
     }));
 
 router.get('/:id',catchAsync(async (req, res,) => {
     const shelter = await Shelter.findById(req.params.id).populate('reviews');
     res.render('shelters/show',{shelter});
 }));
 
 router.get('/:id/edit',catchAsync(async (req, res) => {
     const shelter = await Shelter.findById(req.params.id)
     res.render('shelters/edit',{shelter});
 }));
 
 router.put('/:id',validateShelter, catchAsync(async (req, res) => {
     const { id } = req.params;
     const shelter = await Shelter.findByIdAndUpdate(id,{ ...req.body.shelter });
     res.redirect(`/shelters/${shelter._id}`);
 }));
 
 router.delete('/:id', catchAsync(async (req, res) => {
     const { id } = req.params;
     await Shelter.findByIdAndDelete(id);
     res.redirect('/shelters');
 }));
 
 module.exports = router;