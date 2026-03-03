import './preStart'; // Must be the first import

import server from './server';
import {t} from './i18n';

const SERVER_START_MSG = t("SERVER_START") + process.env.PORT!.toString();

server.listen(process.env.PORT, () => console.info(SERVER_START_MSG));
