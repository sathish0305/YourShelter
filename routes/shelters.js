const express = require('express');
const router = express.Router();
const shelters = require('../controllers/shelters');
const catchAsync = require('../utils/catchAsync');

const Shelter = require('../models/shelter');
const { isLoggedIn, validateShelter, isAuthor} = require('../middleware');

router.route('/')
    .get(catchAsync(shelters.index))
    .post(isLoggedIn, validateShelter, catchAsync(shelters.createShelter));

router.get('/new', isLoggedIn , shelters.renderNewForm);

router.route('/:id')
    .get(catchAsync(shelters.showShelter))
    .put(isLoggedIn,isAuthor,validateShelter, catchAsync(shelters.updateShelter))
    .delete(isLoggedIn,isAuthor,catchAsync(shelters.deleteShelter));

 router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(shelters.renderEdit));

 module.exports = router;