import React,{ useRef, useState } from "react";
import { s3Upload } from "@/lib/awsLib";
import { onError } from "@/lib/errorLib";
import { useNavigate } from "react-router-dom";
import { API} from "aws-amplify";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import config from "@/config";
import { Label } from "@/components/ui/label"
// import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'

type AdType = {
  title: string;
  content: string;
  attachment?: string;   
  company: string;
  link: string;
};

export default function NewEventForm() {
  const file = useRef<null | File>(null);
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [company, setComapany] = useState("");
  const [link, setLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // const [editor, setEditor] = useState<ReturnType<typeof SimpleEditor>['editor']>()
  // const [saving, setSaving] = useState(false)

  function createAds(note: AdType) {
    return API.post("ads", "/ads", {
      body: note,
    });
  }

  // const editorContent = SimpleEditor()?.props?.value?.editor?.getHTML()

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if ( event.currentTarget.files === null ) return
    file.current = event.currentTarget.files[0];
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    setIsLoading(true);

    try {
      const attachment = file.current
        ? await s3Upload(file.current)
        : undefined;

      await createAds({
        title,
        content,
        attachment,
        link,
        company,
      });
      nav("/admin/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }


  return (
    <div className="bg-white rounded-xl shadow p-5 space-y-4 max-w-lg mx-auto">
      <form onSubmit={handleSubmit} >
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">  
            <Label htmlFor="title">Company / Organization</Label>
            <Input
              type="text"
              placeholder="Company"
              value={company}
              onChange={(e) => setComapany(e.target.value)}
              required
            />
           </div>

          <div className="grid gap-2">
            <Label htmlFor="title">Ad URL</Label>
            <Input
              type="url"
              placeholder="Link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">Ad content</Label>
            {/* <SimpleEditor  /> */}
            <Textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
      
          {file.current && (
            <img
              src={URL.createObjectURL(file.current)}
              alt="Preview"
              className="mt-2 rounded shadow-md w-full max-w-sm"
            />
          )}
        
          <div className="grid gap-2">
            <Label htmlFor="title">Select the add image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="mt-3 w-full">
            {isLoading ? "Posting..." : "Create Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}


