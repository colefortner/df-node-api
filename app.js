const express = require("express");
const bodyParser = require("body-parser");

const businessesRoutes = require("./routes/businesses-routes");

const app = express();

app.use("/api/businesses", businessesRoutes);

app.listen(5050, () => {
  console.log("Serving on port 5050");
});
