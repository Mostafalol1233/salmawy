import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Render the app
createRoot(document.getElementById("root")!).render(<App />);

// Hidden console message when someone opens DevTools with F12 or Ctrl+Shift+I
function showHiddenConsoleMessage() {
	try {
		console.log("%cDesigned with ❤️ by Mustafa_bemo — https://linktr.ee/Mustafa_bemo","color:#ff69b4;font-size:14px;font-weight:bold;");
	} catch (e) {
		// noop
	}
}

function handleKey(e: KeyboardEvent) {
	// F12
	if (e.key === "F12") {
		showHiddenConsoleMessage();
	}
	// Ctrl+Shift+I
	if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") {
		showHiddenConsoleMessage();
	}
}

window.addEventListener("keydown", handleKey);
