import React from "react";

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks_data: [],
      tracks_count: 0,
      isLoaded: false, // will be true after data have been received from server
      error: null
    };
  }

  componentDidMount() {
    // AJAX call using fetch. Make sure the dress server is running !
    fetch("http://localhost:8000/tracks").then(
      response => {
        // here full fetch response object
        // fetch not like jQuery ! both ok code 200 and error code 404 will execute this .then code
        if (response.ok) {
          // handle 2xx code success only
          // get only JSON data returned from server with .json()
          response.json().then(json_response => {
            console.log(json_response);
            this.setState({
              tracks_data: json_response.db_data, // data received from server
              tracks_count: json_response.db_data.length, // how many tracks in array
              isLoaded: true, // we got data
              error: null // no errors
            });
          });
        } else {
          // handle errors, for example 404
          response.json().then(json_response => {
            this.setState({
              isLoaded: false,
              // result returned is case of error is like  {message: "tracks not found"}
              // save the error in state for display below
              error: json_response, // something in format  {message: "tracks not found", db_data:{}}
              tracks_data: {}, // no data received from server
              tracks_count: 0
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
          tracks_data: {}, // no data received from server
          tracks_count: 0
        });
      }
    );
  }

  deleteTrack = id => {
    fetch("http://localhost:8000/tracks/" + id, {
      method: "DELETE"
    });
  };

  render() {
    if (this.state.error != null && this.state.error) {
      return (
        <div>
          <b>{this.state.error.message}</b>
        </div>
      );
    } else if (this.state.isLoaded) {
      if (this.state.tracks_count !== 0) {
        const tracks = [];
        for (let i = 0; i < this.state.tracks_count; i++) {
          tracks.push(
            <table id="customers">
              <tr className="border">
                <td>
                  {this.state.tracks_data[i].track_title}
                  <br></br>
                  Id : {this.state.tracks_data[i].id}
                  <br></br>
                  Playlist : {this.state.tracks_data[i].playlist_title}
                  <br></br>
                  URI : {this.state.tracks_data[i].uri}
                  <br></br>
                  Master Id : {this.state.tracks_data[i].master_id}
                  <br></br>
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() =>
                      this.deleteTrack(this.state.tracks_data[i].id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </table>
          );
        }
        return (
          <form className="panel350">
            <table>
              <tbody>{tracks}</tbody>
            </table>
          </form>
        );
      }
    } else {
      console.log("Inside the else");
      return (
        <div>
          <b>Waiting for server ...</b>
        </div>
      );
    }
  }
}

export default Playlist;
