import { EventDriver } from '@designable/shared';
import { Engine } from '../models/Engine';
export declare class ViewportScrollDriver extends EventDriver<Engine> {
    request: any;
    onScroll: (e: UIEvent) => void;
    attach(): void;
    detach(): void;
}
