import { AppProps } from "next/app";
import "../styles/globals.css";
import { Provider } from "react-redux";
import { store, RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { Nunito } from "next/font/google";
import { LexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { SpeedInsights } from "@vercel/speed-insights/next";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400"],
});
interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const theme = useSelector((state: RootState) => state.theme.value);
  return <div className={theme}>{children}</div>;
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Provider store={store}>
        <SpeedInsights />
        <ThemeProvider>
          <div className={nunito.className}>
            <Component {...pageProps} />
          </div>
        </ThemeProvider>
      </Provider>
    </SessionProvider>
  );
}

export default MyApp;
