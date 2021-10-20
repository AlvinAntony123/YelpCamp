const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("DATABASE CONNECTED");
    })
    .catch(err => {
        console.log(err);
    })

const seedDB = async () => {
    await Campground.deleteMany({});
    for (i = 0; i < 100; i++) {
        rand = Math.floor(Math.random() * 1000);
        price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '616875c15b3058a3c80a13c7',
            title: `${descriptors[Math.floor(Math.random() * descriptors.length)]} ${places[Math.floor(Math.random() * places.length)]}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dhhs7kyyr/image/upload/v1634058269/YelpCamp/lnp5c3lzgbgexe8otltj.jpg',
                    filename: 'YelpCamp/lnp5c3lzgbgexe8otltj'
                },
                {
                    url: 'https://res.cloudinary.com/dhhs7kyyr/image/upload/v1634058269/YelpCamp/prx8f6kia2rotmbzjwz1.jpg',
                    filename: 'YelpCamp/prx8f6kia2rotmbzjwz1'
                }
            ],
            location: `${cities[rand].city}, ${cities[rand].state}`,
            geometry: {
                type: 'Point',
                coordinates: [cities[rand].longitude, cities[rand].latitude]
            },
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dignissimos in, ut provident similique asperiores iste, numquam enim nam commodi reiciendis perspiciatis autem culpa, mollitia facere aut rem ad labore? Optio!',
            price: price
        });
        await camp.save();
    }
}

seedDB()
    .then(() => {
        mongoose.connection.close();
    })

