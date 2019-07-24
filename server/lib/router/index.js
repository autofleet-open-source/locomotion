const { Router } = require('express');

const METHODS = [
  'all',
  'get',
  'post',
  'put',
  'delete',
  'patch',
  'options',
  'head',
];

const AfEntryPoint = func => async (req, res, next) => {
  try {
    await func(req, res, next);
  } catch (e) {
    console.log(e.message);
    if (e.statusCode && e.statusCode < 500) {
      return res.status(400).json({ error: e.message, status: 'ERROR' });
    }
    next(e);
  }
};

const AfRouter = (options) => {
  const myRouter = Router({ mergeParams: true, ...options });
  METHODS.map((method) => {
    const internalMethod = myRouter[method].bind(myRouter);
    myRouter[method] = (...args) => {
      internalMethod(...args.map((arg, index) => {
        if (index === 0) {
          return arg;
        }
        return AfEntryPoint(arg);
      }));
    };
    return true;
  });
  return myRouter;
};

module.exports = AfRouter;
