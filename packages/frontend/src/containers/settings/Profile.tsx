// src/components/Profile.tsx
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/lib/contextLib";
import { API } from "aws-amplify";
import { onError } from "@/lib/errorLib";
import { s3Upload } from "@/lib/awsLib";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export interface Post {
  id: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  timestamp: string;        // e.g. "2 hrs"
  content: string;
  imageUrl?: string;
}

export interface ProfilePageProps {
  coverUrl: string;
  avatarUrl: string;
  name: string;
  headline?: string;        // e.g. "Software engineer • Suriname"
  photos: string[];         // list of URLs
  posts: Post[];
  createdAt: 1751015236574
  email: string;
  entityType: string;
  avatarFileattachment: string | undefined | File;
    coverFileattachment: string | undefined | File;
  pk: string
  profile: {
    bio?: string;
    name: string;
    location: string;
    website: string;
    username: string;
    avatarFileattachment: string | undefined;
    coverFileattachment: string | undefined;
  }
  role: string;
  sk: string;
  username: string;
}

export default function Profile() {
  // refs for files
  const { isAuthenticated, user } = useAppContext();
  const userId = user?.attributes.sub ?? "";

  // refs for file uploads
  const avatarFile = useRef<File | null>(null);
  const coverFile  = useRef<File | null>(null);
  
  const [profile, setProfile] = useState<ProfilePageProps | null>(null)


  // previews
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [coverPreview, setCoverPreview]   = useState<string>("");

  // other form state
  const [name, setName]         = useState<string>(profile?.profile?.name ?? "");
  const [location, setLocation] = useState<string>(profile?.profile?.location ?? "");
  const [website, setWebsite]   = useState<string>(profile?.profile?.website ?? "");
  const [username, setUsername] = useState<string>(user?.username ?? "");
  const [bio, setBio]           = useState<string>(profile?.profile?.bio ?? "");

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState<string | null>(null);

  function updateUserProfile(
    userId: string,
    updates: Record<string, string>
  ) {
    console.log(updates)
    // “SuKunstApi” must match the name in your amplify config
    return API.post("users", `/users/${userId}`, {
      body: { userId, updates }
    });
  }

  // load existing profile
  useEffect(() => {
    function loadNote() {
      return API.get("users", `/users/${userId}`, {});
    }

    async function onLoad() {
      try {
        const profile = await loadNote();
        setProfile(profile)
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [userId]);

  useEffect(() => {
    if (profile?.profile?.bio) {
      setBio(profile.profile.bio);
      setName(profile.profile.name);
      setLocation(profile.profile.location);
      setWebsite(profile.profile.website);
    }
  }, [profile]);

  // reusable handler like in NewPost
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>, target: "avatar" | "cover") {
    const files = event.currentTarget.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (target === "avatar") {
      avatarFile.current = file;
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      coverFile.current = file;
      setCoverPreview(URL.createObjectURL(file));
    }

    console.log(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // 1️⃣ upload (if any)
      const avatarFileattachment = avatarFile.current ? await s3Upload(avatarFile.current) : undefined;
      const coverFileattachment = coverFile.current ? await s3Upload(coverFile.current) : undefined;

      // send update
      // 2️⃣ build a Record<string, string> that omits undefined
          // 2️⃣ build a Record<string, string> that omits undefined
      const updates: Record<string, string> = {
        username,
        bio,
        name,
        location,
        website,
        // only spread these if they’re defined
        ...(avatarFileattachment && { avatarFileattachment }),
        ...(coverFileattachment  && { coverFileattachment  }),
      };

      // 3️⃣ call your helper
      const { updatedProfile } = await updateUserProfile(userId, updates);

      setSuccess("Profile updated!");
      // reset refs so we don’t re‑upload on next save
      console.log("🔄 updatedProfile:", updatedProfile);
      avatarFile.current = null;
      coverFile.current  = null;
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  }

  if (!isAuthenticated || !user) return <div>Please sign in</div>;

  return (
    <div className="w-full p-4 space-y-6">
        <h3 className="text-lg font-medium">Welcome back, {user.username}!</h3>
        <Card className="bg-gradient-to-r border-transparent">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Profile Information</CardTitle>
            <CardDescription className="">
             Update your public profile details
            </CardDescription>
          </CardHeader>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Cover Upload */}
        <div className="grid gap-2 p-4">
          <Label htmlFor="cover">Header Image</Label>
          {coverPreview && <img src={coverPreview} className="w-full h-40 object-cover rounded" />}
          <img src={profile?.profile?.coverFileattachment} className="w-full h-60 object-cover rounded" />
          <input
            id="cover"
            name="cover"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "cover")}
            disabled={isSaving}
          />
          <p className="text-muted-foreground text-sm">Recommended size: 1200×300px</p>
        </div>

        {/* Avatar Upload */}
        <div className="grid gap-2 p-4">
          <Label htmlFor="avatar">Profile Picture</Label>
          <img src={profile?.profile?.avatarFileattachment} className="w-24 h-24 rounded-full object-cover" />
          {avatarPreview && <img src={avatarPreview} className="w-24 h-24 rounded-full object-cover" />}
          <input
            id="avatar"
            name="avatar"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "avatar")}
            disabled={isSaving}
          />
          <p className="text-muted-foreground text-sm">Square, at least 200×200px</p>
        </div>
        
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name" className="">Name</Label>
            <Input
              id="name"
              className="ring-1"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              className="ring-1"
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
              disabled={true}
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="bio" className="">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.currentTarget.value)}
              disabled={isSaving}
              className="ring-1  focus:ring-2 "
        
            />
          </div>
          
          <div>
            <Label htmlFor="location" className="text-indigo-200">Location</Label>
            <Input
              id="location"
              className="ring-1"
              value={location}
              onChange={(e) => setLocation(e.currentTarget.value)}
            />
          </div>
          <div>
            <Label htmlFor="website" className="text-indigo-200">Website</Label>
            <Input
              id="website"
              className="ring-1"
              value={website}
              onChange={(e) => setWebsite(e.currentTarget.value)}
             
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving…" : "Update Profile"}
          </Button>
        </CardFooter>

        {/* Feedback */}
        {error && <p className="text-destructive text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
      </form>

       </Card>
    </div>
  );
}
