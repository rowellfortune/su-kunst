import React, { useRef, useState } from "react";
import { s3Upload } from "@/lib/awsLib";
import { onError } from "@/lib/errorLib";
import { useNavigate } from "react-router-dom";
import { API } from "aws-amplify";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import config from "@/config";

type AdType = {
  title: string;
  content: string;
  attachment?: string;
  company: string;
  link: string;
  startDate: number;
  endDate: number;
};

export default function NewAdForm() {
  const file = useRef<null | File>(null);
  const nav = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [company, setCompany] = useState("");
  const [link, setLink] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function createAds(ad: AdType) {
    return API.post("ads", "/ads", {
      body: ad,
    });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      file.current = e.target.files[0];
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Basic size check
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1_000_000
        } MB.`
      );
      return;
    }

    // Validate dates
    const startTs = Date.parse(startDate);
    const endTs = Date.parse(endDate);
    
    if (isNaN(startTs) || isNaN(endTs)) {
      alert("Please enter valid start and end dates.");
      return;
    }
    if (endTs <= startTs) {
      alert("End date must be after start date.");
      return;
    }

    setIsLoading(true);
    try {
      const attachment = file.current ? await s3Upload(file.current) : undefined;

      await createAds({
        title,
        content,
        attachment,
        link,
        company,
        startDate: startTs,
        endDate: endTs,
      });

      nav("/admin/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-5 space-y-4 max-w-lg mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="company">Company / Organization</Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="link">Ad URL</Label>
            <Input
              id="link"
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="content">Ad Content</Label>
            <Textarea
              id="content"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Select Ad Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {file.current && (
              <img
                src={URL.createObjectURL(file.current)}
                alt="Preview"
                className="mt-2 rounded shadow-md w-full max-w-sm"
              />
            )}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Posting..." : "Create Ad"}
          </Button>
        </div>
      </form>
    </div>
  );
}
