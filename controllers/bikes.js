const Bike = require('../models/bike');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res) => {
    const bikes = await Bike.find({});
    res.render('bikes/index', { bikes });
}

module.exports.renderNewForm = (req, res) => {
    res.render('bikes/new');
}

module.exports.createBike = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.bike.location,
        limit: 1
    }).send()
    const bike = new Bike(req.body.bike);
    bike.geometry = geoData.body.features[0].geometry;
    bike.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    bike.author = req.user._id;
    await bike.save();
    req.flash('success', 'Successfully made a new Bike');
    res.redirect(`/bikes/${bike._id}`);
}

module.exports.showBike = async (req, res,) => {
    const bike = await Bike.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!bike) {
        req.flash('error', 'Cannot find the bike');
        return res.redirect('/shelters')
    }
    res.render('bikes/show', { bike });
}

module.exports.renderEdit = async (req, res) => {
    const { id } = req.params;
    const bike = await Bike.findById(id)
    if (!bike) {
        req.flash('error', 'Cannot find the bike');
        return res.redirect('/bikes')
    }

    res.render('bikes/edit', { bike });
}

module.exports.updateBike = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const bike = await Bike.findByIdAndUpdate(id, { ...req.body.bike });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    bike.images.push(...imgs);
    await bike.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await bike.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated bike');
    res.redirect(`/bikes/${bike._id}`);
}

module.exports.deleteBike = async (req, res) => {
    const { id } = req.params;
    await Bike.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted a Bike!!');
    res.redirect('/bikes');
}