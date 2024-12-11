import dotenv from 'dotenv';

dotenv.config();

const config = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    pass: process.env.DB_PASS || 'postgres',
    name: process.env.DB_NAME || 'dsp',
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '5'),
  },
};

export default config;
