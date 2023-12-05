const Bootcamp = require(".././models/Bootcamps");

// @desc get all bootcamps
// @route get /api/v1/bootcamps
// @access public
exports.getBootcamps = async (req, res) => {
  try {
    const bootcamp = await Bootcamp.find();
    res.status(200).json({
      success: true,
      data: bootcamp,
      count: bootcamp.length,
      msg: { text: `Show all bootcamps` },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error,
    });
  }
};

// @desc get one bootcamp
// @route get /api/v1/bootcamps/:id
// @access public
exports.getOneBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      throw error;
    }
    res.status(200).json({
      success: true,
      data: bootcamp,
      msg: { text: `Show one bootcamp id of ${req.params.id}` },
    });
  } catch (error) {
    // res.status(400).json({
    //   success: false,
    //   error: error,
    // });
    next(error);
  }
};

// @desc post one bootcamp
// @route post /api/v1/bootcamps
// @access private
exports.postBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp,
      msg: { text: "Create new bootcamp" },
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      error: e,
    });
  }
};

// @desc put one bootcamp
// @route put /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bootcamp) {
      throw error;
    }
    res.status(200).json({
      success: true,
      data: bootcamp,
      msg: { text: `Change a bootcamp id of ${req.params.id}` },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error,
    });
  }
};

// @desc delete one bootcamp
// @route delete /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = async (req, res) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      throw error;
    }
    res.status(200).json({
      success: true,
      data: bootcamp,
      msg: { text: `Delete a bootcamp id of ${req.params.id}` },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error,
    });
  }
};
