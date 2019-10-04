var mongoose = require('mongoose');

// Setup schema
var landSchema = mongoose.Schema({
    title: String,
    size: Number,
    price: Number,
    description: String,
    bidEndDate: String,
    bidStatus: { type: String, default: 'active' },
    landImage: { type: String },
    create_date: {
        type: Date,
        default: Date.now
    }
});

// Export Land model
var Land = module.exports = mongoose.model('Land', landSchema);

module.exports.get = function(callback, limit) {
    Land.find(callback).limit(limit);
}