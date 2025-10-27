import { ICustomEvent } from '@designable/shared';
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';
export declare class HoverNodeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
    type: string;
}
