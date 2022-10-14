const express = require('express');
const router = express.Router();
const shelters = require('../controllers/shelters');
const catchAsync = require('../utils/catchAsync');

const Shelter = require('../models/shelter');
const { isLoggedIn, validateShelter, isAuthor} = require('../middleware');




router.get('/',catchAsync(shelters.index));
 
 router.get('/new', isLoggedIn , shelters.renderNewForm);
 
 router.post('/',isLoggedIn, validateShelter, catchAsync());
 
 router.get('/:id', catchAsync(async (req, res,) => {
     const shelter = await Shelter.findById(req.params.id).populate({
        path: 'reviews',
        populate:{
            path: 'author'
        }
    }).populate('author');

     console.log(shelter);
     if(!shelter){
        req.flash('error','Cannot find the shelter');
        return res.redirect('/shelters')
     }
     res.render('shelters/show',{shelter});
 }));
 
 router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
     const shelter = await Shelter.findById(id)
     if(!shelter){
        req.flash('error','Cannot find the shelter');
        return res.redirect('/shelters')
     }
      
     res.render('shelters/edit',{shelter});
 }));
 
 router.put('/:id',isLoggedIn,isAuthor,validateShelter, catchAsync(async (req, res) => {
     const { id } = req.params;
    
    const shelter = await Shelter.findByIdAndUpdate(id,{ ...req.body.shelter });
     req.flash('success', 'Successfully updated shelter');
     res.redirect(`/shelters/${shelter._id}`);
 }));
 
 router.delete('/:id', isLoggedIn,isAuthor,catchAsync(async (req, res) => {
     const { id } = req.params;
     await Shelter.findByIdAndDelete(id);
     req.flash('success','Successfully Deleted a Shelter!!');
     res.redirect('/shelters');
 }));
 
 module.exports = router;