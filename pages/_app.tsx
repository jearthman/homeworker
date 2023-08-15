import { AppProps } from "next/app";
import "styles/globals.css";
import "material-icons/iconfont/material-icons.css";
import { Provider } from "react-redux";
import { store, RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { Noto_Sans } from "next/font/google";

const notoSans = Noto_Sans({
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
        <ThemeProvider>
          <div className={notoSans.className}>
            <Component {...pageProps} />
          </div>
        </ThemeProvider>
      </Provider>
    </SessionProvider>
  );
}

export default MyApp;
