const express = require("express");
const cors = require("cors");
const { clerkMiddleware } = require("@clerk/express");
require("dotenv").config();

const templateRoutes = require("./routes/template.route");
const websiteRoutes = require("./routes/website.route");
const mediaRoutes = require("./routes/media.route");
const categoryRoutes = require("./routes/category.route");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();

// ----------------------------------------------------
// CORS Configuration
// ----------------------------------------------------
const allowedOrigins = [
  "https://internship-project-sage.vercel.app",
  "http://localhost:3000",
  "http://localhost:5000",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    // Allow known origins or any Vercel preview deployment
    if (
      allowedOrigins.includes(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin)
    ) {
      return callback(null, true);
    }

    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
// Express 5.x uses RegExp pattern for wildcard preflight options route
app.options(/.*/, cors(corsOptions));

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check API health
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API is running
 */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Website Builder API is running",
  });
});

// IMPORTANT: Clerk middleware runs before authenticated API routes.
app.use(clerkMiddleware());

app.use("/api/websites", websiteRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/categories", categoryRoutes);

// Global error handler guaranteeing CORS headers even on uncaught errors
app.use((err, req, res, next) => {
  console.error("[ServerError]", err);
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

if (require.main === module || (!process.env.VERCEL && process.env.NODE_ENV !== "test")) {
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

module.exports = app;
