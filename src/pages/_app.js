// pages/_app.js
import "@/styles/globals.css";
import { AuthProvider } from "../contexts/userAuth";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
