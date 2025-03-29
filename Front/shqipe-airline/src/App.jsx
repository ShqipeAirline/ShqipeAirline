import { useState } from 'react'
import './App.css'
import Home from './components/Home'
import Register from './components/Register'
import Login from './components/Login'
import {Routes, Route} from 'react-router-dom'

function App() {
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="register/" element={<Register />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  )
}

export default App
