import path from "path";
import { createClient } from "../server/supabase";
import { randomUUID } from "crypto";

type Folder =
  | "app-images"
  | "leagues-logos"
  | "players-avatars"
  | "teams-logos";

type UploadProps = {
  bucket?: string;
  folder: Folder;
  file: File;
  name?: string;
};

export async function uploadImage({
  file,
  bucket = "kik-league",
  folder,
  name,
}: UploadProps) {
  const fileExt = path.extname(file.name) || ".jpg";
  const fileName = (name || randomUUID()) + fileExt;
  const filePath = folder ? `${folder}/${fileName}` : fileName;

  const { storage } = await createClient();

  const { error } = await storage.from(bucket).upload(filePath, file, {
    contentType: file.type,
    upsert: true,
  });

  if (error) throw new Error("Errore nell'upload dell'immagine");

  const { data } = storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}
