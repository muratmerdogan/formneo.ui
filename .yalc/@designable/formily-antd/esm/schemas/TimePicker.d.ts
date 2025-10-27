import { ISchema } from '@formily/react';
export declare const CommonTimePickerAPI: {
    allowClear: {
        type: string;
        'x-decorator': string;
        'x-component': string;
        'x-component-props': {
            defaultChecked: boolean;
        };
    };
    autoFocus: {
        type: string;
        'x-decorator': string;
        'x-component': string;
    };
    bordered: {
        type: string;
        'x-decorator': string;
        'x-component': string;
        'x-component-props': {
            defaultChecked: boolean;
        };
    };
    clearText: {
        type: string;
        'x-decorator': string;
        'x-component': string;
    };
    disabledHours: {
        'x-decorator': string;
        'x-component': string;
        'x-component-props': {
            include: string[];
        };
    };
    disabledMinutes: {
        'x-decorator': string;
        'x-component': string;
        'x-component-props': {
            include: string[];
        };
    };
    disabledSeconds: {
        'x-decorator': string;
        'x-component': string;
        'x-component-props': {
            include: string[];
        };
    };
    hideDisabledOptions: {
        type: string;
        'x-decorator': string;
        'x-component': string;
    };
    inputReadOnly: {
        type: string;
        'x-decorator': string;
        'x-component': string;
    };
    showNow: {
        type: string;
        'x-decorator': string;
        'x-component': string;
    };
    use12Hours: {
        type: string;
        'x-decorator': string;
        'x-component': string;
    };
    hourStep: {
        type: string;
        'x-decorator': string;
        'x-component': string;
        'x-component-props': {
            defaultValue: number;
        };
    };
    minuteStep: {
        type: string;
        'x-decorator': string;
        'x-component': string;
        'x-component-props': {
            defaultValue: number;
        };
    };
    secondStep: {
        type: string;
        'x-decorator': string;
        'x-component': string;
        'x-component-props': {
            defaultValue: number;
        };
    };
    placeholder: {
        type: string;
        'x-decorator': string;
        'x-component': string;
    };
    size: {
        type: string;
        enum: string[];
        'x-decorator': string;
        'x-component': string;
    };
    format: {
        type: string;
        'x-decorator': string;
        'x-component': string;
        'x-component-props': {
            placeholder: string;
        };
    };
};
export declare const TimePicker: ISchema & {
    RangePicker?: ISchema;
};
