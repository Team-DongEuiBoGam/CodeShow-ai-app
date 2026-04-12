import { useEffect, useState } from 'react'
import { getMe } from '../api/analyze'
import { useAppStore } from '../store/useAppStore'

interface Props {
    onBack: () => void
    onGoToSaveList: () => void
}

interface MeResponse {
    userId: number | null
    loginId: string | null
    username: string
    role: 'USER' | 'GUEST' | string
}

export default function Mypage({ onBack, onGoToSaveList }: Props) {
    const { user, logout } = useAppStore()

    const [me, setMe] = useState<MeResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchMe = async () => {
            if (!user?.token) {
                setError('로그인이 필요합니다.')
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError('')
                const data = await getMe(user.token)
                setMe(data)
            } catch {
                setError('내 정보를 불러오지 못했습니다.')
            } finally {
                setLoading(false)
            }
        }

        fetchMe()
    }, [user])

    const handleLogout = () => {
        logout()
        window.location.reload()
    }

    const roleLabel =
        me?.role === 'USER' ? '회원' : me?.role === 'GUEST' ? '비회원' : '-'

    const canSave = me?.role === 'USER'

    return (
        <div
            style={{
                minHeight: '100dvh',
                background: '#0d0f14',
                color: '#e8eaf0',
                fontFamily: 'Pretendard, sans-serif',
                padding: '24px'
            }}
        >
            <div
                style={{
                    maxWidth: '760px',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <h1 style={{ margin: 0, fontSize: '28px' }}>마이페이지</h1>

                    <button
                        onClick={onBack}
                        style={{
                            padding: '8px 14px',
                            background: '#1e2330',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '10px',
                            color: '#e8eaf0',
                            cursor: 'pointer'
                        }}
                    >
                        ← 메인으로
                    </button>
                </div>

                {loading && (
                    <div
                        style={{
                            background: '#13161e',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '16px',
                            padding: '24px'
                        }}
                    >
                        불러오는 중...
                    </div>
                )}

                {!loading && error && (
                    <div
                        style={{
                            background: 'rgba(252,129,129,0.08)',
                            border: '1px solid rgba(252,129,129,0.25)',
                            borderRadius: '16px',
                            padding: '24px',
                            color: '#ff9a9a'
                        }}
                    >
                        {error}
                    </div>
                )}

                {!loading && !error && me && (
                    <>
                        <div
                            style={{
                                background: '#13161e',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '20px',
                                padding: '28px'
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    marginBottom: '24px'
                                }}
                            >
                                <div
                                    style={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '50%',
                                        background: '#6c8cff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '22px',
                                        fontWeight: 700,
                                        color: '#fff'
                                    }}
                                >
                                    {me.username?.[0]?.toUpperCase() ?? 'U'}
                                </div>

                                <div>
                                    <div style={{ fontSize: '22px', fontWeight: 700 }}>{me.username}</div>
                                    <div style={{ fontSize: '13px', color: '#8b93ad', marginTop: '4px' }}>
                                        {roleLabel} 계정
                                    </div>
                                </div>
                            </div>

                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '140px 1fr',
                                    rowGap: '14px',
                                    columnGap: '16px',
                                    fontSize: '14px'
                                }}
                            >
                                <div style={{ color: '#8b93ad' }}>이름</div>
                                <div>{me.username}</div>

                                <div style={{ color: '#8b93ad' }}>로그인 아이디</div>
                                <div>{me.loginId ?? '-'}</div>

                                <div style={{ color: '#8b93ad' }}>권한</div>
                                <div>{me.role}</div>

                                <div style={{ color: '#8b93ad' }}>저장 기능</div>
                                <div>{canSave ? '사용 가능' : '회원만 사용 가능'}</div>
                            </div>
                        </div>

                        <div
                            style={{
                                background: '#13161e',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '20px',
                                padding: '28px'
                            }}
                        >
                            <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
                                빠른 이동
                            </div>

                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <button
                                    onClick={onGoToSaveList}
                                    style={{
                                        padding: '12px 16px',
                                        background: 'rgba(108,140,255,0.14)',
                                        border: '1px solid rgba(108,140,255,0.25)',
                                        borderRadius: '12px',
                                        color: '#6c8cff',
                                        cursor: 'pointer',
                                        fontWeight: 600
                                    }}
                                >
                                    📂 저장목록 보기
                                </button>

                                <button
                                    onClick={handleLogout}
                                    style={{
                                        padding: '12px 16px',
                                        background: 'transparent',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        color: '#ff9a9a',
                                        cursor: 'pointer',
                                        fontWeight: 600
                                    }}
                                >
                                    ↩ 로그아웃
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}