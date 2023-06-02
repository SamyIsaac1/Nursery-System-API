const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.authenticated = (request, response, next) => {
  try {
    let token;
    // 1. the user provide a jwt token
    if (request.get("authorization"))
      token = request.get("authorization").split(" ")[1];
    else throw new Error("Access Denied..");

    // 2. verify the token with the secret key
    let decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
    request.decodedPayload = decodedPayload;

    // the user is authenticated
    next();
  } catch (error) {
    next(error);
  }
};

module.exports.isAdmin = (request, repsone, next) => {
  // 3. check if that user is admin or not
  // the user is authorized
  if (request.decodedPayload.isAdmin) next();
  else {
    let error = new Error("not Authorized");
    error.status = 403;
    next(error);
  }
};
