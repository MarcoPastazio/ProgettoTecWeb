import { DataTypes } from "sequelize";

export function createModel(database) {
  database.define('Vote', {
    type: {
      type: DataTypes.ENUM('like', 'dislike'),
      allowNull: false,
    }
  });
}
