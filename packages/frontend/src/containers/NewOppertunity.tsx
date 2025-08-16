// src/pages/NewOppertunity.tsx
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "aws-amplify";
import { onError } from "@/lib/errorLib";
import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea"; // not needed now; we use PostEditor
import { Button } from "@/components/ui/button";
import config from "@/config";
import { s3Upload } from "@/lib/awsLib";
// ✅ Use the PostEditor you built earlier
import PostEditor, { type EditorValue } from "@/components/newsfeed/PostEditor";

export type OpportunityType = "internship" | "workshop" | "education" | "opencall";

export type OpportunityInput = {
  id?: string;
  title: string;
  descriptionText: string;   // plain text for search
  descriptionJSON: string;   // serialized Lexical state
  attachment?: string | null;
  type: OpportunityType;
};

type Option = { value: OpportunityType | ""; label: string };

export default function NewOppertunity() {
  const nav = useNavigate();

  // form state
  const file = useRef<File | null>(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<OpportunityType | "">("");
  const [editor, setEditor] = useState<EditorValue>({ json: "", text: "" });

  console.log(editor)
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const options: Option[] = [
    { value: "",           label: "-- Please choose an option --" },
    { value: "internship", label: "Internship" },
    { value: "workshop",   label: "Workshop" },
    { value: "education",  label: "Education" },
    { value: "opencall",   label: "Open Call" },
  ];

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    file.current = e.currentTarget.files?.[0] ?? null;
  }

  function createOpportunities(opportunity: OpportunityInput) {
    return API.post("opportunities", "/opportunities", { body: opportunity });
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    // basic validation
    if (!title.trim()) {
      setMessage("Title is required.");
      return;
    }
    if (!type) {
      setMessage("Please choose a type.");
      return;
    }
    if (!editor.text.trim()) {
      setMessage("Description is required.");
      return;
    }

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1_000_000} MB.`);
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const attachment = file.current ? await s3Upload(file.current) : undefined;

      await createOpportunities({
        title: title.trim(),
        type,
        descriptionText: editor.text,
        descriptionJSON: editor.json,
        attachment,
      });

      nav("/");
    } catch (err) {
      onError(err);
      setMessage("Failed to create opportunity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="NewNote">
      <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-xl mx-auto">
        {/* Title */}
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Rich description */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <PostEditor onChange={setEditor} placeholder="Describe the opportunity…" />
        </div>

        {/* File preview */}
        {file.current && (
          <img
            src={URL.createObjectURL(file.current)}
            alt="Preview"
            className="mt-2 rounded shadow-md w-full max-w-sm"
          />
        )}

        {/* File input */}
        <Input type="file" accept="image/*" onChange={handleFileChange} />

        {/* Type select */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value as OpportunityType | "")}
          className="border rounded px-2 py-2 w-full"
          required
        >
          {options.map((opt) => (
            <option key={opt.label} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Submit */}
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Opportunity"}
        </Button>

        {message && <p className="text-sm text-center text-red-600">{message}</p>}
      </form>
    </div>
  );
}
