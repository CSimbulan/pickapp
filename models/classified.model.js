const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const classifiedSchema = new Schema(
  {
    username: { type: String, required: true },
    userid: { type: String, required: true },
    sport: { type: String, required: true },
    description: { type: String, required: true },
    startdate: { type: Date, required: true },
    enddate: { type: Date, required: true },
    location: Schema.Types.Mixed,
  },
  { timestamps: true }
);

const Classified = mongoose.model("Classified", classifiedSchema);

module.exports = Classified;
