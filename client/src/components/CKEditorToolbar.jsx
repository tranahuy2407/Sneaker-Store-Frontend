import React, { useRef, useState, Suspense } from "react";

// Lazy load CKEditor
const CKEditor = React.lazy(async () => {
  const { CKEditor } = await import("@ckeditor/ckeditor5-react");
  const ClassicEditor = (await import("@ckeditor/ckeditor5-build-classic")).default;

  return {
    default: function EditorWrapper(props) {
      return <CKEditor editor={ClassicEditor} {...props} />;
    },
  };
});

export default function CKEditorToolbar({ editorData, setEditorData, onInsertImage }) {
  const editorRef = useRef(null);
  return (
    <div className="relative w-full">
      <Suspense fallback={<div>Loading editor...</div>}>
        <CKEditor
          data={editorData}
          onReady={(editor) => (editorRef.current = editor)}
          onChange={(_, editor) => setEditorData(editor.getData())}
          config={{
        toolbar: [
          "heading", "|",
          "bold", "italic", "bulletedList", "numberedList", "blockQuote", "|",
          "link", "insertTable", "undo", "redo"
        ],
            fontSize: {
              options: [9, 11, 13, "default", 17, 19, 21, 25, 29, 33, 37, 41, 45],
              supportAllValues: true
            },
            licenseKey: "",
          }}
        />
      </Suspense>

      <style>
        {`
          .ck-editor__editable_inline {
            min-height: 300px;
            max-width: 100%;
            font-size: 16px;
          }
        `}
      </style>
    </div>
  );
}
