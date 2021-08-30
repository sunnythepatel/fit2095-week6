const mongoose = require("mongoose");
let studentSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: {
		type: String,
		required: true,
	},
	age: {
		type: Number,
		validate: {
			validator: function (ageValue) {
				return ageValue >= 10 && ageValue <= 110;
			},
			message: "Age should be a number between 10 and 110",
		},
	},
	//   age     : { type: Number, min: 5, max: 20 },
	created: {
		type: Date,
		default: Date.now,
	},
});
module.exports = mongoose.model("Student", studentSchema);
