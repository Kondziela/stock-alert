import * as express from 'express';
import {Main} from './main';

const app = express();
const port = process.env.PORT || 3000;

// Create dummy application for heroku
app.get('/', (req, res) => res.send('I\'m alive!'));

// trigger metrics process
app.get('/process_metrics', (req, res) => {
	new Main().startProcessing();
	return res.send('Metrics process triggered')
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// trigger metrics action to check if everything is working correctly
new Main().startProcessing();
