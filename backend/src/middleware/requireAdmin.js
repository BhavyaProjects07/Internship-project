const { getAuth, clerkClient } = require("@clerk/express");

const requireAdmin = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await clerkClient.users.getUser(userId);

    if (user.publicMetadata?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    req.adminUserId = userId;
    return next();
  } catch (error) {
    console.error("Admin authorization error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify admin permissions",
    });
  }
};

module.exports = requireAdmin;