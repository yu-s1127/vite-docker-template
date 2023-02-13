import { DataSource } from 'typeorm';

const source = new DataSource({  
  type: 'mysql',
  host: 'react-authentication_db_1',
  username: 'user',
  password: 'password',
  database: 'test_db',
  entities: ['src/entity/*.ts'],
  logging: false,
  synchronize: true,
});

export default source;
