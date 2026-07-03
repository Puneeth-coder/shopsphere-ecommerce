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

  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction, // Must be true on HTTPS (Render) for SameSite: none
    sameSite: isProduction ? "none" : "lax", // Required for cross-domain cookies (Vercel -> Render)
  };

  if (rememberMe) {
    cookieOptions.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
  }

  res.cookie("jwt", token, cookieOptions);

  return token;
};

module.exports = generateTokenAndCookie;