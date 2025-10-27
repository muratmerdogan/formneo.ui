import { ICustomEvent } from '@designable/shared';
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';
export declare class WrapNodeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
    type: string;
}
