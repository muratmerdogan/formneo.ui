export interface ISubscriber<Payload = any> {
    (payload: Payload): void | boolean;
}
export declare class Subscribable<ExtendsType = any> {
    private subscribers;
    dispatch<T extends ExtendsType = any>(event: T, context?: any): boolean;
    subscribe(subscriber: ISubscriber): () => void;
    unsubscribe: (id?: number | string | (() => void)) => void;
}
