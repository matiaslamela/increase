const server = require('./src/app.js');
const {	conn } = require('./src/models/index.js');
const { init } = require('./src/controllers/initFetch')

// Syncing all the models at once.
conn.sync({force: true}).then(async () => {
	server.listen(3001, () => {
    init();
		console.log('listening at 3001'); // eslint-disable-line no-console
	});
});
