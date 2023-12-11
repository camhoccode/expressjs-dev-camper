const mongoose = require("mongoose");
// const slugify = require("slugify");

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title"],
    maxlength: 100,
  },
  text: {
    type: String,
    trim: true,
    required: [true, "Please add some text"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Please add a rating between 1 and 10"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

// prevent user from summiting more than 10 reiviews from 1 bootcamp
// ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

//static method to get avg of review rating
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);
  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating,
    });
  } catch (error) {
    console.error(error);
  }
};
// get average rating after saved
ReviewSchema.post("save", async function () {
  this.constructor.getAverageRating(this.bootcamp);
});
// get average rating before removed
ReviewSchema.pre("remove", async function () {
  this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model("Review", ReviewSchema);
