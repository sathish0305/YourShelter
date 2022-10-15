const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Shelter = require('../models/shelter');



mongoose.connect('mongodb://localhost:27017/shelter-camp',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"Connection error: "));
db.once("open",()=>{
    console.log("Database Connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDb = async () =>{
    await Shelter.deleteMany({});
  for( let i=0;i<50;i++){
    const random1000 = Math.floor(Math.random() * 1000);
    const price =Math.floor(Math.random() * 20) + 10;
   const camp =  new Shelter({
        author: '6347af0105ae893e03402a9b',
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        title: `${sample(descriptors)} ${sample(places)}`,
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio ipsa ratione, dignissimos deleniti et deserunt',
        price,
        geometry:{
          type:"Point",
          coordinates:[-113.1331,47.0202]
        },
        images:  [
          {
            url: 'https://res.cloudinary.com/dbcrwpvfy/image/upload/v1665742793/YourShelter/r92t4icvtjwpzriknnfz.jpg',
            filename: 'YourShelter/r92t4icvtjwpzriknnfz'
          },
          {
            url: 'https://res.cloudinary.com/dbcrwpvfy/image/upload/v1665742793/YourShelter/nqwpudjkuplyvwaqqjvb.png',
            filename: 'YourShelter/nqwpudjkuplyvwaqqjvb'
          }
        ]
    }) 
    await camp.save();
  }
}

seedDb().then(() => {
    mongoose.connection.close();
})
