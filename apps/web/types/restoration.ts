export type RestorationMode = "conservative" | "balanced" | "strong";

export interface RestorationResponse {
  id: string;
  original_file_name: string;
  input_url: string;
  output_url: string;
  provider: "deterministic" | "openai" | string;
  fallback_used: boolean;
  ai_model: string | null;
  provider_error_code: string | null;
  provider_error_message: string | null;
  mode: RestorationMode;
  message: string;
}

export interface RestoreImageInput {
  file: File;
  mode: RestorationMode;
  useAi: boolean;
  onUploadProgress?: (progress: number) => void;
}
