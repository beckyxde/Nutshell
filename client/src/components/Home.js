import React, { Component } from "react";
// import { MDBCol, MDBIcon } from "mdbreact";
import Search from "./Search";
import Card from "./Card";
// import { Link } from "react-router-dom";
import axios from "axios";
import Navbar2 from "./Navbar";
// import { Redirect } from "react-router-dom";
// // import onSubmit from "../components/Search";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: []

      // redirect: false
    };
  }

  getInfo = searchTerm => {
    let url =
      (process.env.REACT_APP_API_URL || "http://localhost:5000") +
      `/api/stories`;
    if (searchTerm)
      url =
        (process.env.REACT_APP_API_URL || "http://localhost:5000") +
        `/api/stories/${searchTerm}`;
    axios.get(url).then(res => {
      this.setState({
        results: res.data
      });
    });
  };

  componentDidMount() {
    this.getInfo();
  }

  render() {
    return (
      <div className="home">
        <Navbar2 />
        <div>
          <Search onSearch={this.getInfo} />
        </div>
        <br />

        <Card mirResult={this.state.results} />
      </div>
    );
  }
}
export default Home;
