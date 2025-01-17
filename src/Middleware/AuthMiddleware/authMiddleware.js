const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyAccessToken = (req, res, next) => {
  // Get token from request header
  // const token = req.headers["authorization"]?.split(" ")[1];
  const refreshTokenFromCookie = req.cookies.access_token;

  // If no token is found, return 401 unauthorized
  if (!refreshTokenFromCookie) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Verify the token using jsonwebtoken library
  jwt.verify(refreshTokenFromCookie, process.env.JWT_ACCESS_SECRET, (error, decoded) => {
    if (error) {
      console.log(error);
      return res.status(403).json({ message: "Invalid token" });
    }
    // Attach the decoded user data (or whatever you encoded in the token) to the request object
    req.user = decoded;

    // Call the next middleware/route handler
    next();
  });
};

module.exports = {
  verifyAccessToken,
};
