import React from "react";
import "./header.css";

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <header
        style={{
          backgroundColor: "red",
          padding: "10px",
          textAlign: "center"
        }}
      >
        <img src="logo512.png" alt="some logo" style={{ width: "50px" }}></img>
        <h2>Welcome to Discogs playlist</h2>
      </header>
    );
  }
}

export default Header;
