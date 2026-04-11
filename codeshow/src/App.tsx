<<<<<<< HEAD
import { useState } from 'react'
import MainPage from './pages/MainPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { useAppStore } from './store/useAppStore'

export default function App() {
    const user = useAppStore((s) => s.user)
    const isGuest = useAppStore((s) => s.isGuest)
    const [authView, setAuthView] = useState<'login' | 'register'>('login')

    // 로그인이나 게스트 입장이 완료되면 메인화면으로
    if (user || isGuest) {
        return <MainPage />
    }

    return (
        <>
            {authView === 'login' ? (
                <LoginPage 
                    onDone={() => {}} 
                    onGoToRegister={() => setAuthView('register')} 
                />
            ) : (
                <RegisterPage 
                    onDone={() => {}} 
                    onBack={() => setAuthView('login')} 
                />
            )}
        </>
    )
=======
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
>>>>>>> e3e8766 (Fix: 회원가입 페이지 불러오기 안되는 오류 수정)
}