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

    // 이름 수정 관련 상태
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editValue, setEditValue] = useState('')

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

    // 이름 수정 시작
    const handleStartEdit = (e: React.MouseEvent, item: AnimationSummary) => {
        e.stopPropagation()
        setEditingId(item.animationId)
        setEditValue(item.animationName)
    }

    // 이름 수정 저장
    const handleSaveEdit = async (e: React.MouseEvent | React.KeyboardEvent, animationId: number) => {
        e.stopPropagation()
        if (!editValue.trim()) return

        try {
            // TODO: 실제 이름 수정 API 호출 (예: await updateAnimationName(animationId, editValue, user?.token))
            setList(prev => prev.map(item => 
                item.animationId === animationId ? { ...item, animationName: editValue } : item
            ))
            setEditingId(null)
        } catch {
            alert('이름 수정에 실패했습니다.')
        }
    }

    const handleDelete = async (e: React.MouseEvent, animationId: number) => {
        e.stopPropagation()
        if (!window.confirm('정말 삭제하시겠습니까?')) return

        try {
            setList((prev) => prev.filter((item) => item.animationId !== animationId))
        } catch {
            alert('삭제 중 오류가 발생했습니다.')
        }
    }

    const handleOpenDetail = async (animationId: number) => {
        if (editingId) return // 수정 중에는 상세 보기 방지
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
        <div style={{ 
            position: 'fixed',
            inset: 0,
            background: '#0d0f14',
            color: '#e8eaf0',
            overflowY: 'auto',
            zIndex: 100,
            fontFamily: 'Pretendard, sans-serif'
        }}>
            <div style={{ 
                maxWidth: '800px', 
                margin: '60px auto', 
                padding: '0 24px',
                animation: 'pageIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '40px'
                }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0 }}>
                            저장된 <span style={{ color: '#6c8cff' }}>애니메이션</span>
                        </h1>
                        <p style={{ color: '#7a8099', fontSize: '14px', marginTop: '6px' }}>
                            분석했던 코드들의 기록입니다
                        </p>
                    </div>
                    <button 
                        onClick={onBack}
                        className="btn-back"
                        style={{
                            background: '#1e2330',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: '#e8eaf0',
                            padding: '10px 18px',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: '0.2s'
                        }}
                    >
                        ← 메인으로
                    </button>
                </div>

                {loading && <div style={{ textAlign: 'center', padding: '60px', color: '#7a8099' }}>⏳ 기록을 불러오는 중...</div>}
                
                <div style={{ display: 'grid', gap: '16px' }}>
                    {list.map((item) => (
                        <div
                            key={item.animationId}
                            onClick={() => handleOpenDetail(item.animationId)}
                            className="save-card"
                            style={{
                                background: '#13161e',
                                borderRadius: '20px',
                                border: '1px solid rgba(255,255,255,0.08)',
                                padding: '24px',
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <div style={{ 
                                    background: 'rgba(108, 140, 255, 0.1)', 
                                    color: '#6c8cff', 
                                    padding: '4px 10px', 
                                    borderRadius: '8px', 
                                    fontSize: '11px', 
                                    fontWeight: 700,
                                    textTransform: 'uppercase'
                                }}>
                                    {item.languageName}
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {/* 수정 버튼 */}
                                    <button
                                        onClick={(e) => editingId === item.animationId ? handleSaveEdit(e, item.animationId) : handleStartEdit(e, item)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: editingId === item.animationId ? '#6c8cff' : '#7a8099',
                                            fontSize: '13px',
                                            cursor: 'pointer',
                                            padding: '4px 8px',
                                            borderRadius: '6px'
                                        }}
                                    >
                                        {editingId === item.animationId ? '저장' : '수정'}
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(e, item.animationId)}
                                        className="btn-delete"
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#7a8099',
                                            fontSize: '13px',
                                            cursor: 'pointer',
                                            padding: '4px 8px',
                                            borderRadius: '6px'
                                        }}
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                {editingId === item.animationId ? (
                                    <input 
                                        autoFocus
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(e, item.animationId)}
                                        style={{
                                            width: '100%',
                                            background: '#1e2330',
                                            border: '1px solid #6c8cff',
                                            borderRadius: '8px',
                                            padding: '8px 12px',
                                            color: '#fff',
                                            fontSize: '18px',
                                            fontWeight: 600,
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                ) : (
                                    <div style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff' }}>
                                        {selectedId === item.animationId ? '⚡ 데이터를 여는 중...' : item.animationName}
                                    </div>
                                )}
                            </div>

                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                fontSize: '13px', 
                                color: '#7a8099',
                                borderTop: '1px solid rgba(255,255,255,0.04)',
                                paddingTop: '16px'
                            }}>
                                <span>👤 {item.creatorUsername}</span>
                                <span>📅 {item.createdAt}</span>
                            </div>

                            {selectedId === item.animationId && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: '3px',
                                    background: '#6c8cff',
                                    borderRadius: '0 0 20px 20px',
                                    overflow: 'hidden'
                                }}>
                                    <div className="loading-line" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes pageIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scan {
                    from { left: -100%; }
                    to { left: 100%; }
                }
                .save-card:hover {
                    transform: scale(1.02);
                    border-color: rgba(108, 140, 255, 0.4);
                    background: #191d29;
                }
                .btn-back:hover { background: #2a3142 !important; }
                .btn-delete:hover { 
                    color: #fc8181 !important; 
                    background: rgba(252,129,129,0.1) !important; 
                }
                .loading-line {
                    position: absolute;
                    width: 50%;
                    height: 100%;
                    background: #fff;
                    animation: scan 1s infinite linear;
                }
            `}</style>
        </div>
    )
}