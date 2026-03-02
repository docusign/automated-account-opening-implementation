import './preStart'; // Must be the first import

import server from './server';

const SERVER_START_MSG = 'Express server started on port: ' + process.env.PORT!.toString();

server.listen(process.env.PORT, () => console.info(SERVER_START_MSG));
