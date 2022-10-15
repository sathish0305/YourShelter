const Shelter = require('../models/shelter');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");


module.exports.index = async(req,res) =>{
    const shelters = await Shelter.find({});
    res.render('shelters/index', {shelters});
 }

 module.exports.renderNewForm = (req,res) => {
    res.render('shelters/new');
}

module.exports.createShelter = async (req, res, next) => {
   const geoData = await geocoder.forwardGeocode({
        query: req.body.shelter.location,
        limit:1
    }).send()
    const shelter = new Shelter(req.body.shelter);
    shelter.geometry = geoData.body.features[0].geometry;
    shelter.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    shelter.author = req.user._id;
    await shelter.save();
    console.log(shelter);
    req.flash('success', 'Successfully made a new shelter');
    res.redirect(`/shelters/${shelter._id}`);
    }

module.exports.showShelter = async (req, res,) => {
    const shelter = await Shelter.findById(req.params.id).populate({
       path: 'reviews',
       populate:{
           path: 'author'
       }
   }).populate('author');
    if(!shelter){
       req.flash('error','Cannot find the shelter');
       return res.redirect('/shelters')
    }
    res.render('shelters/show',{shelter});
}

module.exports.renderEdit = async (req, res) => {
    const { id } = req.params;
     const shelter = await Shelter.findById(id)
     if(!shelter){
        req.flash('error','Cannot find the shelter');
        return res.redirect('/shelters')
     }
      
     res.render('shelters/edit',{shelter});
 }

 module.exports.updateShelter = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const shelter = await Shelter.findByIdAndUpdate(id,{ ...req.body.shelter });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    shelter.images.push(...imgs);
    await shelter.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
    await shelter.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    console.log(shelter)
    }
    req.flash('success', 'Successfully updated shelter');
    res.redirect(`/shelters/${shelter._id}`);
}

module.exports.deleteShelter = async (req, res) => {
    const { id } = req.params;
    await Shelter.findByIdAndDelete(id);
    req.flash('success','Successfully Deleted a Shelter!!');
    res.redirect('/shelters');
}