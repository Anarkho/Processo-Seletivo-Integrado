const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const universitiesSchema = new Schema({
  alpha_two_code: String,
  web_pages: [],
  name: { type: String, index: true, unique: true },
  country: String,
  domains: String,
  state_province: String,
});

module.exports = mongoose.model('todas', universitiesSchema);
