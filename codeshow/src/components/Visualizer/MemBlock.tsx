import { motion } from 'framer-motion'
import type { MemBlock as MemBlockType } from '../../types/memory'

interface Props {
    block: MemBlockType
    isHeap?: boolean
}

export default function MemBlock({ block, isHeap = false }: Props) {
    return (
        <motion.div
            id={`block-${block.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 16px',
                borderRadius: '10px',
                border: `1px solid ${block.highlight
                    ? '#6c8cff'
                    : block.gcTarget
                        ? 'rgba(252,129,129,0.5)'
                        : isHeap
                            ? 'rgba(104,211,145,0.35)'
                            : 'rgba(99,179,237,0.35)'}`,
                background: block.highlight
                    ? 'rgba(108,140,255,0.12)'
                    : block.gcTarget
                        ? 'rgba(252,129,129,0.07)'
                        : isHeap
                            ? 'rgba(104,211,145,0.08)'
                            : 'rgba(99,179,237,0.08)',
                boxShadow: block.highlight ? '0 0 0 2px rgba(108,140,255,0.2)' : 'none',
                opacity: block.gcTarget ? 0.5 : 1,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '14px',
                transition: 'all 0.3s ease',
            }}
        >
            {/* 왼쪽: 이름 + 타입 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: isHeap ? '#68d391' : '#63b3ed', fontWeight: 500 }}>
                    {block.name}
                </span>
                <span style={{
                    fontSize: '11px',
                    color: '#404560',
                    background: '#1e2330',
                    padding: '2px 6px',
                    borderRadius: '4px',
                }}>
                    {block.type}
                </span>
                {block.gcTarget && (
                    <span style={{
                        fontSize: '11px', color: '#fc8181',
                        background: 'rgba(252,129,129,0.15)',
                        padding: '2px 6px', borderRadius: '4px'
                    }}>
                        GC 대상
                    </span>
                )}
            </div>

            {/* 오른쪽: 값 */}
            <div style={{ fontWeight: 600, color: '#e8eaf0' }}>
                {block.isRef ? (
                    <span style={{ color: '#fc8181', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        🔗 {block.value}
                    </span>
                ) : (
                    block.value
                )}
            </div>
        </motion.div>
    )
}