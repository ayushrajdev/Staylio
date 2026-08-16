import type { Model, ModelStatic, CreationAttributes } from 'sequelize';

export abstract class CrudRepository<T extends Model> {
    protected model: ModelStatic<T>;

    constructor(model: ModelStatic<T>) {
        this.model = model;
    }

    async create(data: CreationAttributes<T>): Promise<T> {
        return this.model.create(data);
    }

    async findAll(): Promise<T[]> {
        return this.model.findAll();
    }

    async findById(id: number): Promise<T> {
        const record = await this.model.findByPk(id);

        if (!record) {
            throw new Error('Record not found');
        }

        return record;
    }

    async update(id: number, data: Partial<CreationAttributes<T>>): Promise<T> {
        const record = await this.findById(id);

        await record.update(data);

        return record;
    }

    async delete(id: number): Promise<void> {
        const record = await this.findById(id);

        await record.destroy();
    }
}
