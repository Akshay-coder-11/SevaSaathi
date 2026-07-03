const jwt = require("jsonwebtoken");

// Generates a signed JWT containing the user's id and role.
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// Sends the token as an httpOnly cookie AND in the JSON response body,
// so the frontend can use either strategy (cookie or Authorization header).
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id, user.role);

  const cookieExpireDays = Number(process.env.JWT_COOKIE_EXPIRE) || 7;

  const options = {
    expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profileImage: user.profileImage,
      servicesOffered: user.servicesOffered || [],
      providerDescription: user.providerDescription || "",
      providerExperience: user.providerExperience || "",
      providerCompany: user.providerCompany || "",
      addresses: user.addresses || [],
      isActive: user.isActive,
      createdAt: user.createdAt,
    },
  });
};

module.exports = { generateToken, sendTokenResponse };
