import { DataTypes } from "sequelize";

export function createModel(database) {
  database.define('Comment', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    }
  });
}
