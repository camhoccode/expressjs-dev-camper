const mongoose = require("mongoose");
const slugify = require("slugify");

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please add a title"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Please add a description"],
    },
    weeks: {
      type: String,
      trim: true,
      required: [true, "Please add number of week"],
    },
    tuition: {
      type: Number,
      required: [true, "Please add course cost"],
    },
    mininumSkills: {
      type: [String],
      required: [true, "Please add mininum skills"],
      enums: ["Beginner", "Intermetidate", "Advanced"],
    },
    scholershipAvailable: {
      type: Boolean,
      default: false,
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
  }
  // { collection: "courses" }
);

// get average cost after saved
CourseSchema.post("save", async (err) => {});
// get average cost before removed
CourseSchema.pre("remove", async (err) => {});

module.exports = mongoose.model("Course", CourseSchema);
