import { ICustomEvent } from '@designable/shared';
import { AbstractViewportEvent } from './AbstractViewportEvent';
export declare class ViewportScrollEvent extends AbstractViewportEvent implements ICustomEvent {
    type: string;
}
