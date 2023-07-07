import { AppProps } from "next/app";
import "styles/globals.css";
import "material-icons/iconfont/material-icons.css";
import { Provider } from "react-redux";
import { store, RootState } from "../redux/store";
import { useSelector } from "react-redux";

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const theme = useSelector((state: RootState) => state.theme.value);
  return <div className={theme}>{children}</div>;
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
