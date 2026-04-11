import type { CSSProperties } from 'react'
import { useAppStore } from '../store/useAppStore'
import type { SavedAnimation } from '../types/memory'
// 가상의 API 호출 함수입니다. 나중에 실제 api 파일과 연동하세요.
// import { fetchAnimations } from '../api/analyze' 

export default function AnimationListPage({ onBack }: { onBack: () => void }) {
    const user = useAppStore((s) => s.user)
    const animations: SavedAnimation[] = useAppStore((s) => s.savedAnimations)

    // 공통 카드 스타일
    const cardStyle: CSSProperties = {
        background: '#1e2330', // 입력창과 같은 배경색
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '24px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        animation: 'modalIn 0.35s cubic-bezier(0.16,1,0.3,1)'
    }

    const tagStyle: CSSProperties = {
        fontSize: '11px',
        fontWeight: 600,
        color: '#ffffff',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        background: 'rgba(108, 140, 255, 0.2)', // 브랜드 컬러 블러 처리
        padding: '4px 8px',
        borderRadius: '6px',
        alignSelf: 'flex-start'
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#13161e',
            fontFamily: 'Pretendard, sans-serif',
            padding: '40px 20px',
            color: '#e8eaf0'
        }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                {/* 헤더 섹션 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <div style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em' }}>
                            코드 저장 <span style={{ color: '#6c8cff' }}>목록</span>
                        </div>
                        <div style={{ fontSize: '14px', color: '#7a8099', marginTop: '6px' }}>
                            내가 만든 시뮬레이션을 다시 확인해보세요
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={onBack} style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', background: '#1e2330', color: '#e8eaf0', cursor: 'pointer', fontSize: '13px' }}>
                            ← 돌아가기
                        </button>
                    </div>
                </div>

                {/* 리스트 그리드 (3열) */}
                {animations.length === 0 ? (
                    // 데이터 없음 (Empty State)
                    <div style={{ textAlign: 'center', padding: '100px 20px', color: '#7a8099', border: '2px dashed rgba(255,255,255,0.05)', borderRadius: '16px' }}>
                        아직 저장된 코드 애니메이션이 없어요.<br />첫 프로젝트를 저장해보세요!
                    </div>
                ) : (
                    // 실제 리스트 표시
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                        {animations.map((item) => (
                            <div key={item.animation_code} style={cardStyle}>
                                {/* 언어 태그 */}
                                <div style={tagStyle}>{item.language_id === 1 ? 'Java' : item.language_id === 2 ? 'Python' : 'C'}</div>
                                
                                {/* 제목 */}
                                <div style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', lineHeight: 1.4, margin: '4px 0' }}>
                                    {item.animation_name}
                                </div>
                                
                                {/* 메타 데이터 (생성일, 생성자) */}
                                <div style={{ fontSize: '12px', color: '#7a8099', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{user?.user_name || 'Unknown'}</span>
                                    <span>{new Date(item.create_date).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* 리스트 로드 애니메이션 효과 추가 */}
            <style>{`
                @keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(10px) } to { opacity:1; transform:scale(1) translateY(0) } } 
                div Grid > div:hover { transform: translateY(-4px); border-color: rgba(108,140,255,0.5); box-shadow: 0 10px 30px rgba(108,140,255,0.15); }
            `}</style>
        </div>
    )
}