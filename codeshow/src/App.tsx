import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainPage from './pages/MainPage';

export default function App() {
  const [view, setView] = useState<'login' | 'register'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) return <MainPage />;

  return (
    <>
      {view === 'login' ? (
        <LoginPage
          onDone={() => setIsLoggedIn(true)}
          onGoToRegister={() => setView('register')}
        />
      ) : (
        <RegisterPage
          onDone={() => setIsLoggedIn(true)}
          onBack={() => setView('login')}
        />
      )}
    </>
  );
}