import React, { useMemo } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import {
  AutoLinkPlugin,
  type AutoLinkMatcher,
  type AutoLinkMatcherResult,
} from "@lexical/react/LexicalAutoLinkPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import {
  $getRoot,
  ParagraphNode,
  TextNode,
  type EditorState,      // ✅ from lexical
  type LexicalEditor,     // ✅ from lexical
} from "lexical";
import { LinkNode, AutoLinkNode } from "@lexical/link";

export type EditorValue = { json: string; text: string };

type Props = {
  initialJSON?: string;
  onChange?: (value: EditorValue) => void;
  placeholder?: string;
  className?: string;
};

export default function PostEditor({
  initialJSON,
  onChange,
  placeholder = "What's on your mind?",
  className = "",
}: Props) {
  const theme = useMemo(
    () => ({
      link: "text-blue-600 hover:underline cursor-pointer",
      paragraph: "mb-1",
    }),
    []
  );

  const { urlMatcher, mentionMatcher } = useMemo(() => {
    const urlRegex = /https?:\/\/[^\s]+/g;
    const mentionRegex = /(^|\s)@([a-zA-Z0-9_.]{2,30})\b/g;

    const urlMatcher: AutoLinkMatcher = (text: string) => {
      const out: AutoLinkMatcherResult[] = [];
      for (const m of text.matchAll(urlRegex)) {
        if (m.index == null) continue;
        out.push({ index: m.index, length: m[0].length, text: m[0], url: m[0] });
      }
      return out;
    };

    const mentionMatcher: AutoLinkMatcher = (text: string) => {
      const out: AutoLinkMatcherResult[] = [];
      for (const m of text.matchAll(mentionRegex)) {
        if (m.index == null) continue;
        const leading = m[1] ?? "";
        const handle = m[2];
        const start = m.index + leading.length; // start exactly at '@'
        const token = `@${handle}`;
        out.push({ index: start, length: token.length, text: token, url: `/u/${handle}` });
      }
      return out;
    };

    return { urlMatcher, mentionMatcher };
  }, []);

  const initialConfig = useMemo(
    () => ({
      namespace: "post-editor",
      theme,
      onError: (e: unknown) => console.error(e),
      nodes: [ParagraphNode, TextNode, LinkNode, AutoLinkNode],
      editorState: initialJSON
        ? (editor: any) => editor.setEditorState(editor.parseEditorState(initialJSON))
        : undefined,
    }),
    [theme, initialJSON]
  );

  const toParent = (editorState: EditorState, editor: LexicalEditor, tags: Set<string>) => {

    console.log(editor)
    console.log(tags)

    const text = editorState.read(() => $getRoot().getTextContent());
    const json = JSON.stringify(editorState.toJSON());
    console.log(editorState, 'Text')
    onChange?.({ text, json, tags });
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={`rounded-2xl border p-3 ${className}`}>
        <RichTextPlugin
          contentEditable={<ContentEditable className="min-h-24 outline-none whitespace-pre-wrap" />}
          placeholder={<div className="text-muted-foreground">{placeholder}</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <LinkPlugin />
        <AutoLinkPlugin matchers={[urlMatcher, mentionMatcher]} />
        <OnChangePlugin onChange={toParent} />
      </div>
    </LexicalComposer>
  );
}
