import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useRef, useEffect } from "react";

export default function SafeCKEditor({ value, onChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
    return () => {
      try {
        if (editorRef.current) {
          editorRef.current.destroy();
          editorRef.current = null;
        }
      } catch (err) {
        console.warn("CKEditor destroy error (ignored):", err);
      }
    };
  }, []);

  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      onReady={(editor) => {
        editorRef.current = editor;
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
    />
  );
}
