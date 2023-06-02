const mongoose = require("mongoose");

const { AutoIncrementID } = require("@typegoose/auto-increment");
const schema = new mongoose.Schema({
  _id: Number,
  name: String,
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teachers",
  },
  children: [
    {
      type: Number,
      ref: "childrens",
    },
  ],
});

schema.plugin(AutoIncrementID, {});
mongoose.model("classes", schema);
