import mongoose from "mongoose";

const Schema = mongoose.Schema;

const universitiesSchema = new Schema({
  alpha_two_code: String,
  web_pages: [],
  name: { type: String, index: true, unique: true },
  country: String,
  domains: String,
  state_province: String,
});

const University = mongoose.model('todas', universitiesSchema);

export default University
