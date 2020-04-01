import sequelize from './index';
import { INTEGER, STRING } from 'sequelize';

export default sequelize.define('users', {
  id: { type: INTEGER, autoIncrement: true, primaryKey: true },
  email: STRING,
  name: STRING,
});
