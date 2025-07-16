import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../lib/errorLib";
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface ReadOnlyEditorProps {
  html: string;
}

function ReadOnlyEditor({ html }: ReadOnlyEditorProps) {
  console.log(html);
  const editor = useEditor({
    editable: false,            // <- read-only
    extensions: [StarterKit],
    content: html,              // ← your HTML string
  })

  if (!editor) return null
  return (
    <div className="prose max-w-none">
      <EditorContent editor={editor} />
    </div>
  )
}

function Ad() {
  const file = useRef<null | File>(null)
  const { id } = useParams();
  const nav = useNavigate();
  const [note, setNote] = useState(null);
  const [content, setContent] = useState("");



  console.log(content); 
  console.log(note, file, nav);

  useEffect(() => {
    function loadNote() {
      return API.get("ads", `/ads/${id}`, {});
    }

    async function onLoad() {
      try {
        const note = await loadNote();
        const { content, attachment } = note;

        // console.log(note)

        if (attachment) {
          note.attachmentURL = await Storage.vault.get(attachment);
        }

        setContent(content);
        setNote(note);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  return (
    <div className="flex w-full md:max-w-5xl container mx-auto">
      <ReadOnlyEditor html={content} />
    </div>
  )
}

export default Ad