const yup = require("yup");
//const ObjectId = require('mongodb').ObjectId;

const validateSchema = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const loginCategorySchema = yup.object({
  body: yup.object({
    name: yup.string(),
    description: yup.string(),
  }),
});

module.exports = {
  validateSchema,
  loginCategorySchema,
};
