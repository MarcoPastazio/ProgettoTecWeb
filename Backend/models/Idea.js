import { DataTypes } from "sequelize";

export function createModel(database) {
  database.define('Idea', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 400]
      }
    },
    nlike: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    ndislike: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    ncomment: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  });
}
