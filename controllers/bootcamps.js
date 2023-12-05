// @desc get all bootcamps
// @route get /api/v1/bootcamps
// @access public
exports.getBootcamps = (req, res) => {
  res.status(200).json({ success: true, msg: { text: `Show all bootcamps` } });
};

// @desc get one bootcamp
// @route get /api/v1/bootcamps/:id
// @access public
exports.getOneBootcamp = (req, res) => {
  res.status(200).json({
    success: true,
    msg: { text: `Show one bootcamp id of ${req.params.id} ` },
  });
};

// @desc post one bootcamp
// @route post /api/v1/bootcamps
// @access private
exports.postBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: { text: "Create new bootcamp" } });
};

// @desc put one bootcamp
// @route put /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: { text: `Change a bootcamp id of ${req.params.id}` },
  });
};

// @desc delete one bootcamp
// @route delete /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = (req, res) => {
  res.status(200).json({
    success: true,
    msg: { text: `Delete a bootcamp id of ${req.params.id}` },
  });
};
