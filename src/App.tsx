import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MovieSearchPage } from "./presentation/pages/MovieSearchPage";
import { MovieDetailsPage } from "./presentation/pages/MovieDetailsPage";
import { validateApiConfig } from "./infrastructure/config/apiConfig";
import "./App.css";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap');
  
  body {
    font-family: 'Montserrat', sans-serif;
  }
`;

validateApiConfig();

function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<MovieSearchPage />} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
