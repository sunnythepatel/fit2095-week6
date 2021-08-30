let express = require("express");
let morgan = require("morgan");
let ejs = require("ejs");
let mongodb = require("mongodb");

let app = express();
let MongoClient = mongodb.MongoClient;
const url = "mongodb://localhost:27017/";
let db;
MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
	if (err) {
		console.log("Err  ", err);
	} else {
		console.log("Connected successfully to server");
		db = client.db("week5db");
		// db.collection("student").insertMany([
		// 	{ name: "Alex", age: 25 },
		// 	{ name: "John", age: 34 },
		// 	{ name: "Max", age: 26 },
		// ]);
	}
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
	db.collection("student")
		.find({})
		.toArray(function (err, data) {
			res.render("showstudent.html", { studentDb: data });
		});
});

app.post("/data", (req, res) => {
	console.log(req.body);
	studentDB = {
		name: req.body.username,
		age: req.body.age,
	};
	db.collection("student").insertOne(studentDB, (err, data) => {
		if (err) throw err;
		console.log("1 document inserted", data);
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
	let filter = { name: userDetails.unameold };
	let theUpdate = {
		$set: {
			name: userDetails.unamenew,
			age: userDetails.uagenew,
		},
	};
	db.collection("student").updateOne(filter, theUpdate, (err, data) => {
		if (err) throw err;
		console.log(data);
		res.redirect("/show");
	});
});

//Update User:
//GET request: send the page to the client to enter the user's name
app.get("/delete", function (req, res) {
	res.render("deletestudent.html");
});
//POST request: receive the user's name and do the delete operation
app.post("/deleteuserdata", function (req, res) {
	let userDetails = req.body;
	let filter = { name: userDetails.uname };
	db.collection("student").deleteOne(filter, (err, data) => {
		if (err) throw err;
		console.log("document deleted", data);
		res.redirect("/show");
	});
});

app.get("*", (req, res) => {
	res.send("Error");
});

app.listen(8080, () => {
	console.log("Server is running at http://localhost:8080");
});
