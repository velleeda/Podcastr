import "../styles/global.scss";

import { Header } from "../components/Header";
import { Player } from "../components/Player";
import { PlayerContextProvider } from "../contexts/PlayerContext"
import { ThemeContextProvider } from "../contexts/ThemeContext"

import styles from "../styles/app.module.scss";

function MyApp({ Component, pageProps }) {


  return (
    <ThemeContextProvider>
      <PlayerContextProvider>
        <div className={styles.wrapper}>
          <main>
            <Header />
            <Component {...pageProps} />
          </main>
          <Player />
        </div>
      </PlayerContextProvider>
    </ThemeContextProvider>
  );
}

export default MyApp;
