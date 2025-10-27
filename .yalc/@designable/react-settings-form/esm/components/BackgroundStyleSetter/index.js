import React from 'react';
import { useField, Field, observer } from '@formily/react';
import { usePrefix } from '@designable/react';
import { Select, Input } from '@formily/antd';
import { FoldItem } from '../FoldItem';
import { ColorInput } from '../ColorInput';
import { BackgroundSizeInput } from '../SizeInput';
import { BackgroundImageInput } from '../ImageInput';
import { InputItems } from '../InputItems';
import cls from 'classnames';
export var BackgroundStyleSetter = observer(function (props) {
    var field = useField();
    var prefix = usePrefix('background-style-setter');
    return (React.createElement(FoldItem, { className: cls(prefix, props.className), label: field.title },
        React.createElement(FoldItem.Base, null,
            React.createElement(Field, { name: "backgroundColor", basePath: field.address.parent(), component: [ColorInput] })),
        React.createElement(FoldItem.Extra, null,
            React.createElement(InputItems, null,
                React.createElement(InputItems.Item, { icon: "Image" },
                    React.createElement(Field, { name: "backgroundImage", basePath: field.address.parent(), component: [BackgroundImageInput] })),
                React.createElement(InputItems.Item, { icon: "ImageSize", width: "50%" },
                    React.createElement(Field, { name: "backgroundSize", basePath: field.address.parent(), component: [BackgroundSizeInput] })),
                React.createElement(InputItems.Item, { icon: "Repeat", width: "50%" },
                    React.createElement(Field, { name: "backgroundRepeat", basePath: field.address.parent(), component: [
                            Select,
                            { style: { width: '100%' }, placeholder: 'Repeat' },
                        ], dataSource: [
                            {
                                label: 'No Repeat',
                                value: 'no-repeat',
                            },
                            {
                                label: 'Repeat',
                                value: 'repeat',
                            },
                            {
                                label: 'Repeat X',
                                value: 'repeat-x',
                            },
                            {
                                label: 'Repeat Y',
                                value: 'repeat-y',
                            },
                            {
                                label: 'Space',
                                value: 'space',
                            },
                            {
                                label: 'Round',
                                value: 'round',
                            },
                        ] })),
                React.createElement(InputItems.Item, { icon: "Position" },
                    React.createElement(Field, { name: "backgroundPosition", basePath: field.address.parent(), component: [Input, { placeholder: 'center center' }] }))))));
});
