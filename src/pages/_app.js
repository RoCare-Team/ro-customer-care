// pages/_app.js
import "@/styles/globals.css";
import { AuthProvider } from "../contexts/userAuth";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
