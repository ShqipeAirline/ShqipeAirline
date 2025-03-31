import { useState } from 'react'
import './App.css'
import Register from './components/Register'
import Login from './components/Login'
import {Routes, Route} from 'react-router-dom'
import Acd from './components/Acd'

function App() {
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="register/" element={<Register />} />
        <Route path="/acd-dashboard" element={<Acd />} />

      </Routes>
    </>
  )
}

export default App
