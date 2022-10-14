const express = require('express');
const router = express.Router();
const shelters = require('../controllers/shelters');
const catchAsync = require('../utils/catchAsync');

const Shelter = require('../models/shelter');
const { isLoggedIn, validateShelter, isAuthor} = require('../middleware');

router.get('/',catchAsync(shelters.index));
 
 router.get('/new', isLoggedIn , shelters.renderNewForm);
 
 router.post('/',isLoggedIn, validateShelter, catchAsync(shelters.createShelter));
 
 router.get('/:id', catchAsync(shelters.showShelter));
 
 router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(shelters.renderEdit));
 
 router.put('/:id',isLoggedIn,isAuthor,validateShelter, catchAsync(shelters.updateShelter));
 
 router.delete('/:id', isLoggedIn,isAuthor,catchAsync(shelters.deleteShelter));
 
 module.exports = router;