const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const businessSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  creator: { type: String, required: true }
});

module.exports = mongoose.model("Business", businessSchema);