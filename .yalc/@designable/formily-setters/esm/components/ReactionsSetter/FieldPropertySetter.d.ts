import React from 'react';
export interface IFieldProperty {
    [key: string]: string;
}
export interface IFieldPropertySetterProps {
    extraLib?: string;
    value?: IFieldProperty;
    onChange?: (value: IFieldProperty) => void;
}
export declare const FieldPropertySetter: React.FC<IFieldPropertySetterProps>;
