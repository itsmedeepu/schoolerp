const express = require("express");
const app = express();
const port = 3000;

// Database connection
require("./db/conn");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const classRoutes = require("./routes/ClassesRoutes");
const teacherRoutes = require("./routes/TeacherRoutes");
app.use("/api/v1/school/class", classRoutes);
app.use("/api/v1/school/teacher", teacherRoutes);

// Test route
app.get("/test", (req, res) => {
  res.status(200).json({ message: "Server running healthy" });
});

// Error-handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

// Start server
app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
