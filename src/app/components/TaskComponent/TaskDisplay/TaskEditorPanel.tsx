import { Editor, EditorContent } from "@tiptap/react";

interface TaskEditorPanelProps {
  editor: Editor;
  taskId: number;
  onSave: (id: number) => void;
}

const fontArray = [
  "Montserrat",
  "Roboto",
  "Bebas Neue",
  "Fascinate",
  "Google Sans Code",
];

export default function TaskEditorPanel({
  editor,
  taskId,
  onSave,
}: TaskEditorPanelProps) {
  return (
    <div className="task-description w-2/4 hidden h-dvh md:flex flex-col">
      <div style={{ margin: "0.4rem" }}>
        <button
          className="text-white border-2 bg-blue-300 p-1 rounded-md text-sm m-1 border-blue-300 hover:bg-white hover:text-blue-300"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </button>

        <button
          className="text-white border-2 bg-blue-300 p-1 rounded-md text-sm m-1 border-blue-300 hover:bg-white hover:text-blue-300"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </button>

        <button
          className="text-white border-2 bg-blue-300 p-1 rounded-md text-sm m-1 border-blue-300 hover:bg-white hover:text-blue-300"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Ordered List
        </button>

        <button
          className="text-white border-2 bg-blue-300 p-1 rounded-md text-sm m-1 border-blue-300 hover:bg-white hover:text-blue-300"
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
        >
          Clear formatting
        </button>
      </div>

      <FontDropdown editor={editor} />

      <EditorContent
        className="outline-none border-none ProseMirror my-2 p-1 overflow-y-scroll max-h-dvh"
        editor={editor}
      />

      <button
        className="text-white border-2 bg-blue-300 p-1 rounded-md text-sm m-1 w-fit border-blue-300 hover:bg-white hover:text-blue-300"
        onClick={() => onSave(taskId)}
      >
        Save
      </button>
    </div>
  );
}

function FontDropdown({ editor }: { editor: Editor }) {
  const selectedFont = editor.getAttributes("textStyle").fontFamily;

  return (
    <div className="flex justify-start mx-1" style={{ marginBottom: "1rem" }}>
      <select
        className="text-white w-32 border-2 bg-blue-300 p-1 rounded-md text-xs m-1 border-blue-300 hover:bg-white hover:text-blue-300"
        value={selectedFont || ""}
        onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
      >
        <option value="">Select font</option>

        {fontArray.map((font) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
      </select>

      <button className="text-white border-2 bg-blue-300 p-1 rounded-md text-xs m-1 border-blue-300 hover:bg-white hover:text-blue-300">
        Comic Sans MS
      </button>

      <button className="text-white border-2 bg-blue-300 p-1 rounded-md text-xs m-1 border-blue-300 hover:bg-white hover:text-blue-300">
        H2
      </button>

      <button className="text-white border-2 bg-blue-300 p-1 rounded-md text-xs m-1 border-blue-300 hover:bg-white hover:text-blue-300">
        H3
      </button>

      <button className="text-white border-2 bg-blue-300 p-1 rounded-md text-xs m-1 border-blue-300 hover:bg-white hover:text-blue-300">
        H4
      </button>
    </div>
  );
}