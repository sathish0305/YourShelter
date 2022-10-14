const Shelter = require('../models/shelter');

module.exports.index = async(req,res) =>{
    const shelters = await Shelter.find({});
    res.render('shelters/index', {shelters});
 }

 module.exports.renderNewForm = (req,res) => {
    res.render('shelters/new');
}

module.exports.createShelter = async (req, res, next) => {
    const shelter = new Shelter(req.body.shelter);
    shelter.author = req.user._id;
    await shelter.save();
    req.flash('success', 'Successfully made a new shelter');
    res.redirect(`/shelters/${shelter._id}`);
    }