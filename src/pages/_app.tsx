// import type { AppProps } from 'next/app';
// import { wrapper } from '@/store/reducers/';
// import { ThemeProvider } from '@/contexts/ThemeContext';
// import { CssBaseline } from '@mui/material';
// import { SubmitProvider } from '@/contexts/SubmitContext';
// import '@/styles/globals.css';

// function MyApp({ Component, pageProps }: AppProps) {
//   return (
//     <ThemeProvider>
//       <SubmitProvider>
//         <CssBaseline />
//         <Component {...pageProps} />
//       </SubmitProvider>
//     </ThemeProvider>
//   )
// }

// export default wrapper.withRedux(MyApp);

import { FC } from "react";
import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { wrapper } from "../store/reducers"; // Adjust the import path as necessary
import { ThemeProvider } from "../contexts/ThemeContext";
import { CssBaseline } from "@mui/material";
import { SubmitProvider } from "../contexts/SubmitContext";
import "../styles/globals.css";

const MyApp: FC<AppProps> = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;

  return (
    <Provider store={store}>
      <ThemeProvider>
        <SubmitProvider>
          <CssBaseline />
          <Component {...pageProps} />
        </SubmitProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default MyApp;