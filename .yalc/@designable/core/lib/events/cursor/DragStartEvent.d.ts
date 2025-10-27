import { ICustomEvent } from '@designable/shared';
import { AbstractCursorEvent } from './AbstractCursorEvent';
export declare class DragStartEvent extends AbstractCursorEvent implements ICustomEvent {
    type: string;
}
