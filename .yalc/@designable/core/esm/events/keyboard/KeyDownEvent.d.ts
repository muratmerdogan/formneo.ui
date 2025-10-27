import { ICustomEvent } from '@designable/shared';
import { AbstractKeyboardEvent } from './AbstractKeyboardEvent';
export declare class KeyDownEvent extends AbstractKeyboardEvent implements ICustomEvent {
    type: string;
}
