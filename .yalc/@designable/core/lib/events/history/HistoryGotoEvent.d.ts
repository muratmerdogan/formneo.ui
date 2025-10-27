import { ICustomEvent } from '@designable/shared';
import { AbstractHistoryEvent } from './AbstractHistoryEvent';
export declare class HistoryGotoEvent extends AbstractHistoryEvent implements ICustomEvent {
    type: string;
}
