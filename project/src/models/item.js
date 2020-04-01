import sequelize from './index';
import { INTEGER, STRING, BOOLEAN } from 'sequelize';

export default sequelize.define('items', {
  id: { type: INTEGER, autoIncrement: true, primaryKey: true },
  title: STRING,
  isCompleted: { type: BOOLEAN, defaultValue: false },
});
