import React from 'react';
import { IReaction } from './types';
import './styles.less';
export interface IReactionsSetterProps {
    value?: IReaction;
    onChange?: (value: IReaction) => void;
}
export declare const ReactionsSetter: React.FC<IReactionsSetterProps>;
