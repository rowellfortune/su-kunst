import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import { API, Auth} from "aws-amplify";
import { onError } from "../lib/errorLib";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Form from "react-bootstrap/Form";
import config from "../config";
import type { PostType } from "@/types/post";
import { s3Upload } from "@/lib/awsLib";
import { useAppContext } from "@/lib/contextLib";

export default function NewPost() {
  const file = useRef<null | File>(null);
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const {isAuthenticated } = useAppContext();
  const [user, setUser] = useState("")
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function createNote(note: PostType) {
    return API.post("posts", "/posts", {
      body: note,
    });
  }

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
      const user = await Auth.currentAuthenticatedUser();
      setUser(user.username);
      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);
  
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

      await createNote({
        title,
        content,
        attachment, // this is the S3 public URL
        user,
      });
      nav("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="">
      <form onSubmit={handleSubmit} className="">
      <Input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      {file.current && (
        <img
          src={URL.createObjectURL(file.current)}
          alt="Preview"
          className="mt-2 rounded shadow-md w-full max-w-sm"
        />
      )}
      <Form.Group className="mt-2" controlId="file">
        <Form.Label>Attachment</Form.Label>
        <Form.Control onChange={handleFileChange} type="file" accept="image/*" />
      </Form.Group>
      <Button type="submit" disabled={isLoading} className="mt-3 w-full">
        {isLoading ? "Posting..." : "Create Post"}
      </Button>
    </form>
    </div>
  );
}
