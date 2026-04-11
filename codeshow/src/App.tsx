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
}