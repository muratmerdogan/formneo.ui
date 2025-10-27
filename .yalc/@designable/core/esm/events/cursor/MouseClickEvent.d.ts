import { ICustomEvent } from '@designable/shared';
import { AbstractCursorEvent } from './AbstractCursorEvent';
export declare class MouseClickEvent extends AbstractCursorEvent implements ICustomEvent {
    type: string;
}
export declare class MouseDoubleClickEvent extends AbstractCursorEvent implements ICustomEvent {
    type: string;
}
