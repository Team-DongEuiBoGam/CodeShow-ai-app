import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

interface Props {
    onDone: () => void
    onGoToRegister: () => void 
}

export default function LoginPage({ onDone, onGoToRegister }: Props) {
    const setUser = useAppStore((s: any) => s.setUser)
    const setIsGuest = useAppStore((s: any) => s.setIsGuest)
    const [view, setView] = useState<'choice' | 'login'>('choice')
    const [loginId, setLoginId] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = (e?: React.FormEvent) => {
        if (e) e.preventDefault() 
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

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px 14px',
        background: '#1e2330',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '10px',
        fontSize: '14px',
        color: '#e8eaf0',
        outline: 'none',
        fontFamily: 'inherit',
        boxSizing: 'border-box' 
    };

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(13, 15, 20, 0.95)',
            backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, fontFamily: 'Pretendard, sans-serif'
        }}>
            <div style={{
                background: '#13161e', borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '40px', width: '100%', maxWidth: '400px',
                boxSizing: 'border-box',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                animation: 'modalIn 0.35s cubic-bezier(0.16,1,0.3,1)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <img src="/CodeShow.png" alt="CodeShow" style={{ width: 56, height: 56, borderRadius: '14px', margin: '0 auto 12px', display: 'block', boxShadow: '0 0 24px rgba(108,140,255,0.3)' }} />
                    <div style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff' }}>Code<span style={{ color: '#6c8cff' }}>Show</span></div>
                    <div style={{ fontSize: '13px', color: '#7a8099', marginTop: '4px' }}>코드의 메모리 동작을 눈으로 확인하세요</div>
                </div>

                {view === 'choice' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button onClick={() => setView('login')} style={{ width: '100%', padding: '12px', background: '#6c8cff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 600, color: '#fff', cursor: 'pointer', boxSizing: 'border-box' }}>🔐 회원 로그인</button>
                        <button onClick={handleGuest} style={{ width: '100%', padding: '12px', background: '#1e2330', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', fontSize: '15px', fontWeight: 500, color: '#e8eaf0', cursor: 'pointer', boxSizing: 'border-box' }}>👤 비회원으로 시작</button>
                        <div style={{ textAlign: 'center', fontSize: '12px', color: '#404560' }}>비회원은 애니메이션 저장이 제한됩니다</div>
                    </div>
                ) : (
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
                        <button type="button" onClick={() => setView('choice')} style={{ background: 'none', border: 'none', color: '#7a8099', fontSize: '13px', cursor: 'pointer', marginBottom: '16px', textAlign: 'left', padding: 0 }}>
                            ← 뒤로
                        </button>
                        <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: '#7a8099', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px', marginLeft: '4px' }}>이메일</div>
                            <input value={loginId} onChange={e => setLoginId(e.target.value)} placeholder="example@email.com" style={inputStyle} />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: '#7a8099', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px', marginLeft: '4px' }}>비밀번호</div>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} />
                        </div>
                        
                        <button type="submit" style={{ width: '100%', padding: '12px', background: '#6c8cff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 600, color: '#fff', cursor: 'pointer', boxSizing: 'border-box' }}>로그인</button>

                        <button type="button" onClick={onGoToRegister} style={{
                            width: '100%', padding: '12px', background: 'transparent', 
                            border: '1px solid rgba(108,140,255,0.5)', borderRadius: '10px', 
                            fontSize: '14px', fontWeight: 500, color: '#6c8cff', 
                            cursor: 'pointer', marginTop: '12px', boxSizing: 'border-box'
                        }}>
                            회원가입 하기
                        </button>
                        <div style={{ textAlign: 'center', fontSize: '12px', color: '#404560', marginTop: '10px' }}>데모 모드: 아무 값이나 입력하세요</div>
                    </form>
                )}
            </div>
            <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(10px) } to { opacity:1; transform:scale(1) translateY(0) } }`}</style>
        </div>
    )
}