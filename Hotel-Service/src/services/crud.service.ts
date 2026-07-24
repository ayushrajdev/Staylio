// common/services/crud.service.ts

export class CrudService<
    Repository extends {
        create: any;
        findAll: any;
        findById: any;
        update: any;
        delete: any;
    },
> {
    protected repository: Repository;

    constructor(repository: Repository) {
        this.repository = repository;
    }

    create(data: any) {
        return this.repository.create(data);
    }

    findAll() {
        return this.repository.findAll();
    }

    findById(id: number) {
        return this.repository.findById(id);
    }

    update(id: number, data: any) {
        return this.repository.update(id, data);
    }

    delete(id: number) {
        return this.repository.delete(id);
    }
}
