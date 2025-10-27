import { ICustomEvent } from '@designable/shared';
import { AbstractViewportEvent } from './AbstractViewportEvent';
export declare class ViewportResizeEvent extends AbstractViewportEvent implements ICustomEvent {
    type: string;
}
