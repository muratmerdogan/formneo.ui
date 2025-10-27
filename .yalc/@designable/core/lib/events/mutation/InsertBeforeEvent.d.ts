import { ICustomEvent } from '@designable/shared';
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';
export declare class InsertBeforeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
    type: string;
}
