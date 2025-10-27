import React, { Fragment } from 'react';
import { isStr, isPlainObj } from '@designable/shared';
import { GlobalRegistry } from '@designable/core';
import { observer } from '@formily/reactive-react';
export var TextWidget = observer(function (props) {
    var takeLocale = function (message) {
        if (isStr(message))
            return message;
        if (isPlainObj(message)) {
            var lang = GlobalRegistry.getDesignerLanguage();
            for (var key in message) {
                if (key.toLocaleLowerCase() === lang)
                    return message[key];
            }
            return;
        }
        return message;
    };
    var takeMessage = function (token) {
        if (!token)
            return;
        var message = isStr(token)
            ? GlobalRegistry.getDesignerMessage(token)
            : token;
        if (message)
            return takeLocale(message);
        return token;
    };
    return (React.createElement(Fragment, null, takeMessage(props.children) ||
        takeMessage(props.token) ||
        takeMessage(props.defaultMessage)));
});
