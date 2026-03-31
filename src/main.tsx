if (typeof window !== 'undefined' && !('Notification' in window)) {
  (window as any).Notification = {
    permission: 'denied',
    requestPermission: () => Promise.resolve('denied'),
  };
}  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(<App />);
  
