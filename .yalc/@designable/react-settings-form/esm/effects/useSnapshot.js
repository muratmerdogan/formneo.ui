import { onFieldInputValueChange } from '@formily/core';
var timeRequest = null;
export var useSnapshot = function (operation) {
    onFieldInputValueChange('*', function () {
        clearTimeout(timeRequest);
        timeRequest = setTimeout(function () {
            operation.snapshot('update:node:props');
        }, 1000);
    });
};
