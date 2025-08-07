import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MovieSearchPage } from './presentation/pages/MovieSearchPage'
import { MovieDetailsPage } from './presentation/pages/MovieDetailsPage'
import { validateApiConfig } from './infrastructure/config/apiConfig'
import './App.css'

// Validar configuração da API na inicialização
validateApiConfig()

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MovieSearchPage />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
      </Routes>
    </Router>
  )
}

export default App

