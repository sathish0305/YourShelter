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
   
   const shelter = await Shelter.findByIdAndUpdate(id,{ ...req.body.shelter });
    req.flash('success', 'Successfully updated shelter');
    res.redirect(`/shelters/${shelter._id}`);
}

module.exports.deleteShelter = async (req, res) => {
    const { id } = req.params;
    await Shelter.findByIdAndDelete(id);
    req.flash('success','Successfully Deleted a Shelter!!');
    res.redirect('/shelters');
}