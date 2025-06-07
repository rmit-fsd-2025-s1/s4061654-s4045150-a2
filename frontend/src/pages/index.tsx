import React from "react";
import Nav from "../components/NavBar";
import Footer from "../components/Footer";
import Header from "../components/header";
import MainContent from "../components/MainContent";

import "../components/LoginBox";

export default function HomePage() {
  return (
    <div style={{ overflowX: 'hidden' }}>
      <Nav />
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
}
