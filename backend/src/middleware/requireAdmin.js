const { getAuth, clerkClient } = require("@clerk/express");

const ADMIN_EMAILS = ["laptopuse01824x@gmail.com"];

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

    const userEmails = (user.emailAddresses || []).map((e) =>
      (e.emailAddress || "").toLowerCase().trim()
    );

    const isAdmin =
      user.publicMetadata?.role === "admin" ||
      userEmails.some((email) => ADMIN_EMAILS.includes(email));

    if (!isAdmin) {
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
