const mongoose = require("mongoose");
const { AutoIncrementID } = require("@typegoose/auto-increment");

const addressSchema = new mongoose.Schema(
  {
    city: String,
    street: String,
    building: String,
  },
  { _id: false }
);

const schema = new mongoose.Schema({
  _id: Number,
  fullName: String,
  age: Number,
  level: Array,
  address: { type: addressSchema },
});

schema.plugin(AutoIncrementID, {});
mongoose.model("childrens", schema);
