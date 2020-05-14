import React from "react";

class Discogs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artist_data: [],
      artist_count: 0,
      isLoaded: true, // will be true after data have been received from server
      error: null
    };
  }

  searchArtist = artist => {
    fetch(
      "https://api.discogs.com/database/search?key=COlBmwAbIbqfeUBvUNmZ&secret=zzNhymRsknynpTMKyyfqBgclUMQHYyio&artist=" +
        artist +
        "&country=canada"
    ).then(
      response => {
        if (response.ok) {
          // handle 2xx code success only
          // get only JSON data returned from server with .json()
          response.json().then(json_response => {
            console.log(json_response);
            this.setState({
              artist_data: json_response.results, // data received from server
              artist_count: json_response.results.length,
              isLoaded: true, // we got data
              error: null // no errors
            });
          });
        } else {
          // handle errors, for example 404
          response.json().then(json_response => {
            this.setState({
              isLoaded: false,
              // result returned is case of error is like  {message: "dress not found"}
              // save the error in state for display below
              error: json_response, // something in format  {message: "dress not found", db_data:{}}
              artist_data: {} // no data received from server
            });
          });
        }
      },

      error => {
        // Basically fetch() will only reject a promise if the URL is wrong, the user is offline,
        // or some unlikely networking error occurs, such a DNS lookup failure.
        this.setState({
          isLoaded: false,
          error: {
            message: "AJAX error, URL wrong or unreachable, see console"
          }, // save the AJAX error in state for display below
          artist_data: {} // no data received from server
        });
      }
    );
  };

  addArtist = each_artist => {
    console.log("inside addArtist");
    let id;
    switch (each_artist.style[1]) {
      case "Acoustique":
        id = 2;
        break;
      case "Classique":
        id = 3;
        break;
      case "Country":
        id = 4;
        break;
      case "Metal":
        id = 5;
        break;
      case "Pop/Dance":
        id = 6;
        break;
      case "Rock":
        id = 6;
        break;
      default:
        id = 1;
    }
    const response = fetch("http://localhost:8000/tracks/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: each_artist.title,
        uri: each_artist.url,
        master_id: each_artist.master_id,
        playlist_id: id
      })
    });
  };

  render() {
    console.log("inside render");
    if (!this.state.isLoaded) {
      return (
        <form className="panel350">
          <h3>{this.props.title}</h3>
          <input type="text" id="artist" />
          <button
            type="button"
            onClick={() =>
              this.searchArtist(document.getElementById("artist").value)
            }
          >
            Search by artist
          </button>
          <div>Please enter a valid artist</div>
        </form>
      );
    } else {
      return (
        <main>
          <form className="panel350 err">
            <h3>{this.props.title}</h3>

            <input id="search" type="text" id="artist" />
            <button
              type="button"
              onClick={() =>
                this.searchArtist(document.getElementById("artist").value)
              }
            >
              Search by Artist
            </button>
            <table id="customers">
              <tbody>
                <tr>
                  <th>Title</th>
                  <th>URI</th>
                  <th>Description</th>
                  <th>Cover Image</th>
                  <th>Add</th>
                </tr>
                {this.state.artist_data.map(function(each_artist, i) {
                  return (
                    <tr key={i}>
                      <td>{each_artist.title}</td>
                      <td>
                        <a href={"https://www.discogs.com/" + each_artist.uri}>
                          More Info
                        </a>
                      </td>
                      <td>{each_artist.format[0]}</td>
                      <td>
                        <img src={each_artist.cover_image}></img>
                      </td>
                      <td>
                        <button
                          type="button"
                          id={"add" + i}
                          onClick={() => this.addArtist(each_artist)}
                        >
                          Add
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </form>
        </main>
      );
    }
  }
}

export default Discogs;
