import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainPage from './pages/MainPage';
import SavelistPage from './pages/SavelistPage';

export default function App() {
  const [view, setView] = useState<'login' | 'register' | 'main' | 'savelist'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    return view === 'savelist' ? (
      <SavelistPage onBack={() => setView('main')} />
    ) : (
      <MainPage onGoToSaveList={() => setView('savelist')} />
    );
  }

  return (
    <>
      {view === 'login' ? (
        <LoginPage
          onDone={() => {
            setIsLoggedIn(true)
            setView('main')
          }}
          onGoToRegister={() => setView('register')}
        />
      ) : (
        <RegisterPage
          onDone={() => {
            setIsLoggedIn(true)
            setView('main')
          }}
          onBack={() => setView('login')}
        />
      )}
    </>
  );
}