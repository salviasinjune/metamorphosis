import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" makes the built site work from any GitHub Pages address,
// whether it is username.github.io or username.github.io/repo-name.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
