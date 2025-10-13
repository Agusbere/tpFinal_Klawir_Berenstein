import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomeScreen from '../screens/HomeScreen/HomeScreen'
import ChatScreen from '../screens/ChatScreen/ChatScreen'
import ResultScreen from '../screens/ResultScreen/ResultScreen'
import Navbar from '../components/Navbar/Navbar'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/chat" element={<ChatScreen />} />
        <Route path="/resultados" element={<ResultScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}


