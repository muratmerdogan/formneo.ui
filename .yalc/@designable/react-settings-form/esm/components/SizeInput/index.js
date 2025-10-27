import { InputNumber } from 'antd';
import { createPolyInput } from '../PolyInput';
var takeNumber = function (value) {
    var num = String(value)
        .trim()
        .replace(/[^\d\.]+/, '');
    if (num === '')
        return;
    return Number(num);
};
var createUnitType = function (type) {
    return {
        type: type,
        component: InputNumber,
        checker: function (value) {
            return String(value).includes(type);
        },
        toInputValue: function (value) {
            return takeNumber(value);
        },
        toChangeValue: function (value) {
            return "".concat(value || 0).concat(type);
        },
    };
};
var createSpecialSizeOption = function (type) { return ({
    type: type,
    checker: function (value) {
        if (value === type)
            return true;
        return false;
    },
    toChangeValue: function () {
        return type;
    },
}); };
var NormalSizeOptions = [
    createSpecialSizeOption('inherit'),
    createSpecialSizeOption('auto'),
    createUnitType('px'),
    createUnitType('%'),
    createUnitType('vh'),
    createUnitType('em'),
];
export var SizeInput = createPolyInput(NormalSizeOptions);
export var BackgroundSizeInput = createPolyInput([
    createSpecialSizeOption('cover'),
    createSpecialSizeOption('contain'),
    createUnitType('px'),
    createUnitType('%'),
    createUnitType('vh'),
    createUnitType('em'),
]);
