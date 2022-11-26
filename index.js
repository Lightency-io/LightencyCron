const express = require("express");
const http = require("http");
const cors = require("cors");
const autoFund = require("./utils/fundEnergyCron");
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: false, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

app.use(cors(corsOptions));

//Init middleware (Body Parser , now it s included with express )
app.use(express.json({ extended: false }));

app.get("/", async (req, res) => {
  console.log("API is running");
  res.json({ result: "API is running" });
});

app.use("/api/fundEnergy", require("./routes/api/fundEnergy"));
app.use("/api/addCouncil", require("./routes/api/addCouncil"));
//app.use("/api/borrowFromBurrow", require("./routes/api/borrowFromBurrow"));

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = server;
