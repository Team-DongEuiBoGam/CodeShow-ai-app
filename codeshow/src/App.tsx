import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import MainPage from './pages/MainPage'

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <>
      {!loggedIn && <LoginPage onDone={() => setLoggedIn(true)} />}
      <MainPage />
    </>
  )
}