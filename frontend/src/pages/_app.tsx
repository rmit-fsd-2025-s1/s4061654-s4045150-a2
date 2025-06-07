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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />;
    </AuthProvider>
  );
}
