import OpenAI from "openai";

export function getOpenAI() {
  const apiKey = process.env.NVIDIA_API_KEY ?? process.env.OPENAI_API_KEY;

  return new OpenAI({
    apiKey,
    baseURL: "https://integrate.api.nvidia.com/v1",
  });
}
