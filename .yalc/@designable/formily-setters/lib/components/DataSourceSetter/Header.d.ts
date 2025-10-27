import React, { ReactNode } from 'react';
import './styles.less';
export interface IHeaderProps {
    extra: ReactNode | null;
    title: ReactNode | string;
}
export declare const Header: React.FC<IHeaderProps>;
