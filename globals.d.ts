
// Definition for the AI Studio integration interface used for API key management
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

// Extend the global Window interface safely
// Using the optional modifier helps resolve "identical modifiers" errors when merging with other ambient declarations
interface Window {
  aistudio?: AIStudio;
}

// Augment the NodeJS namespace to provide type safety for process.env
// This allows referencing process.env.API_KEY without TypeScript errors
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}
