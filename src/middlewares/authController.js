const { decodeToken } = require("../lib/tokenFunctions");

const requireAuth = (role) => {
  return (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      res.redirect("/login");
    }
    let userRole = decodeToken(token, "role");

    if (userRole === role || role === undefined) {
      let classId = decodeToken(token, "class_id");
      let userId = decodeToken(token, "id");
      res.locals.classId = classId;
      res.locals.userId = userId;
      res.locals.role = userRole;
      next();
    } else {
      res.redirect("/login");
    }
  };
};

module.exports = { requireAuth };
