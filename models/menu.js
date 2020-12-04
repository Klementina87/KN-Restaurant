const mongoose = require('mongoose')
const RestaurantSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minLength:[3, 'Minimum Title is 3 characters']
    },
    body: {
        type: String,
        required: [true, 'Description is required']
    },
    price: {
        type: String,
        required: [true, 'All prices are in USD']

    }
})

RestaurantSchema.set('toObject', {getters: true, virtuals: true})
exports.Menu = mongoose.model('menus', RestaurantSchema)



