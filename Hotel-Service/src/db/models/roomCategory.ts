// Runtime imports
import { Model, DataTypes } from 'sequelize';

// Type-only imports
import {
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize';

import sequelize from '../../config/sequelize.config.ts';
import Hotel from './hotel.ts';

const RoomType = {
  SINGLE: 'SINGLE',
  DOUBLE: 'DOUBLE',
  FAMILY: 'FAMILY',
  DELUXE: 'DELUXE',
  SUITE: 'SUITE',
} as const;

type RoomType = (typeof RoomType)[keyof typeof RoomType];

class RoomCategory extends Model<
  InferAttributes<RoomCategory>,
  InferCreationAttributes<RoomCategory>
> {
  declare id: CreationOptional<number>;
  declare hotelId: number;
  declare price: number;
  declare roomType: RoomType;
  declare roomCount: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date> | null;
}

RoomCategory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    hotelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Hotel,
        key: 'id',
      },
    },

    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    roomType: {
      type: DataTypes.ENUM(...Object.values(RoomType)),
      allowNull: false,
    },

    roomCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    createdAt: {
      type: DataTypes.DATE,
    },

    updatedAt: {
      type: DataTypes.DATE,
    },

    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: 'room_categories',
    sequelize,
    underscored: true,
    timestamps: true,
    paranoid: true,
  }
);

export default RoomCategory;