import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "../context/authContext";
import "../styles/button.css";
import "../styles/footer.css";
import "../styles/header.css";
import "../styles/detailscard.css";
import "../styles/login.css";
import "../styles/maincontent.css";
import "../styles/nav.css";
import "../styles/lecturer.css";
import "../styles/signup.css";
import "../styles/tutor.css";
import "../styles/globals.css";
import "../styles/profile.css";

//All style files are imported here to ensure they are applied globally across the application.
//Next.js doesn't allow importing CSS files directly in components, so we imported them in _app.tsx.

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />;
    </AuthProvider>
  );
}
