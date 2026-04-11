import axios from 'axios'
import type { Step } from '../types/memory'

// 백엔드 URL (나중에 실제 주소로 교체)
const BASE_URL = 'http://localhost:8000'

// ── 코드 분석 요청 ──
export const analyzeCode = async (code: string, language: string): Promise<Step[]> => {
    const res = await axios.post(`${BASE_URL}/api/analyze`, { code, language })
    return res.data
}

export const signup = async (loginId: string, password: string, username: string) => {
    const res = await axios.post(`${BASE_URL}/api/auth/signup`, {
        loginId,
        password,
        username
    })
    return res.data
}

// ── 로그인 ──
export const login = async (login_id: string, password: string) => {
    const res = await axios.post(`${BASE_URL}/api/auth/login`, {
        loginId: login_id,   // ✅ camelCase로 수정
        password
    })
    return res.data
}

// ── 비회원 로그인 ──
export const guestLogin = async () => {
    const res = await axios.post(`${BASE_URL}/api/auth/guest-login`)
    return res.data
}

// ── 애니메이션 저장 ──
export const saveAnimation = async (
    user_id: number,
    language_id: number,
    animation_name: string,
    original_code: string,
    json_data: Step[],
    token: string
) => {
    const res = await axios.post(
        `${BASE_URL}/api/animation/save`,
        { user_id, language_id, animation_name, original_code, json_data },
        { headers: { Authorization: `Bearer ${token}` } }
    )
    return res.data
}

// ── 저장 목록 불러오기 ──
export const getAnimationList = async (user_id: number, token: string) => {
    const res = await axios.get(`${BASE_URL}/api/animation/list`, {
        params: { user_id },
        headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
}

// ── 언어 목록 ──
export const getLanguages = async () => {
    const res = await axios.get(`${BASE_URL}/api/languages`)
    return res.data
}

// ── Mock 데이터 (백엔드 없을 때 테스트용) ──
export const mockAnalyze = async (language: string): Promise<Step[]> => {
    await new Promise(r => setTimeout(r, 800))
    const mock: Record<string, Step[]> = {
        java: [
            {
                step: 1, line: 1, desc: '정수형 변수 선언',
                explanation: 'int a = 10; — 정수형 변수 a가 스택(Stack)에 할당됩니다. 원시 타입은 값 자체가 스택에 직접 저장됩니다.',
                stack: [{ id: 'a', name: 'a', value: '10', type: 'int' }],
                heap: [], arrows: []
            },
            {
                step: 2, line: 2, desc: '참조 타입 객체 생성',
                explanation: 'new String("Hello") — str 변수는 스택에, 실제 객체는 힙(Heap)에 저장됩니다. str에는 힙 주소(참조값)가 저장됩니다.',
                stack: [
                    { id: 'a', name: 'a', value: '10', type: 'int' },
                    { id: 'str', name: 'str', value: '0x7F2 (참조)', type: 'String', isRef: true, refTarget: 'heap_0' }
                ],
                heap: [{ id: 'heap_0', name: '"Hello"', value: 'Hello', type: 'String' }],
                arrows: [{ from: 'str', to: 'heap_0' }]
            },
            {
                step: 3, line: 3, desc: '값 복사',
                explanation: 'int b = a; — 원시 타입은 값이 복사됩니다. b는 a의 값 10을 복사해 독립적인 변수가 됩니다.',
                stack: [
                    { id: 'a', name: 'a', value: '10', type: 'int' },
                    { id: 'str', name: 'str', value: '0x7F2 (참조)', type: 'String', isRef: true, refTarget: 'heap_0' },
                    { id: 'b', name: 'b', value: '10', type: 'int', highlight: true }
                ],
                heap: [{ id: 'heap_0', name: '"Hello"', value: 'Hello', type: 'String' }],
                arrows: [{ from: 'str', to: 'heap_0' }]
            }
        ]
    }
    return mock[language] || mock.java
}