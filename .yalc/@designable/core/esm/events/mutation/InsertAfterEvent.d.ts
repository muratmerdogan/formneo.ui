import { ICustomEvent } from '@designable/shared';
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';
export declare class InsertAfterEvent extends AbstractMutationNodeEvent implements ICustomEvent {
    type: string;
}
