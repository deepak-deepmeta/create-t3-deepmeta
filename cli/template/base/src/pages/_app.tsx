import { type AppType } from 'next/dist/shared/lib/utils';

import '~/styles/globals.css';
import 'ui/styles.css';
import { Layout } from 'ui';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
};

export default MyApp;
