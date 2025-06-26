import { Storage } from "aws-amplify";

// Uploads file to `public/` directory and returns a public URL
export async function s3Upload(file: File) {
  const filename = `posts/${Date.now()}-${file.name}`;

  const stored = await Storage.put(filename, file, {
    contentType: file.type,
    level: "public", // 👈 sends it to /public/
  });

  // Return the full public URL
  return `https://${import.meta.env.VITE_BUCKET}.s3.amazonaws.com/public/${stored.key}`;
}
