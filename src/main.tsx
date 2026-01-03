import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { enableSecurityFeatures, obfuscateConsole } from "./lib/security";

// Enable security features in production
if ((import.meta as any).env?.MODE === 'production') {
  enableSecurityFeatures();
  obfuscateConsole();
}

createRoot(document.getElementById("root")!).render(<App />);
