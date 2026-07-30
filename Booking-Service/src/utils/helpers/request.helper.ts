import { AsyncLocalStorage } from 'node:async_hooks';

type AsyncLocalStorageType = {
    correlationId: string;
};

export const asyncLocalStorage = new AsyncLocalStorage<AsyncLocalStorageType>();


export function getCorrelationId() {
    const asyncStore = asyncLocalStorage.getStore()
    return asyncStore?.correlationId || "unknown-error-while-creating-correlation-id"

}