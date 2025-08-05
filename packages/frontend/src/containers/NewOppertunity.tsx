import React, {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import { API} from "aws-amplify";
import { onError } from "../lib/errorLib";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import config from "@/config";
import { s3Upload } from "@/lib/awsLib";
export type OpportunityInput = {
  id?: string;
  title: string;
  description: string;
  attachment?: string | null;
  type: string;
  opencall?: "internship" | "residency" | "workshop" ; // Example types
};

interface Option {
  value: string;
  label: string;
}

export default function NewOppertunity() {
  const file = useRef<null | File>(null);
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setSelectedValue] = useState<string>("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState<string | null>(null);


  const options: Option[] = [
    { value: "",        label: "-- Please choose an option --" },
    { value: "intership",   label: "Internship" },
    { value: "workshop",  label: "WorKshop" },
    { value: "opencall",  label: "Opencall" },
  ];


  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(e.target.value);
  };

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if ( event.currentTarget.files === null ) return
    file.current = event.currentTarget.files[0];
  }

  function createOpportunities(opportunity: OpportunityInput) {
    return API.post("opportunities", "/opportunities", {
      body: opportunity,
    });
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const attachment = file.current
        ? await s3Upload(file.current)
        : undefined;


      await createOpportunities({
        title,
        attachment,
        type,
        description
      });
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        {file.current && (
          <img
            src={URL.createObjectURL(file.current)}
            alt="Preview"
            className="mt-2 rounded shadow-md w-full max-w-sm"
          />
        )}
            
        

        <select
        id="fruit-select"
        value={type}
        onChange={handleChange}
        className="border rounded px-2 py-1 mb-4 w-full"
        required
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Opportunity"}
        </Button>

        {message && <p className="text-sm text-center">{message}</p>}
      </form>
    </div>
  );
}
