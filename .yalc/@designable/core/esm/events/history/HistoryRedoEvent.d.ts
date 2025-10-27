import { ICustomEvent } from '@designable/shared';
import { AbstractHistoryEvent } from './AbstractHistoryEvent';
export declare class HistoryUndoEvent extends AbstractHistoryEvent implements ICustomEvent {
    type: string;
}
