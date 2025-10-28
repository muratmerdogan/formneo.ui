import React from "react";
import { Button } from "antd";

type FormNeoButtonProps = {
  text?: string;
  type?: "default" | "primary" | "dashed" | "link" | "text";
  danger?: boolean;
  block?: boolean;
};

const FormNeoButton: any = (props: FormNeoButtonProps) => {
  const { text = "FormNeo Button", ...rest } = props as any;
  return <Button {...rest}>{text}</Button>;
};

// Designable palette registration
FormNeoButton.Resource = [
  {
    title: "FormNeo Button",
    icon: "Button",
    elements: [
      {
        componentName: "Field",
        props: {
          type: "void",
          "x-decorator": "FormItem",
          "x-component": "FormNeoButton",
          "x-component-props": { text: "FormNeo Button" },
        },
      },
    ],
  },
];

FormNeoButton.Behavior = [
  {
    name: "FormNeoButton",
    selector: (node: any) => node.props?.["x-component"] === "FormNeoButton",
    designerProps: {
      propsSchema: {
        type: "object",
        properties: {
          text: { type: "string", title: "Text" },
          type: {
            type: "string",
            title: "Type",
            enum: ["default", "primary", "dashed", "link", "text"],
            default: "primary",
          },
          danger: { type: "boolean", title: "Danger" },
          block: { type: "boolean", title: "Block" },
        },
      },
    },
  },
];

export default FormNeoButton;


