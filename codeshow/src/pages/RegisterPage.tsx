import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

interface Props {
    onDone: () => void;
    onBack: () => void;
}

export default function RegisterPage({ onDone, onBack }: Props) {
    const setUser = useAppStore((s) => s.setUser)
    const setIsGuest = useAppStore((s) => s.setIsGuest)
    
    const [email, setEmail] = useState('')
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [error, setError] = useState('')

    const handleRegister = () => {
        if (!email || !userName || !password) {
            setError('모든 필드를 입력해주세요.')
            return
        }
        if (password !== passwordConfirm) {
            setError('비밀번호가 일치하지 않습니다.')
            return
        }

        // 회원가입 성공 처리 (스토어에 저장)
        setUser({ user_id: Date.now(), user_name: userName, login_id: email, isMember: true })
        setIsGuest(false)
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
                    <div style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff' }}>계정 <span style={{ color: '#6c8cff' }}>생성</span></div>
                    <div style={{ fontSize: '13px', color: '#7a8099', marginTop: '4px' }}>CodeShow의 회원이 되어 데이터를 저장하세요</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#7a8099', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>이메일 주소</div>
                        <input value={email} onChange={e => setEmail(e.target.value)}
                            placeholder="example@email.com"
                            style={{ width: '100%', padding: '10px 14px', background: '#1e2330', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '14px', color: '#e8eaf0', outline: 'none', fontFamily: 'inherit' }} />
                    </div>

                    <div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#7a8099', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>이름</div>
                        <input value={userName} onChange={e => setUserName(e.target.value)}
                            placeholder="홍길동"
                            style={{ width: '100%', padding: '10px 14px', background: '#1e2330', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '14px', color: '#e8eaf0', outline: 'none', fontFamily: 'inherit' }} />
                    </div>

                    <div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#7a8099', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>비밀번호</div>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                            placeholder="8자 이상 입력"
                            style={{ width: '100%', padding: '10px 14px', background: '#1e2330', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '14px', color: '#e8eaf0', outline: 'none', fontFamily: 'inherit' }} />
                    </div>

                    <div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#7a8099', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>비밀번호 확인</div>
                        <input type="password" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)}
                            placeholder="한 번 더 입력"
                            style={{ width: '100%', padding: '10px 14px', background: '#1e2330', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '14px', color: '#e8eaf0', outline: 'none', fontFamily: 'inherit' }} />
                    </div>

                    {error && <div style={{ fontSize: '12px', color: '#ff6b6b', textAlign: 'center' }}>{error}</div>}

                    <button onClick={handleRegister} style={{
                        width: '100%', padding: '12px', background: '#6c8cff', border: 'none',
                        borderRadius: '10px', fontSize: '15px', fontWeight: 600, color: '#fff', cursor: 'pointer',
                        marginTop: '8px'
                    }}>회원가입 완료</button>

                    <button onClick={onBack} style={{
                        width: '100%', padding: '10px', background: 'none', border: 'none',
                        fontSize: '13px', color: '#7a8099', cursor: 'pointer', textDecoration: 'underline'
                    }}>이미 계정이 있으신가요? 로그인하기</button>
                </div>
            </div>
            <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(10px) } to { opacity:1; transform:scale(1) translateY(0) } }`}</style>
        </div>
    )
}