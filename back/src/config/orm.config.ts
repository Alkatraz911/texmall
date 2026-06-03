
import { registerAs } from "@nestjs/config";
import { DataSourceOptions, DataSource } from 'typeorm';
import config from './config';
import * as path from 'path';


const ormConfig: DataSourceOptions = {
  type: 'postgres',
  host: config.POSTGRES_HOST,
  port: Number(config.POSTGRES_PORT),
  username: config.POSTGRES_USER,
  password: config.POSTGRES_PASSWORD,
  database: config.POSTGRES_DB,
  entities: [path.join(__dirname, '../models') + '/*.model.{js,ts}'],
  dropSchema: false,
  synchronize: false,
  migrations: [path.join(__dirname, '../migrations') + '/*.{js,ts}'],
};


export default registerAs('typeorm', () => ormConfig)
export const connectionSource = new DataSource(ormConfig as DataSourceOptions);