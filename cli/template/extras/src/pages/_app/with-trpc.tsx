import { type AppType } from "next/app";

import { api } from "~/utils/api";
import 'ui/styles.css';
import { Layout } from 'ui';

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
};

export default api.withTRPC(MyApp);
