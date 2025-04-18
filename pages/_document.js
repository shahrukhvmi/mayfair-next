import { Html, Head, Main, NextScript } from "next/document";
import { CssBaseline } from '@mui/material'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased">
        <CssBaseline />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
