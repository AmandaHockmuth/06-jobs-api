const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors/index");

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("No Token Provided.");
  }

  const token = authHeader.split(" ")[1];
  // console.log(`Authorization : ${token}`);

  try {
    // @ts-ignore
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, name: payload.name };
    //console.log(req.user);
    next();
  } catch (error) {
    throw new UnauthenticatedError("Not Authorized to Access this Route.");
  }
};

module.exports = authenticationMiddleware;
