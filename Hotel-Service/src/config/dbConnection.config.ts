import sequelize from "./sequelize.config.ts";


export async function connectDb() {
    return await sequelize.authenticate()
}