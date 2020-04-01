import sequelize from './index';
import { INTEGER, STRING } from 'sequelize';

export default sequelize.define('todos', {
  id: { type: INTEGER, autoIncrement: true, primaryKey: true },
  title: STRING,
  description: STRING,
});
