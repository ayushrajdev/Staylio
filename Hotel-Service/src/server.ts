import express from 'express';
import { loadEnv } from './config/index.config.ts';
import v1Router from './routers/v1/index.router.ts';
import v2Router from './routers/v2/index.router.ts';
import { genericErrorHandler } from './middlewares/error.middleware.ts';
import logger from './config/logger.config.ts';
import { attachCorrelationId } from './middlewares/correlation.middleware.ts';
import { connectDb } from './config/dbConnection.config.ts';
import Hotel from './db/models/hotel.ts';

const app = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: false }));
app.use(attachCorrelationId);

app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);

app.use(genericErrorHandler);

connectDb()
    .then((val) => {
        logger.info('successfully connected to the db ');
        app.listen(3000, async () => {
            loadEnv();
            logger.info('started the server');
        });
    })
    .catch((err) => {
        console.log(err);
    });
