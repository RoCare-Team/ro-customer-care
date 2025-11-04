// pages/_app.js
import "@/styles/globals.css";
import { AuthProvider } from "../contexts/userAuth";
import Head from "next/head";
import { ThemeProvider } from "@/contexts/ThemeContext";




export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Head>
         <meta name="robots" content="index, follow" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  );
}
