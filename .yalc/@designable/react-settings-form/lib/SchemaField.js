"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaField = void 0;
var react_1 = require("@formily/react");
var antd_1 = require("@formily/antd");
var antd_2 = require("antd");
var components_1 = require("./components");
exports.SchemaField = (0, react_1.createSchemaField)({
    components: {
        FormItem: antd_1.FormItem,
        CollapseItem: components_1.CollapseItem,
        Input: antd_1.Input,
        ValueInput: components_1.ValueInput,
        SizeInput: components_1.SizeInput,
        ColorInput: components_1.ColorInput,
        ImageInput: components_1.ImageInput,
        MonacoInput: components_1.MonacoInput,
        PositionInput: components_1.PositionInput,
        CornerInput: components_1.CornerInput,
        BackgroundImageInput: components_1.BackgroundImageInput,
        BackgroundStyleSetter: components_1.BackgroundStyleSetter,
        BoxStyleSetter: components_1.BoxStyleSetter,
        BorderStyleSetter: components_1.BorderStyleSetter,
        BorderRadiusStyleSetter: components_1.BorderRadiusStyleSetter,
        DisplayStyleSetter: components_1.DisplayStyleSetter,
        BoxShadowStyleSetter: components_1.BoxShadowStyleSetter,
        FlexStyleSetter: components_1.FlexStyleSetter,
        FontStyleSetter: components_1.FontStyleSetter,
        DrawerSetter: components_1.DrawerSetter,
        NumberPicker: antd_1.NumberPicker,
        DatePicker: antd_1.DatePicker,
        TimePicker: antd_1.TimePicker,
        Select: antd_1.Select,
        Radio: antd_1.Radio,
        Slider: antd_2.Slider,
        Switch: antd_1.Switch,
        Space: antd_1.Space,
        ArrayItems: antd_1.ArrayItems,
        ArrayTable: antd_1.ArrayTable,
        FormCollapse: antd_1.FormCollapse,
        FormGrid: antd_1.FormGrid,
        FormLayout: antd_1.FormLayout,
        FormTab: antd_1.FormTab,
    },
});
