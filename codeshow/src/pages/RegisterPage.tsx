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

        setUser({ user_id: Date.now(), user_name: userName, login_id: email, isMember: true })
        setIsGuest(false)
        onDone()
    }


    // 공통 스타일 정의 (대칭 및 일관성)
    const containerStyle: React.CSSProperties = {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxSizing: 'border-box'
    };

    const inputWrapperStyle: React.CSSProperties = {
        width: '100%',
        boxSizing: 'border-box'
    };

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
        boxSizing: 'border-box' // 테두리가 너비에 영향을 주지 않도록 설정
    };

    const labelStyle: React.CSSProperties = {
        fontSize: '11px',
        fontWeight: 600,
        color: '#7a8099',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: '6px',
        paddingLeft: '4px'
    };

    const primaryButtonStyle: React.CSSProperties = {
        width: '100%',
        padding: '14px',
        background: '#6c8cff',
        border: 'none',
        borderRadius: '12px',
        fontSize: '15px',
        fontWeight: 600,
        color: '#fff',
        cursor: 'pointer',
        marginTop: '8px',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
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
                padding: '40px', width: '100%', maxWidth: '420px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                animation: 'modalIn 0.35s cubic-bezier(0.16,1,0.3,1)',
                boxSizing: 'border-box'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                        계정 <span style={{ color: '#6c8cff' }}>생성</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#7a8099', marginTop: '6px' }}>
                        CodeShow의 회원이 되어 데이터를 저장하세요
                    </div>
                </div>

                <div style={containerStyle}>
                    <div style={inputWrapperStyle}>
                        <div style={labelStyle}>이메일 주소</div>
                        <input value={email} onChange={e => setEmail(e.target.value)}
                            placeholder="example@email.com" style={inputStyle} />
                    </div>

                    <div style={inputWrapperStyle}>
                        <div style={labelStyle}>이름</div>
                        <input value={userName} onChange={e => setUserName(e.target.value)}
                            placeholder="홍길동" style={inputStyle} />
                    </div>

                    <div style={inputWrapperStyle}>
                        <div style={labelStyle}>비밀번호</div>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                            placeholder="8자 이상 입력" style={inputStyle} />
                    </div>

                    <div style={inputWrapperStyle}>
                        <div style={labelStyle}>비밀번호 확인</div>
                        <input type="password" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)}
                            placeholder="한 번 더 입력" style={inputStyle} />
                    </div>

                    {error && (
                        <div style={{ 
                            fontSize: '12px', color: '#ff6b6b', textAlign: 'center', 
                            background: 'rgba(255,107,107,0.1)', padding: '8px', borderRadius: '8px' 
                        }}>
                            {error}
                        </div>
                    )}

                    <button onClick={handleRegister} style={primaryButtonStyle}>
                        회원가입 완료
                    </button>

                    <button onClick={onBack} style={{
                        width: '100%', background: 'none', border: 'none',
                        fontSize: '13px', color: '#7a8099', cursor: 'pointer', 
                        textDecoration: 'underline', marginTop: '4px'
                    }}>
                        이미 계정이 있으신가요? 로그인하기
                    </button>
                </div>
            </div>
            <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(10px) } to { opacity:1; transform:scale(1) translateY(0) } }`}</style>
        </div>
    )
}