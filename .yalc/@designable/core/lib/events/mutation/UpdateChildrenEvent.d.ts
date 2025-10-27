import { ICustomEvent } from '@designable/shared';
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';
export declare class UpdateChildrenEvent extends AbstractMutationNodeEvent implements ICustomEvent {
    type: string;
}
