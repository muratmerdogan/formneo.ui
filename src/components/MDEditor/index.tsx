/**
=========================================================
* Material Dashboard 2 PRO React TS - v1.0.2
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// draft-js
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { convertToHTML, convertFromHTML } from "draft-convert";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// Custom styles for the MDEditor
import MDEditorRoot from "components/MDEditor/MDEditorRoot";

// Material Dashboard 2 PRO React context
import { useMaterialUIController } from "context";

type MDEditorProps = {
  value?: (html: string) => void;
  initialHtml?: string;
  placeholder?: string;
  toolbar?: any;
  editorStyle?: React.CSSProperties;
};

function MDEditor({ value, initialHtml, placeholder, toolbar, editorStyle }: MDEditorProps) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [convertedContent, setConvertedContent] = React.useState<string | null>(null);
  const [editorState, setEditorState] = React.useState(() => {
    try {
      if (initialHtml) {
        const contentState = convertFromHTML(initialHtml);
        return EditorState.createWithContent(contentState);
      }
    } catch {}
    return EditorState.createEmpty();
  });

  React.useEffect(() => {
    let html = convertToHTML(editorState.getCurrentContent());
    setConvertedContent(html);
  }, [editorState]);

  React.useEffect(() => {
    if (typeof value === "function") {
      value(convertedContent || "");
    }
  }, [convertedContent, value]);

  return (
    <MDEditorRoot ownerState={{ darkMode }}>
      <Editor
        editorState={editorState}
        onEditorStateChange={setEditorState}
        placeholder={placeholder}
        toolbar={toolbar || { options: ["inline", "list", "link"], inline: { options: ["bold", "italic", "underline"] }, list: { options: ["unordered", "ordered"] }, link: { defaultTargetOption: "_blank" } }}
        toolbarStyle={{ border: "none", background: "transparent", padding: 0, marginBottom: 4 }}
        editorStyle={{
          minHeight: 120,
          border: `1px solid ${darkMode ? "#2d3748" : "#e5e7eb"}`,
          borderRadius: 8,
          padding: 10,
          background: darkMode ? "#0b1220" : "#fff",
          ...(editorStyle || {}),
        }}
      />
    </MDEditorRoot>
  );
}

// Setting default values for the props of MDEditor
MDEditor.defaultProps = {
  value: () => {},
  initialHtml: "",
  placeholder: undefined,
  toolbar: undefined,
  editorStyle: undefined,
};

// Typechecking props for the MDEditor
MDEditor.propTypes = {
  value: PropTypes.func,
};

export default MDEditor;
