require("dotenv").config();

let express = require("express");
var bodyParser = require("body-parser");
let app = express();

const cors = require("cors");
app.use(cors());

let mongoose = require("mongoose");
const { response } = require("express");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function start_prg() {
  app.listen(process.env.PORT, () => {
    console.log("Listening on port 4000...");
  });

  app.get("/", function (req, res) {
    res.sendFile(__dirname + "/FrontEnd/index.html");
  });

  //To use everything under /FrontEnd
  app.use(express.static(__dirname + "/FrontEnd"));
}

//Some random error
mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    start_prg();
  })
  .catch(() => {
    console.log("The error is = " + error);
  });

const Schema = mongoose.Schema;
const LoginSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    memoryList: [
      {
        memories: {
          date: { type: String, default: "1" },
          time: { type: String, default: "", trim: true },
          privacy: { type: String, default: "", trim: true },
          heading: { type: String, default: "", trim: true },
          description: { type: String, default: "", trim: true },
        },
      },
    ],
  },
  { timestamps: true }
);

let login = mongoose.model("login", LoginSchema);

try {
  app.post("/login", function (req, res) {
    login.findOne({ username: req.body.username }, function (err, data) {
      if (err) return console.log("The error is " + err);
      if (data == null) {
        res.send({ Auth: "Decline" });
        console.log("Username not found");
      } else if (data.password != req.body.password) {
        console.log("Password wrong");
        res.send({ Auth: "Decline password" });
      } else {
        res.send({
          Auth: "Success",
          username: req.body.username,
          password: req.body.password,
        });
        console.log(data);
      }
    });
  });
} catch (err) {
  console.log("Error!");
}

app.post("/signup", function (req, res) {
  console.log(req.body);

  var ele = new login({
    username: req.body.username,
    password: req.body.password,
  });

  ele.save(function (err, data) {
    //    if (err) return console.error(err);
    if (err) {
      if (err.code == 11000) {
        console.log("Duplication error \n" + err);
        return res.status(400).send({ status: "duplicate-error" });
      }
      console.log(err);
      return res.send({ status: "Unknown-error" });
    }

    res.send({ signup: "Successful" });
    console.log("data is " + data);
  });
});

// Maybe not required
const SubmitSchema = new Schema({
  memoryList: {
    memories: [
      {
        date: { type: String, default: "1" },
        time: { type: String, default: "", trim: true },
        privacy: { type: String, default: "", trim: true },
        heading: { type: String, default: "", trim: true },
        description: { type: String, default: "", trim: true },
      },
    ],
  },
});

app.post("/save", async function (req, res) {
  //var ele1 =
  var ele = await {
    time: req.body.time,
    date: req.body.date,
    username: req.body.username,
    privacy: req.body.privacy,
    heading: req.body.heading,
    body: req.body.body,
  };

  //let login = mongoose.model("login", SubmitSchema);
  login.findOneAndUpdate(
    { username: ele.username },
    {
      $push: {
        memoryList: [
          {
            memories: {
              date: ele.date,
              time: ele.time,
              privacy: ele.privacy,
              heading: ele.heading,
              description: ele.body,
            },
          },
        ],
      },
    },
    { new: true },

    (err, updatedDoc) => {
      if (err) return console.log(err);
      if (updatedDoc != null) {
        console.log("Record Updated");
        res.send(updatedDoc);
      }
    }
  );
});

app.post("/fetchmem", async function (req, res) {
  var val = await req.body.username;

  console.log("Username is " + val);

  login.findOne({ username: val }, function (err, data) {
    if (err) return console.log(err);
    if (data == null) {
      res.sendStatus(404);
    } else {
      res.status(200).send(data.memoryList);
    }

    //console.log(data.memoryList);
  });
});
