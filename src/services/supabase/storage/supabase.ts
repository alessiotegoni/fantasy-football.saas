import path from "path";
import { createClient } from "../server/supabase";
import { randomUUID } from "crypto";

type UploadProps = {
  bucket?: string;
  folder: string;
  file: File;
  name?: string;
};


// FIXME: image upload (image upload throw an error: "new row violates row-level security policy")
// TODO: add cache tags for leagues (revalidate tags in db/league)


export async function uploadImage({
  file,
  bucket = "kik-league",
  folder,
  name,
}: UploadProps) {
  const fileExt = path.extname(file.name) || ".jpg";
  const fileName = (name || randomUUID()) + fileExt;
  const filePath = folder ? `${folder}/${fileName}` : fileName;

  const [{ storage }, arrayBuffer] = await Promise.all([
    createClient(),
    file.arrayBuffer(),
  ]);
  const buffer = new Uint8Array(arrayBuffer);

  const { error } = await storage.from(bucket).upload(filePath, buffer, {
    contentType: file.type,
    upsert: true,
  });

  console.log(error);


  if (error) throw new Error("Errore nell'upload dell'immagine");

  const { data } = storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}
