const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
const dbConnection = () => {
    mongoose
      .connect(process.env.DB_URI)
      .then((con) => {
        console.log(`Database connected succesfully: ${con.connection.host}`);
      })
}

module.exports = dbConnection;