const validate = (schema) => async (req, res, next) => {
  try {
    const parsedBody = await schema.parseAsync(req.body);
    req.body = parsedBody;
    next();
  } catch (error) {
    // Send validation errors to frontend
    return res.status(400).json({
      msg: error.errors.map((e) => e.message), // array of all Zod errors
    });
  }
};

module.exports = validate;

