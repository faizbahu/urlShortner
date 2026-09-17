import Joi from "joi";

const urlSchema = Joi.object({
  originalUrl: Joi.string()
    .uri()
    .required()
    .messages({
      "string.empty": "URL is required",
      "string.uri": "Please provide a valid URL",
      "any.required": "URL is required",
    }),
});

const validateUrl = (req, res, next) => {
  const { error } = urlSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  next();
};

export default validateUrl;