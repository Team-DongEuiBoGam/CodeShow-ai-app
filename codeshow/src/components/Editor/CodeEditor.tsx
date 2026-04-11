import Editor from '@monaco-editor/react'
import { useAppStore } from '../../store/useAppStore'

const LANG_MAP: Record<string, string> = {
    java: 'java',
    python: 'python',
    c: 'c'
}

export default function CodeEditor() {
    const { code, setCode, language, currentStep, steps } = useAppStore()

    const highlightLine = currentStep >= 0 ? steps[currentStep]?.line : undefined

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Editor
                height="100%"
                language={LANG_MAP[language] || 'java'}
                value={code}
                onChange={(val: string | undefined) => setCode(val || '')}
                theme="vs-dark"
                options={{
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    fontLigatures: true,
                    minimap: { enabled: false },
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    padding: { top: 16, bottom: 16 },
                    automaticLayout: true,
                    renderLineHighlight: 'all',
                    cursorBlinking: 'smooth',
                    smoothScrolling: true,
                }}
                onMount={(editor: any, monaco: any) => {
                    // 현재 실행 줄 하이라이트
                    if (highlightLine) {
                        editor.revealLineInCenter(highlightLine)
                        editor.deltaDecorations([], [{
                            range: new monaco.Range(highlightLine, 1, highlightLine, 1),
                            options: {
                                isWholeLine: true,
                                className: 'current-line-highlight',
                            }
                        }])
                    }
                }}
            />
        </div>
    )
}