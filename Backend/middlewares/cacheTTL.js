// export const cacheTTL = (ttlSeconds) => {
//   return (req, res, next) => {
//     res.set("Cache-Control", `public, max-age=${ttlSeconds}`);
//     next();
//   };
// };
export const cacheTTL = (keyFn, ttlSeconds) => {
  return (req, res, next) => {
    const key = keyFn(req);
    res.set("Cache-Control", `public, max-age=${ttlSeconds}`);
    res.set("X-Cache-Key", key);
    next();
  };
};
