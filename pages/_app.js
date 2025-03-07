import "@/styles/globals.css";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.addLocale(en);

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
