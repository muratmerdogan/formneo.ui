declare const _default: {
    'en-US': {
        settings: {
            'x-validator': {
                title: string;
                addValidatorRules: string;
                drawer: string;
                triggerType: {
                    title: string;
                    placeholder: string;
                    dataSource: string[];
                };
                format: {
                    title: string;
                    placeholder: string;
                    dataSource: {
                        label: string;
                        value: string;
                    }[];
                };
                validator: {
                    title: string;
                    tooltip: string;
                };
                pattern: string;
                len: string;
                max: string;
                min: string;
                exclusiveMaximum: string;
                exclusiveMinimum: string;
                whitespace: string;
                required: string;
                message: {
                    title: string;
                    tooltip: string;
                };
            };
        };
        SettingComponents: {
            DataSourceSetter: {
                nodeProperty: string;
                pleaseSelectNode: string;
                addKeyValuePair: string;
                configureDataSource: string;
                dataSource: string;
                defaultTitle: string;
                dataSourceTree: string;
                addNode: string;
                label: string;
                value: string;
                item: string;
            };
            ReactionsSetter: {
                configureReactions: string;
                relationsFields: string;
                variableName: string;
                variableNameValidateMessage: string;
                pleaseInput: string;
                sourceField: string;
                sourceProperty: string;
                variableType: string;
                operations: string;
                addRelationField: string;
                propertyReactions: string;
                actionReactions: string;
                visible: string;
                hidden: string;
                display: string;
                pattern: string;
                title: string;
                description: string;
                value: string;
                initialValue: string;
                dataSource: string;
                required: string;
                component: string;
                componentProps: string;
                decorator: string;
                decoratorProps: string;
                pleaseSelect: string;
                expressionValueTypeIs: string;
            };
            ValidatorSetter: {
                pleaseSelect: string;
                formats: {
                    label: string;
                    value: string;
                }[];
            };
        };
    };
};
export default _default;
