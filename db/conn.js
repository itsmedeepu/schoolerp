const mongoose = require("mongoose");

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database connected sucessfully");
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
