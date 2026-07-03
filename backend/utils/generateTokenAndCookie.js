const jwt = require("jsonwebtoken");

const generateTokenAndCookie = (
  res,
  userId,
  rememberMe = false
) => {
  const token = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || "fallbacksecretkey",
    {
      expiresIn: rememberMe ? "30d" : "1d",
    }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: false, // Set to true in production if running HTTPS
    sameSite: "strict",
  };

  if (rememberMe) {
    cookieOptions.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
  }

  res.cookie("jwt", token, cookieOptions);

  return token;
};

module.exports = generateTokenAndCookie;