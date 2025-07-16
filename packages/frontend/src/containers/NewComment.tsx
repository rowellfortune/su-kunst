import React, {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import { API} from "aws-amplify";
import { onError } from "../lib/errorLib";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
// import Form from "react-bootstrap/Form";
import config from "../config";
export type OpportunityInput = {
  id?: string;
  title: string;
  description: string;
  opencall?: "" | "internship" | "residency" | "workshop" ; // Example types
};

export default function NewNote() {
  const nav = useNavigate();
  const file = useRef<null | File>(null);
  const [formData, setFormData] = useState<OpportunityInput>({
    title: "",
    description: "",
    opencall: "",
  });

  console.log(formData);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);


   const handleChange = (field: keyof OpportunityInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  function createNote(note: OpportunityInput) {
    return API.post("notes", "/notes", {
      body: note,
    });
  }

  // function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
  //   if ( event.currentTarget.files === null ) return
  //   file.current = event.currentTarget.files[0];
  // }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    try {
      await createNote(formData);
      nav("/");

    } catch (e) {
      onError(e);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="NewNote">
      <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto">
      <Input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => handleChange("title", e.target.value)}
        required
      />

      <Textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        required
      />
      {/* <Form.Group className="mt-2" controlId="file">
        <Form.Label>Attachment</Form.Label>
        <Form.Control onChange={handleFileChange} type="file" />
      </Form.Group> */}
      <Select
        onValueChange={(value) => handleChange("opencall", value)}
        value={formData.opencall}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="internship">Internship</SelectItem>
          <SelectItem value="residency">Residency</SelectItem>
          <SelectItem value="workshop">Workshop</SelectItem>
        </SelectContent>
      </Select>

      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Opportunity"}
      </Button>

      {message && <p className="text-sm text-center">{message}</p>}
    </form>
    </div>
  );
}
