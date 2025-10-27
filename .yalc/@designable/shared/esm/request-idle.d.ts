import 'requestidlecallback';
export interface IIdleDeadline {
    didTimeout: boolean;
    timeRemaining: () => DOMHighResTimeStamp;
}
export interface IdleCallbackOptions {
    timeout?: number;
}
export declare const requestIdle: (callback: (params: IIdleDeadline) => void, options?: IdleCallbackOptions) => number;
export declare const cancelIdle: (id: number) => void;
