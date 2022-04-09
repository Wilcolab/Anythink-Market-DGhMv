import React from "react";
import logo from "../../imgs/logo.png";
import Search from "./Search";

const Banner = () => {
  return (
    <div className="banner text-white">
      <div className="container p-4 text-center">
        <img width="100%" src={logo} alt="banner" />
        <h2>
          <span>A place to get</span>
          <Search />
          <span>the cool stuff.</span>
        </h2>
      </div>
    </div>
  );
};

export default Banner;
