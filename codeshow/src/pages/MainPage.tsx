import { useState, useEffect } from 'react'
import CodeEditor from '../components/Editor/CodeEditor'
import MemoryCanvas from '../components/Visualizer/MemoryCanvas'
import { useAppStore } from '../store/useAppStore'
import { mockAnalyze } from '../api/analyze'

export default function MainPage({ onGoToSaveList }: { onGoToSaveList: () => void }) {
    const {
        user, isGuest, code, language, setLanguage,
        steps, currentStep, setSteps, nextStep, prevStep,
        isAnalyzing, setIsAnalyzing, resetSteps
    } = useAppStore()

    const [isAutoPlaying, setIsAutoPlaying] = useState(false)
    const [toast, setToast] = useState('')

    // 자동 재생
    useEffect(() => {
        if (!isAutoPlaying) return
        if (currentStep >= steps.length - 1) { setIsAutoPlaying(false); return }
        const t = setTimeout(() => nextStep(), 900)
        return () => clearTimeout(t)
    }, [isAutoPlaying, currentStep])

    const showToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(''), 3000)
    }

    const handleAnalyze = async () => {
        if (!code.trim()) { showToast('⚠️ 코드를 입력해주세요'); return }
        setIsAnalyzing(true)
        resetSteps()
        try {
            const result = await mockAnalyze(language) // 백엔드 연동 시 analyzeCode()로 교체
            setSteps(result)
            nextStep()
            showToast('✅ 분석 완료!')
        } catch {
            showToast('❌ 분석 중 오류가 발생했습니다')
        } finally {
            setIsAnalyzing(false)
        }
    }

    const handleSave = () => {
        if (!steps.length) { showToast('⚠️ 저장할 애니메이션이 없습니다'); return }
        if (isGuest) {
            const data = { code, language, steps, savedAt: new Date().toISOString() }
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
            const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
            a.download = 'codeshow.json'; a.click()
            showToast('💾 JSON으로 저장됨 (비회원)')
        } else {
            showToast('✅ 저장되었습니다!')
        }
    }

    const step = steps[currentStep]

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: '#0d0f14', color: '#e8eaf0', fontFamily: 'Pretendard, sans-serif' }}>

            {/* HEADER */}
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: '56px', background: '#13161e', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src="/CodeShow.png" alt="CodeShow" style={{ width: 35, height: 35, borderRadius: '8px' }} />
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '16px', letterSpacing: '-0.02em' }}>
                            Code<span style={{ color: '#6c8cff' }}>Show</span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#7a8099' }}>메모리 시각화 도구</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* 언어 탭 */}
                    {['java', 'python', 'c'].map(lang => (
                        <button key={lang} onClick={() => { setLanguage(lang); resetSteps() }}
                            style={{
                                padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                                border: `1px solid ${language === lang ? '#6c8cff' : 'rgba(255,255,255,0.08)'}`,
                                background: language === lang ? 'rgba(108,140,255,0.1)' : 'transparent',
                                color: language === lang ? '#6c8cff' : '#7a8099',
                                transition: 'all 0.18s ease'
                            }}>
                            {lang.toUpperCase()}
                        </button>
                    ))}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: '#1e2330', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '999px', fontSize: '12px' }}>
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#6c8cff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#fff' }}>
                            {user ? user.user_name[0].toUpperCase() : 'G'}
                        </div>
                        {user ? user.user_name : '비회원'}
                    </div>
                    <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: '#1e2330', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', color: '#e8eaf0', transition: 'all 0.18s ease' }}>
                        💾 저장
                    </button>
                    <button onClick={onGoToSaveList} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'rgba(108, 140, 255, 0.12)', border: '1px solid rgba(108, 140, 255, 0.2)', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', color: '#6c8cff', transition: 'all 0.18s ease' }}>
                        📂 저장목록
                    </button>
                    <button onClick={handleAnalyze} disabled={isAnalyzing}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 16px', background: '#6c8cff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: '#fff', transition: 'all 0.18s ease', opacity: isAnalyzing ? 0.7 : 1 }}>
                        {isAnalyzing ? '⏳ 분석 중...' : '▶ 분석 실행'}
                    </button>
                </div>
            </header>

            {/* STEP BAR */}
            {steps.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 24px', background: '#181c26', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '11px', color: '#7a8099', textTransform: 'uppercase', letterSpacing: '0.08em' }}>단계</span>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '16px', fontWeight: 700, color: '#6c8cff' }}>{currentStep + 1} / {steps.length}</span>
                        <span style={{ fontSize: '13px', color: '#7a8099', paddingLeft: '16px', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>{step?.desc}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={prevStep} disabled={currentStep <= 0}
                            style={{ padding: '4px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: '#e8eaf0', fontSize: '12px', cursor: 'pointer', opacity: currentStep <= 0 ? 0.3 : 1 }}>◀ 이전</button>
                        <button onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                            style={{ padding: '4px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: '#e8eaf0', fontSize: '12px', cursor: 'pointer' }}>
                            {isAutoPlaying ? '⏸ 정지' : '▶ 자동'}
                        </button>
                        <button onClick={nextStep} disabled={currentStep >= steps.length - 1}
                            style={{ padding: '4px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: '#e8eaf0', fontSize: '12px', cursor: 'pointer', opacity: currentStep >= steps.length - 1 ? 0.3 : 1 }}>다음 ▶</button>
                    </div>
                </div>
            )}

            {/* MAIN */}
            <main style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, overflow: 'hidden' }}>
                {/* 에디터 */}
                <div style={{ borderRight: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '8px 16px', background: '#181c26', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '11px', fontWeight: 600, color: '#7a8099', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        🟣 코드 편집기
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <CodeEditor />
                    </div>
                </div>

                {/* 시각화 */}
                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: '8px 16px', background: '#181c26', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '11px', fontWeight: 600, color: '#7a8099', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        🟢 메모리 시각화
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <MemoryCanvas />
                    </div>

                    {/* AI 설명 */}
                    {step?.explanation && (
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: '#13161e', padding: '12px 16px', flexShrink: 0 }}>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: '#6c8cff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                                🤖 AI 설명
                            </div>
                            <div style={{ fontSize: '13px', color: '#7a8099', lineHeight: 1.7 }}>
                                {step.explanation}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* TOAST */}
            {toast && (
                <div style={{
                    position: 'fixed', bottom: '24px', right: '24px',
                    background: '#13161e', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px', padding: '10px 16px', fontSize: '13px',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.5)', zIndex: 999,
                    animation: 'fadeIn 0.3s ease'
                }}>
                    {toast}
                </div>
            )}
            <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }`}</style>
        </div>
    )
}