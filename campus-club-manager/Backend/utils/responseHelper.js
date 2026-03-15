export const success = (res, data = null, message = 'Success', code = 200) => {
  return res.status(code).json({ success: true, message, data });
};

export const error = (res, message = 'Error', code = 500) => {
  return res.status(code).json({ success: false, message });
};
