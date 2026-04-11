import { useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/useAppStore'
import MemBlock from './MemBlock'

export default function MemoryCanvas() {
    const { steps, currentStep } = useAppStore()
    const svgRef = useRef<SVGSVGElement>(null)
    const canvasRef = useRef<HTMLDivElement>(null)

    const step = steps[currentStep]

    // 화살표 그리기
    useEffect(() => {
        if (!svgRef.current || !canvasRef.current || !step) return
        const svg = svgRef.current
        svg.innerHTML = ''

        if (!step.arrows?.length) return

        // arrowhead marker
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker')
        marker.setAttribute('id', 'arrow')
        marker.setAttribute('markerWidth', '10')
        marker.setAttribute('markerHeight', '7')
        marker.setAttribute('refX', '10')
        marker.setAttribute('refY', '3.5')
        marker.setAttribute('orient', 'auto')
        const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
        poly.setAttribute('points', '0 0, 10 3.5, 0 7')
        poly.setAttribute('fill', '#fc8181')
        marker.appendChild(poly)
        defs.appendChild(marker)
        svg.appendChild(defs)

        const canvasRect = canvasRef.current.getBoundingClientRect()

        step.arrows.forEach(({ from, to }) => {
            const fromEl = document.getElementById(`block-${from}`)
            const toEl = document.getElementById(`block-${to}`)
            if (!fromEl || !toEl) return

            const fr = fromEl.getBoundingClientRect()
            const tr = toEl.getBoundingClientRect()
            const scrollTop = canvasRef.current!.scrollTop

            const x1 = fr.right - canvasRect.left + 6
            const y1 = fr.top - canvasRect.top + fr.height / 2 + scrollTop
            const x2 = tr.left - canvasRect.left - 6
            const y2 = tr.top - canvasRect.top + tr.height / 2 + scrollTop
            const cx = (x1 + x2) / 2

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
            path.setAttribute('d', `M${x1},${y1} C${cx + 30},${y1} ${cx - 30},${y2} ${x2},${y2}`)
            path.setAttribute('stroke', '#fc8181')
            path.setAttribute('stroke-width', '2')
            path.setAttribute('fill', 'none')
            path.setAttribute('marker-end', 'url(#arrow)')
            path.style.strokeDasharray = '200'
            path.style.strokeDashoffset = '200'
            path.style.animation = 'drawArrow 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s forwards'
            svg.appendChild(path)
        })
    }, [step, currentStep])

    // 빈 상태
    if (currentStep < 0 || !step) {
        return (
            <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                height: '100%', gap: '16px', color: '#404560'
            }}>
                <div style={{ fontSize: '48px' }}>🧠</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#7a8099' }}>메모리가 비어있어요</div>
                <div style={{ fontSize: '14px', textAlign: 'center', lineHeight: 1.6 }}>
                    왼쪽에 코드를 입력하고<br /><strong style={{ color: '#6c8cff' }}>분석 실행</strong> 버튼을 눌러보세요
                </div>
            </div>
        )
    }

    return (
        <div ref={canvasRef} style={{ position: 'relative', height: '100%', overflowY: 'auto', padding: '24px' }}>
            <style>{`
        @keyframes drawArrow { to { stroke-dashoffset: 0; } }
        .gc-block { opacity: 0.5; border-style: dashed !important; }
      `}</style>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* STACK */}
                <div style={{
                    background: '#13161e', borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        padding: '10px 16px', background: 'rgba(99,179,237,0.08)',
                        borderBottom: '1px solid rgba(99,179,237,0.35)',
                        color: '#63b3ed', fontSize: '12px', fontWeight: 700,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                        ↑ 스택 (STACK) — 지역 변수 / 원시 타입
                    </div>
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '80px' }}>
                        <AnimatePresence>
                            {step.stack.length === 0
                                ? <div style={{ color: '#404560', fontSize: '12px' }}>스택이 비어있습니다</div>
                                : step.stack.map(b => <MemBlock key={b.id} block={b} isHeap={false} />)
                            }
                        </AnimatePresence>
                    </div>
                </div>

                {/* HEAP */}
                <div style={{
                    background: '#13161e', borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        padding: '10px 16px', background: 'rgba(104,211,145,0.08)',
                        borderBottom: '1px solid rgba(104,211,145,0.35)',
                        color: '#68d391', fontSize: '12px', fontWeight: 700,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                        ● 힙 (HEAP) — 객체 / 참조 타입
                    </div>
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '80px' }}>
                        <AnimatePresence>
                            {step.heap.length === 0
                                ? <div style={{ color: '#404560', fontSize: '12px' }}>힙이 비어있습니다</div>
                                : step.heap.map(b => <MemBlock key={b.id} block={b} isHeap={true} />)
                            }
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* SVG 화살표 레이어 */}
            <svg
                ref={svgRef}
                style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '100%', height: '100%',
                    pointerEvents: 'none', overflow: 'visible', zIndex: 10
                }}
            />
        </div>
    )
}