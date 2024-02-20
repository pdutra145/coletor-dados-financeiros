import { createRoot } from "react-dom/client";
import App from "./renderer/App";
import { LoadProvider } from "./renderer/context/Load";

const root = createRoot(document.body);
root.render(
  <LoadProvider>
    <App />
  </LoadProvider>
);
