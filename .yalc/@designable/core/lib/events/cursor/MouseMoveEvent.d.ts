import { ICustomEvent } from '@designable/shared';
import { AbstractCursorEvent } from './AbstractCursorEvent';
export declare class MouseMoveEvent extends AbstractCursorEvent implements ICustomEvent {
    type: string;
}
