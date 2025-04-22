import "@/styles/globals.css";
import "@/styles/sidebar.css";
import { CssBaseline } from "@mui/material";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store/store";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <CssBaseline />
      <Component {...pageProps} />
    </Provider>
  );
}
