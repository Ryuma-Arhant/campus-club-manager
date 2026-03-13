import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes will be added here
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
