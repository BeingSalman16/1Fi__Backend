export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    params: req.params ?? {},
    query: req.query ?? {},
    body: req.body ?? {}
  });

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Request validation failed",
      errors: result.error.flatten()
    });
  }

  req.validated = result.data;
  next();
};
