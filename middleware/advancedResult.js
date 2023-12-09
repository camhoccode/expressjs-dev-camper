const advancedResult = (model, populate) => async (req, res, next) => {
  let query;
  const reqQuery = { ...req.query };
  // field to exclude
  const removeFields = ["select", "sort", "page", "perpage"];
  removeFields.forEach((field) => delete reqQuery[field]);

  // create query string
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  // find bootcamps base on query
  query = model.find(JSON.parse(queryStr));
  // select fields
  if (req.query.select) {
    const stringSelectionFields = req.query.select.split(",").join(" ");
    query = query.select(stringSelectionFields);
  }
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("createdAt");
  }

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const perpage = parseInt(req.query.perpage, 10) || 3;
  const startIndex = (page - 1) * perpage;
  const endIndex = page * perpage;
  const total = await model.countDocuments();
  // console.log(startIndex);
  query = query.skip(startIndex).limit(perpage);

  if (populate) {
    query = query.populate(populate);
  }

  const results = await query;

  // pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      perpage,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      perpage,
    };
  }
  res.advancedResult = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };
  next();
};

module.exports = advancedResult;
