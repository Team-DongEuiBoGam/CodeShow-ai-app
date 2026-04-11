import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

interface Props {
    onDone: () => void
}

export default function LoginPage({ onDone }: Props) {
    const setUser = useAppStore((s) => s.setUser)
    const setIsGuest = useAppStore((s) => s.setIsGuest)
    const [view, setView] = useState<'choice' | 'login'>('choice')
    const [loginId, setLoginId] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = () => {
        const name = loginId.split('@')[0] || 'user'
        setUser({ user_id: 1, user_name: name, login_id: loginId, isMember: true })
        setIsGuest(false)
        onDone()
    }

    const handleGuest = () => {
        setUser(null)
        setIsGuest(true)
        onDone()
    }

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, fontFamily: 'Pretendard, sans-serif'
        }}>
            <div style={{
                background: '#13161e', borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '40px', width: '100%', maxWidth: '400px',
                boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                animation: 'modalIn 0.35s cubic-bezier(0.16,1,0.3,1)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <img
                        src="/CodeShow.png"
                        alt="CodeShow"
                        style={{ width: 56, height: 56, borderRadius: '14px', margin: '0 auto 12px', display: 'block', boxShadow: '0 0 24px rgba(108,140,255,0.3)' }}
                    />
                    <div style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff' }}>Code<span style={{ color: '#6c8cff' }}>Show</span></div>
                    <div style={{ fontSize: '13px', color: '#7a8099', marginTop: '4px' }}>코드의 메모리 동작을 눈으로 확인하세요</div>
                </div>

                {view === 'choice' ? (
                    <>
                        <button onClick={() => setView('login')} style={{
                            width: '100%', padding: '12px', background: '#6c8cff', border: 'none',
                            borderRadius: '10px', fontSize: '15px', fontWeight: 600, color: '#fff',
                            cursor: 'pointer', marginBottom: '12px'
                        }}>🔐 회원 로그인</button>
                        <button onClick={handleGuest} style={{
                            width: '100%', padding: '12px', background: '#1e2330',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '10px', fontSize: '15px', fontWeight: 500, color: '#e8eaf0',
                            cursor: 'pointer'
                        }}>👤 비회원으로 시작</button>
                        <div style={{ textAlign: 'center', fontSize: '12px', color: '#404560', marginTop: '12px' }}>
                            비회원은 애니메이션 저장이 제한됩니다
                        </div>
                    </>
                ) : (
                    <>
                        <button onClick={() => setView('choice')} style={{ background: 'none', border: 'none', color: '#7a8099', fontSize: '13px', cursor: 'pointer', marginBottom: '16px' }}>
                            ← 뒤로
                        </button>
                        <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: '#7a8099', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>이메일</div>
                            <input value={loginId} onChange={e => setLoginId(e.target.value)}
                                placeholder="example@email.com"
                                style={{ width: '100%', padding: '10px 14px', background: '#1e2330', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '14px', color: '#e8eaf0', outline: 'none', fontFamily: 'inherit' }} />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: '#7a8099', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>비밀번호</div>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{ width: '100%', padding: '10px 14px', background: '#1e2330', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '14px', color: '#e8eaf0', outline: 'none', fontFamily: 'inherit' }} />
                        </div>
                        <button onClick={handleLogin} style={{
                            width: '100%', padding: '12px', background: '#6c8cff', border: 'none',
                            borderRadius: '10px', fontSize: '15px', fontWeight: 600, color: '#fff', cursor: 'pointer'
                        }}>로그인</button>
                        <div style={{ textAlign: 'center', fontSize: '12px', color: '#404560', marginTop: '10px' }}>데모 모드: 아무 값이나 입력하세요</div>
                    </>
                )}
            </div>
            <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(10px) } to { opacity:1; transform:scale(1) translateY(0) } }`}</style>
        </div>
    )
}