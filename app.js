const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const _ = require('lodash');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.set('view engine', 'ejs');

const APIkey = 'AIzaSyAmunb08OB1rWWw9tx0mBisdfuTDVmRCM0';
let VIDEOS = [];
let nextPageToken = '';

app.get('/', (req, res) => {
	// console.log(VIDEOS);
	res.render('index', { title: 'Test', videos: VIDEOS });
});

app.post('/', (req, res) => {
	VIDEOS = [];
	const word = req.body.search;
	console.log(`word: ${word}`);

	const url = `https://www.googleapis.com/youtube/v3/search?key=${APIkey}&q=${word}&part=snippet&maxResults=10`;

	const request = https.get(url, (response) => {
		const dataArray = [];
		response
			.on('data', (data) => {
				dataArray.push(data);
			})
			.on('end', () => {
				const buffer = Buffer.concat(dataArray);
				const obj = JSON.parse(buffer.toString());

				obj.items.forEach((element) => {
					const data = {
						videoDescription: element.snippet.description,
						videoId: element.id.videoId,
						videoTitle: element.snippet.title,
					};

					VIDEOS.push(data);
				});
				console.log(VIDEOS);
			});

		res.redirect('/');
	});
});

// API KEY: AIzaSyAmunb08OB1rWWw9tx0mBisdfuTDVmRCM0

// items[1].id.videoId;
app.listen(3000, () => {
	console.log('listening on port 3000');
});
