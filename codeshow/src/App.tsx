import { useEffect, useState } from 'react'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MainPage from './pages/MainPage'
import SavelistPage from './pages/SavelistPage'
import { useAppStore } from './store/useAppStore'
import { getMe } from './api/analyze'

export default function App() {
  const [view, setView] = useState<'login' | 'register' | 'main' | 'savelist'>('login')

  const {
    user,
    hasHydrated,
    setUser,
    setIsGuest,
    logout
  } = useAppStore()

  useEffect(() => {
    const syncUser = async () => {
      if (!hasHydrated) return

      if (!user?.token) {
        setView('login')
        return
      }

      try {
        const me = await getMe(user.token)

        setUser({
          user_id: me.userId ?? 0,
          user_name: me.username,
          login_id: me.loginId ?? '',
          isMember: me.role === 'USER',
          token: user.token
        })

        setIsGuest(me.role === 'GUEST')
        setView((prev) => (prev === 'register' || prev === 'login' ? 'main' : prev))
      } catch {
        logout()
        setView('login')
      }
    }

    syncUser()
  }, [hasHydrated])

  if (!hasHydrated) {
    return <div style={{ color: '#fff', padding: '24px' }}>불러오는 중...</div>
  }

  if (user?.token) {
    return view === 'savelist' ? (
      <SavelistPage onBack={() => setView('main')} />
    ) : (
      <MainPage onGoToSaveList={() => setView('savelist')} />
    )
  }

  return (
    <>
      {view === 'login' ? (
        <LoginPage
          onDone={() => {
            setView('main')
          }}
          onGoToRegister={() => setView('register')}
        />
      ) : (
        <RegisterPage
          onDone={() => {
            setView('main')
          }}
          onBack={() => setView('login')}
        />
      )}
    </>
  )
}