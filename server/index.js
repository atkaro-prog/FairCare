import {createApp} from './app.js';
createApp().listen(Number(process.env.PORT||3001),'0.0.0.0');
