import { ICustomEvent } from '@designable/shared';
import { AbstractCursorEvent } from './AbstractCursorEvent';
export declare class DragMoveEvent extends AbstractCursorEvent implements ICustomEvent {
    type: string;
}
