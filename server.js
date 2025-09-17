const dotenv = require("dotenv");

// Catching uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥");
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});

dotenv.config({ path: "./.env" });
const app = require("./app");

// --- Basic environment validation: fail fast if critical secrets are missing
const requiredEnvs = ["SENDGRID_API_KEY", "FROM_EMAIL"];
const missing = requiredEnvs.filter((k) => !process.env[k]);
if (missing.length) {
  console.error("Missing required environment variables:", missing.join(", "));
  // Exit early to avoid running in a broken configuration
  process.exit(1);
}

// Create a server on 127.0.0.1:8000
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Server started ${port} 🖐`);
});

// Handling Promise rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
