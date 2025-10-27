import { Engine } from '@designable/core';
export interface IEffects {
    (engine: Engine): void;
}
export declare const useDesigner: (effects?: IEffects) => Engine;
