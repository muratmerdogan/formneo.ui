import { ICustomEvent } from '@designable/shared';
import { AbstractCursorEvent } from './AbstractCursorEvent';
export declare class DragStopEvent extends AbstractCursorEvent implements ICustomEvent {
    type: string;
}
