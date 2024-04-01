import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "./Popup.tsx";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider>
      <Popup />
    </MantineProvider>
  </React.StrictMode>,
);
