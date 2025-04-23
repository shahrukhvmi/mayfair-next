// pages/_app.js
import "@/styles/globals.css";
import "@/styles/sidebar.css";
import { CssBaseline } from "@mui/material";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import localFont from 'next/font/local';

const figtreeFont = localFont({
  src: [
    {
      path: '../public/fonts/Figtree/Figtree-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-figtree',
  display: 'swap',
});

const interFont = localFont({
  src: [
    {
      path: '../public/fonts/inter/Inter_28pt-SemiBold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
});

export default function App({ Component, pageProps }) {
  return (
    <main className={`${figtreeFont.variable} ${interFont.variable}`}>
      <Provider store={store}>
        <CssBaseline />
        <Component {...pageProps} />
      </Provider>
    </main>
  );
}
