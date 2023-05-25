import Background from '../components/Background';
import '../styles/globals.css'
import type { AppProps } from 'next/app'

const App = ({ Component, pageProps }: AppProps) => {
  return <>
    <Background />
    <Component {...pageProps} />;
  </>
}

export default App;