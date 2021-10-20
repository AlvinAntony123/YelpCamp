const Campground = require('../models/campground');
const mapbox = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mapbox({ accessToken: mapboxToken });
const User = require('../models/campground');
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res, next) => {
    try {
        const campgrounds = await Campground.find({});
        res.render('campground/index', { campgrounds });
    } catch (e) {
        next(e);
    }
}

module.exports.new = (req, res) => {
    res.render('campground/new');
}

module.exports.newPost = async (req, res, next) => {
    try {
        const geodata = await geocoder.forwardGeocode({
            query: req.body.location
        }).send();
        const camp = new Campground(req.body);
        camp.geometry = geodata.body.features[0].geometry;
        camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
        camp.author = req.user._id;
        await camp.save();
        console.log(camp);
        req.flash('success', 'You Have Successfully Made A Campground');
        res.redirect(`/campgrounds/${camp._id}`);
    } catch (e) {
        next(e);
    }
}

module.exports.show = async (req, res, next) => {
    try {
        const { id } = req.params;
        const camp = await Campground.findById(id).populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');
        if (!camp) {
            req.flash('error', "Campground Doesn't Exist");
            res.redirect('/campgrounds');
        }
        res.render('campground/show', { camp });
    } catch (e) {
        next(e);
    }
}

module.exports.edit = async (req, res, next) => {
    try {
        const { id } = req.params;
        const camp = await Campground.findById(id);
        if (!camp) {
            req.flash('error', "Campground Doesn't Exist");
            return res.redirect('/campgrounds');
        }
        res.render('campground/edit', { camp });
    } catch (e) {
        next(e);
    }
}

module.exports.editPost = async (req, res, next) => {
    if (!req.body) {
        throw new ExpressError('Invalid Campground Data', 400);
    }
    try {
        const geodata = await geocoder.forwardGeocode({
            query: req.body.location
        }).send();
        const { id } = req.params;
        const camp = await Campground.findByIdAndUpdate(id, req.body);
        camp.geometry = geodata.body.features[0].geometry;
        img = req.files.map(f => ({ url: f.path, filename: f.filename }));
        camp.images.push(...img);
        await camp.save();
        if (req.body.deleteImages) {
            for (let filename of req.body.deleteImages) {
                await cloudinary.uploader.destroy(filename);
            }
            await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        }
        req.flash('success', 'Successfully Edited The Campground Details');
        res.redirect(`/campgrounds/${id}`);
    } catch (e) {
        next(e);
    }
}

module.exports.delete = async (req, res, next) => {
    try {
        const { id } = req.params;
        const camp = await Campground.findByIdAndDelete(id);
        req.flash('success', 'Successfully Deleted A Campground');
        res.redirect('/campgrounds');
    } catch (e) {
        next(e);
    }
}