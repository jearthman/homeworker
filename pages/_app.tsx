import { AppProps } from "next/app";
import "styles/globals.css";
import "material-icons/iconfont/material-icons.css";
import { Provider } from "react-redux";
import { store, RootState } from "../redux/store";
import { useSelector } from "react-redux";

function MyApp({ Component, pageProps }: AppProps) {
  const theme = useSelector((state: RootState) => state.theme.value);

  return (
    <Provider store={store}>
      <div className="{theme}">
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}

export default MyApp;
