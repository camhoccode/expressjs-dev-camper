const mongoose = require("mongoose");
const slugify = require("slugify");
// const geocoder = require("../utils/geocoder");
const { default: axios } = require("axios");
const Course = require("./Course");

const BootcampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [500, "Description can not be more than 500 characters"],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please use a valid url with HTTP or HTTPS",
      ],
    },
    email: {
      type: String,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please add a valid email",
      ],
    },
    phone: {
      type: String,
      maxlength: [20, "Phone number can not be more than 20 characters"],
    },
    address: {
      type: String,
      maxlength: [200, "Address can not be more than 200 characters"],
      required: [true, "Please add a address"],
    },
    location: {
      // geo json mongoose
      type: {
        type: String,
        enum: ["Point"], // 'location.type' must be 'Point'
        //   required: true,
      },
      coordinates: {
        type: [Number],
        //   required: true,
        index: "2dsphere",
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      type: [String],
      required: true,
      enum: [
        "Web Development",
        "Mobile Development",
        "UI/UX",
        "Data Science",
        "Business",
        "Other",
      ],
    },
    averageRating: {
      type: String,
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating must be less than 10"],
    },
    averageCost: Number,
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    // collection: "bootcamps",
  }
);

BootcampSchema.pre("save", async function (next) {
  // create bootcamp slug from name
  this.slug = slugify(this.name, { lower: true });
  // geo coder and create location field
  const encodedAddress = encodeURIComponent(this.address);
  try {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodedAddress}&key=${process.env.GEOCODER_API_KEY}`
    );
    // console.log("response", response.data.results[0].annotations);
    const loc = response.data.results[0];

    this.location = {
      type: "Point",
      coordinates: [loc.geometry.lng, loc.geometry.lat],
      formattedAddress: loc.formatted,
      streetName: loc.components.road,
      streetNumber: loc.components.house_number,
      state: loc.components.state,
      zipCode: loc.components.postcode,
      city: loc.components.town,
      countryCode: loc.components.country_code,
      country: loc.components.country,
    };
  } catch (error) {
    console.log(error);
  }
  // do not save address in db
  this.address = undefined;
  next();
});

// cascade delete courses when bootcamp deleted
BootcampSchema.pre("deleteOne", async function (next) {
  try {
    console.log(`Courses being removed from bootcamp ${this._id} checking`);
    await this.model("Course").deleteMany({
      bootcamp: this._id,
    });
    next();
  } catch (error) {
    console.log(error);
  }
});

// reverse populate with virtuals
BootcampSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "bootcamp",
  justOne: false,
});

module.exports = mongoose.model("Bootcamp", BootcampSchema);
