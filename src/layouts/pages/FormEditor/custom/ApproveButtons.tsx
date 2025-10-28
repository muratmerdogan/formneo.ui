import React from "react";
import { Space, Button, message } from "antd";

type ApproveButtonsProps = {
  approveText?: string;
  rejectText?: string;
  onApproveActionKey?: string;
  onRejectActionKey?: string;
};

const ApproveButtons: any = (props: ApproveButtonsProps) => {
  const {
    approveText = "Onayla",
    rejectText = "Reddet",
    onApproveActionKey = "APPROVE",
    onRejectActionKey = "REJECT",
  } = props as any;

  const onApprove = () => {
    message.success(`Action: ${onApproveActionKey}`);
  };
  const onReject = () => {
    message.error(`Action: ${onRejectActionKey}`);
  };

  return (
    <Space>
      <Button type="primary" onClick={onApprove}>{approveText}</Button>
      <Button danger onClick={onReject}>{rejectText}</Button>
    </Space>
  );
};

ApproveButtons.Resource = [
  {
    title: "Approve / Reject",
    icon: "Check",
    elements: [
      {
        componentName: "Field",
        props: {
          type: "void",
          "x-decorator": "FormItem",
          "x-component": "ApproveButtons",
          "x-component-props": { approveText: "Onayla", rejectText: "Reddet" },
        },
      },
    ],
  },
];

ApproveButtons.Behavior = [
  {
    name: "ApproveButtons",
    selector: (node: any) => node.props?.["x-component"] === "ApproveButtons",
    designerProps: {
      propsSchema: {
        type: "object",
        properties: {
          approveText: { type: "string", title: "Approve Text" },
          rejectText: { type: "string", title: "Reject Text" },
          onApproveActionKey: { type: "string", title: "Approve Action Key" },
          onRejectActionKey: { type: "string", title: "Reject Action Key" },
        },
      },
    },
  },
];

export default ApproveButtons;


