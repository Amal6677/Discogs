import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
// import App from "./App";
import Footer from "./Footer"; //refer to Footer.js
import Header from "./Header";
import * as serviceWorker from "./serviceWorker";
import Playlist from "./Playlist";
import Discogs from "./Discogs";

class Main extends React.Component {
  render() {
    return (
      <main>
        <p id="play">Playlist</p>
        <Playlist />
        <Discogs />
      </main>
    );
  }
}

class Root extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Main />
        <Footer />
      </div>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById("root"));
serviceWorker.unregister();
