require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const Note = require('./models/note');

app.use(cors());
app.use(express.json());
app.use(express.static('build'));

const errorHandler = (error, request, response, next) => {
	console.log(error.message);
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' });
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message });
	}
	next(error);
};

app.use(errorHandler);

let notes = [
	{
		id: 1,
		content: 'HTML is easy',
		date: '2019-05-30T17:30:31.098Z',
		important: true,
	},
	{
		id: 2,
		content: 'Browser can execute only Javascript',
		date: '2019-05-30T18:39:34.091Z',
		important: false,
	},
	{
		id: 3,
		content: 'GET and POST are the most important methods of HTTP protocol',
		date: '2019-05-30T19:20:14.298Z',
		important: true,
	},
];

app.get('/', (request, response) => {
	response.send('<h1>Hello World! </h1>');
});

app.get('/api/notes', (request, response) => {
	Note.find({}).then((notes) => {
		response.json(notes);
	});
});

app.get('/api/notes/:id', (request, response, next) => {
	Note.findById(request.params.id)
		.then((note) => {
			if (note) {
				response.json(note);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
});

app.delete('/api/notes/:id', (request, response, next) => {
	Note.findByIdAndRemove(request.params.id)
		.then(() => {
			response.status(204).end();
		})
		.catch((error) => next(error));
});

const generateId = () => {
	const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
	return maxId + 1;
};

app.post('/api/notes', (request, response, next) => {
	const body = request.body;
	const note = new Note({
		content: body.content,
		important: body.important || false,
		date: new Date(),
		id: generateId(),
	});
	note.save()
		.then((savedNote) => {
			response.json(savedNote.toJSON());
		})
		.catch((error) => next(error));
});

app.put('/api/notes/:id', (request, response, next) => {
	const body = request.body;
	const note = {
		content: body.content,
		important: body.important,
	};
	Note.findByIdAndUpdate(request.params.id, note, { new: true })
		.then((updatedNote) => {
			response.json(updatedNote);
		})
		.catch((error) => next(error));
});

// eslint-disable-next-line no-undef
const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port${PORT}`);
