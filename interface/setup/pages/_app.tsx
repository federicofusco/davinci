import '../styles/globals.css'
import type { AppProps } from 'next/app'
import AuthenticationContextProvider from '../components/contexts/AuthenticationContext'
import UIContextProvider from '../components/contexts/UIContext'

const App = ({ Component, pageProps }: AppProps ) => {
  return (
    <AuthenticationContextProvider>
      <UIContextProvider>
        <Component {...pageProps} />
      </UIContextProvider>
    </AuthenticationContextProvider>
  )
}

export default App;