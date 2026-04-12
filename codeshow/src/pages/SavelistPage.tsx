import { useEffect, useState } from 'react'
import { getAnimationList, getAnimationDetail } from '../api/analyze'
import type { AnimationSummary, Step } from '../types/memory'
import { useAppStore } from '../store/useAppStore'

interface Props {
    onBack: () => void
}

export default function SavelistPage({ onBack }: Props) {
    const [list, setList] = useState<AnimationSummary[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedId, setSelectedId] = useState<number | null>(null)

    const {
        user,
        setCode,
        setSteps,
        setCurrentStep,
        setLanguage
    } = useAppStore()

    useEffect(() => {
        const fetchList = async () => {
            if (!user?.token) {
                setError('로그인이 필요합니다.')
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError('')
                const data = await getAnimationList(0, 10, user.token)
                setList(data)
            } catch {
                setError('저장 목록을 불러오지 못했습니다.')
            } finally {
                setLoading(false)
            }
        }

        fetchList()
    }, [user])

    const handleOpenDetail = async (animationId: number) => {
        if (!user?.token) {
            setError('로그인이 필요합니다.')
            return
        }

        try {
            setSelectedId(animationId)
            setError('')

            const detail = await getAnimationDetail(animationId, user.token)
            const parsedSteps: Step[] = JSON.parse(detail.jsonData)

            setCode(detail.originalCode)
            setSteps(parsedSteps)
            setCurrentStep(parsedSteps.length > 0 ? 0 : -1)

            if (detail.languageName) {
                const lower = detail.languageName.toLowerCase()
                if (lower.includes('java')) setLanguage('java')
                else if (lower.includes('python')) setLanguage('python')
                else if (lower === 'c' || lower.includes('c ')) setLanguage('c')
            }

            onBack()
        } catch {
            setError('상세 데이터를 불러오지 못했습니다.')
        } finally {
            setSelectedId(null)
        }
    }

    return (
        <div style={{ padding: '24px', color: '#fff' }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}
            >
                <h1 style={{ margin: 0 }}>저장된 애니메이션</h1>
                <button onClick={onBack}>메인으로</button>
            </div>

            {loading && <div>불러오는 중...</div>}
            {error && <div style={{ color: '#ff8a8a', marginBottom: '16px' }}>{error}</div>}

            {!loading && !error && list.length === 0 && (
                <div>저장된 애니메이션이 없습니다.</div>
            )}

            <div style={{ display: 'grid', gap: '12px' }}>
                {list.map((item) => (
                    <div
                        key={item.animationId}
                        onClick={() => handleOpenDetail(item.animationId)}
                        style={{
                            padding: '16px',
                            borderRadius: '12px',
                            background: '#1a1f2b',
                            border: '1px solid rgba(255,255,255,0.08)',
                            cursor: 'pointer'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '8px',
                                gap: '12px'
                            }}
                        >
                            <strong>{item.animationName}</strong>
                            <span style={{ color: '#8fa1c7', fontSize: '13px' }}>
                                {selectedId === item.animationId ? '불러오는 중...' : item.languageName}
                            </span>
                        </div>

                        <div style={{ fontSize: '13px', color: '#a0aec0' }}>
                            작성자: {item.creatorUsername}
                        </div>
                        <div style={{ fontSize: '13px', color: '#718096', marginTop: '4px' }}>
                            생성일: {item.createdAt}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}