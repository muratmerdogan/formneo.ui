import { ICustomEvent } from '@designable/shared';
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';
export declare class AppendNodeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
    type: string;
}
