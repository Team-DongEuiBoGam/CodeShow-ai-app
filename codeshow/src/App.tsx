
import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainPage from './pages/MainPage';

export default function App() {
  const [view, setView] = useState<'login' | 'register'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로그인/회원가입 완료 시 메인으로 이동
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