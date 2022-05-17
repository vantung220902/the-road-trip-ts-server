require('dotenv').config();
const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || '';

const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@the-road-trip.jspk5.mongodb.net/${MONGO_DB_NAME}`;

const SERVER_PORT = process.env.PORT || 4000;

const config = {
    mongo: {
        url: MONGO_URL
    },
    server: {
        port: SERVER_PORT
    }
};
export default config;
