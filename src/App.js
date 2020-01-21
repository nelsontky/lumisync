import React, { Component } from "react";
import authorization from "./luminusApi/getBearer";


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "nusstu\\E0310498",
      password: "op9h3uenzdxhaf$"
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: target.value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    await authorization(this.state.id, this.state.password);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          ID:
          <input
            type="text"
            name="id"
            value={this.state.id}
            onChange={this.handleChange}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

class App extends Component {
  render() {
    return <Login />;
  }
}

export default App;
