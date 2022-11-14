const express = require('express');
const router = express.Router();
const shelters = require('../controllers/shelters');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const { isLoggedIn, validateShelter, isAuthor } = require('../middleware');
const shelter = require('../models/shelter');

router.route('/')
    .get(catchAsync(shelters.index))
    .post(isLoggedIn, upload.array('image'), validateShelter, catchAsync(shelters.createShelter));


router.get('/new', isLoggedIn, shelters.renderNewForm);

router.route('/:id')
    .get(catchAsync(shelters.showShelter))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateShelter, catchAsync(shelters.updateShelter))
    .delete(isLoggedIn, isAuthor, catchAsync(shelters.deleteShelter));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(shelters.renderEdit));


module.exports = router;