// common/controllers/crud.controller.ts

import type { Request, Response, NextFunction } from "express";

export class CrudController<
    Service extends {
        create: any;
        findAll: any;
        findById: any;
        update: any;
        delete: any;
    },
> {
    protected service: Service;

    constructor(service: Service) {
        this.service = service;
    }

    create = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const result = await this.service.create(req.body);

            res.status(201).json(result);
        } catch (e) {
            next(e);
        }
    };

    findAll = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const result = await this.service.findAll();

            res.json(result);
        } catch (e) {
            next(e);
        }
    };

    findById = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const result = await this.service.findById(
                Number(req.params.id),
            );

            res.json(result);
        } catch (e) {
            next(e);
        }
    };

    update = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const result = await this.service.update(
                Number(req.params.id),
                req.body,
            );

            res.json(result);
        } catch (e) {
            next(e);
        }
    };

    delete = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.delete(Number(req.params.id));

            res.status(204).send();
        } catch (e) {
            next(e);
        }
    };
}