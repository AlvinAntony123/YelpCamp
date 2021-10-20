const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');
const { campgroundSchema } = require('../schema.js')
const { isLoggedIn, validateCampground, isCampOwner } = require('../middleware');
const user = require('../models/user');
const User = require('../models/user');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(campgrounds.index)
    .post(isLoggedIn, upload.array('image'), validateCampground, campgrounds.newPost)

router.get('/new', isLoggedIn, campgrounds.new)

router.route('/:id')
    .get(campgrounds.show)
    .put(isLoggedIn, upload.array('image'), validateCampground, isCampOwner, campgrounds.editPost)
    .delete(isLoggedIn, campgrounds.delete)

router.get('/:id/edit', isLoggedIn, isCampOwner, campgrounds.edit)

module.exports = router;