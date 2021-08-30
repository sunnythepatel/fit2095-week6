let express = require("express");
let morgan = require("morgan");
let ejs = require("ejs");
let mongoose = require("mongoose");
let app = express();
const Student = require("./models/student");
const url = "mongodb://localhost:27017/week6db";
mongoose.connect(url, { useNewUrlParser: true }, function (err) {
	if (err) {
		console.log("Error in Mongoose connection");
		throw err;
	}
	console.log("Successfully connected");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("html", ejs.renderFile);
app.set("view engine", "html");

app.use(morgan("tiny"));
app.use(express.static("css"));
app.use(express.static("images"));

app.get("/", (req, res) => {
	res.render("index.html");
});

app.get("/add", (req, res) => {
	res.render("addstudent.html");
});

app.get("/show", (req, res) => {
	Student.find({}, function (err, data) {
		res.render("showstudent.html", { studentDb: data });
	});
});

app.post("/data", (req, res) => {
	console.log(req.body);
	let student1 = new Student({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.username,
		age: req.body.age,
	});
	student1.save((err, data) => {
		if (err) throw err;
		console.log("Student successfully Added to DB", data);
		res.redirect("/show");
	});
});

//Update user:
//GET request: send the page to the client
app.get("/update", function (req, res) {
	res.render("updatestudent.html");
});
//POST request: receive the details from the client and do the update
app.post("/updateuserdata", function (req, res) {
	let userDetails = req.body;
	Student.updateOne(
		{ name: userDetails.unameold },
		{ $set: { name: userDetails.unamenew, age: userDetails.uagenew } },
		function (err, doc) {
			if (err) throw err;
			console.log(doc);
			res.redirect("/show");
		}
	);
});

//Update User:
//GET request: send the page to the client to enter the user's name
app.get("/delete", function (req, res) {
	res.render("deletestudent.html");
});
//POST request: receive the user's name and do the delete operation
app.post("/deleteuserdata", function (req, res) {
	let userDetails = req.body;
	Student.deleteOne({ name: userDetails.uname }, function (err, doc) {
		if (err) throw err;
		console.log("document deleted", doc);
		res.redirect("/show");
	});
});

app.get("*", (req, res) => {
	res.send("Error");
});

app.listen(8080, () => {
	console.log("Server is running at http://localhost:8080");
});
