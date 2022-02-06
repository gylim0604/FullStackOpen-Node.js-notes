/* eslint-disable no-undef */
const mongoose = require('mongoose');

// eslint-disable-next-line no-undef
if (process.argv.length < 3) {
	console.log(
		'Please provide the password as an argument: node mongo.js <password>'
	);
	process.exit(1);
}

const password = process.argv[2];
console.log(password);

const url = `mongodb+srv://gylim:${password}@cluster0.a9wnk.mongodb.net/note-app?retryWrites=true&w=majority`;

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
	content: String,
	date: Date,
	important: Boolean,
});

const Note = mongoose.model('Note', noteSchema);

Note.find({}).then((result) => {
	result.forEach((note) => {
		console.log(note);
	});
	mongoose.connection.close();
});
