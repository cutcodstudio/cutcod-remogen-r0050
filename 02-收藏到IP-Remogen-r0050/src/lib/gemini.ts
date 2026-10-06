import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import * as fs from "fs";
import * as path from "path";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

function getModel() {
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
}

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mov": "video/quicktime",
    ".avi": "video/x-msvideo",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
  };
  return mimeTypes[ext] || "application/octet-stream";
}

function fileToGenerativePart(filePath: string): Part {
  const data = fs.readFileSync(filePath);
  return {
    inlineData: {
      data: data.toString("base64"),
      mimeType: getMimeType(filePath),
    },
  };
}

export async function promptWithVideo(
  videoPath: string,
  prompt: string
): Promise<string> {
  const model = getModel();
  const videoPart = fileToGenerativePart(videoPath);

  const result = await model.generateContent([prompt, videoPart]);
  const response = result.response;
  return response.text();
}

export async function promptWithTwoVideos(
  videoPath1: string,
  videoPath2: string,
  prompt: string
): Promise<string> {
  const model = getModel();
  const videoPart1 = fileToGenerativePart(videoPath1);
  const videoPart2 = fileToGenerativePart(videoPath2);

  const result = await model.generateContent([
    prompt,
    "Reference video:",
    videoPart1,
    "Recreated video:",
    videoPart2,
  ]);
  const response = result.response;
  return response.text();
}

export async function promptText(prompt: string): Promise<string> {
  const model = getModel();
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export interface LabeledVideo {
  label: string;
  path: string;
}

export async function promptWithVideos(
  videos: LabeledVideo[],
  prompt: string
): Promise<string> {
  const model = getModel();

  const parts: (string | Part)[] = [prompt];

  for (const video of videos) {
    parts.push(`${video.label}:`);
    parts.push(fileToGenerativePart(video.path));
  }

  const result = await model.generateContent(parts);
  return result.response.text();
}
