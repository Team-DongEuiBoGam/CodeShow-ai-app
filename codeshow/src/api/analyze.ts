import axios from 'axios'
import type { Step, AnimationSummary, AnimationDetail, MemBlock } from '../types/memory'

const BASE_URL = 'https://codeshow-backend.onrender.com'

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 15000
})

const authHeader = (token?: string) =>
    token
        ? {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        : {}

type RawVariable = {
    name: string
    type: string
    value: string | number | boolean | null
    description?: string
}

type RawOperation = {
    operation?: string
    from?: string
    to?: string
    target?: string
    source?: string
    description?: string
}

type RawAnalyzeResponse = {
    explanation?: string
    jsonData?: {
        variables?: RawVariable[]
        operations?: RawOperation[]
    }
    steps?: Step[]
    data?: Step[] | string
    result?: Step[] | string
}

const tryParseJson = (value: string): unknown => {
    try {
        return JSON.parse(value)
    } catch {
        return value
    }
}

const stripCodeFence = (value: string) => {
    return value
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/, '')
        .trim()
}

const isStepArray = (value: unknown): value is Step[] => {
    return Array.isArray(value)
}

const inferLineNumber = (variableName: string, code: string) => {
    const lines = code.split('\n')
    const idx = lines.findIndex((line) => line.includes(variableName))
    return idx >= 0 ? idx + 1 : 1
}

const buildStepFromVariables = (
    variables: RawVariable[],
    operations: RawOperation[],
    explanation: string,
    code: string
): Step[] => {
    const steps: Step[] = []
    const stack: MemBlock[] = []
    const heap: MemBlock[] = []

    variables.forEach((variable, index) => {
        const matchedOp =
            operations.find(
                (op) => op.to === variable.name || op.target === variable.name
            ) ?? operations[index]

        const isStringObject =
            variable.type.toLowerCase() === 'string' &&
            typeof variable.value === 'string'

        if (isStringObject) {
            const heapId = `heap_${index}`

            heap.push({
                id: heapId,
                name: `"${String(variable.value)}"`,
                value: String(variable.value),
                type: variable.type
            })

            stack.push({
                id: variable.name,
                name: variable.name,
                value: `${heapId} (참조)`,
                type: variable.type,
                isRef: true,
                refTarget: heapId,
                highlight: true
            })
        } else {
            stack.push({
                id: variable.name,
                name: variable.name,
                value: String(variable.value),
                type: variable.type,
                highlight: true
            })
        }

        const stepStack = stack.map((item) => ({
            ...item,
            highlight: item.id === variable.name
        }))

        const stepHeap = heap.map((item) => ({
            ...item,
            highlight:
                stack.find((s) => s.id === variable.name)?.refTarget === item.id
        }))

        const currentVar = stepStack.find((s) => s.id === variable.name)

        steps.push({
            step: index + 1,
            line: inferLineNumber(variable.name, code),
            desc:
                matchedOp?.description ||
                variable.description ||
                `${variable.name} 변수 생성`,
            explanation,
            stack: stepStack,
            heap: stepHeap,
            arrows:
                currentVar?.isRef && currentVar.refTarget
                    ? [{ from: currentVar.id, to: currentVar.refTarget }]
                    : []
        })
    })

    return steps
}

const normalizeAnalyzeResponse = (data: unknown, code: string): Step[] => {
    if (isStepArray(data)) {
        return data
    }

    let parsed: unknown = data

    if (typeof parsed === 'string') {
        parsed = tryParseJson(stripCodeFence(parsed))
    }

    if (typeof parsed === 'string') {
        parsed = tryParseJson(stripCodeFence(parsed))
    }

    if (parsed && typeof parsed === 'object') {
        const obj = parsed as Record<string, unknown>

        if (isStepArray(obj.steps)) return obj.steps
        if (isStepArray(obj.data)) return obj.data
        if (isStepArray(obj.result)) return obj.result

        if (typeof obj.data === 'string') {
            const reparsed = tryParseJson(stripCodeFence(obj.data))
            if (isStepArray(reparsed)) return reparsed
        }

        if (typeof obj.result === 'string') {
            const reparsed = tryParseJson(stripCodeFence(obj.result))
            if (isStepArray(reparsed)) return reparsed
        }

        const raw = parsed as RawAnalyzeResponse

        if (raw.jsonData?.variables && Array.isArray(raw.jsonData.variables)) {
            return buildStepFromVariables(
                raw.jsonData.variables,
                raw.jsonData.operations ?? [],
                raw.explanation ?? 'AI 분석 결과입니다.',
                code
            )
        }
    }

    throw new Error('분석 응답 형식이 올바르지 않습니다.')
}

// ── 코드 분석 요청 ──
export const analyzeCode = async (
    code: string,
    language: string,
    token?: string
): Promise<Step[]> => {
    void language

    try {
        const res = await api.post(
            '/api/ai/analyze',
            JSON.stringify(code),
            {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                }
            }
        )

        return normalizeAnalyzeResponse(res.data, code)
    } catch (error: any) {
        if (error.response?.status === 401) {
            throw new Error('인증이 필요합니다. 다시 로그인하거나 게스트 로그인 후 시도해주세요.')
        }

        throw error
    }
}

// ── 회원가입 ──
export const signup = async (loginId: string, password: string, username: string) => {
    const res = await api.post('/api/auth/signup', {
        loginId,
        password,
        username
    })
    return res.data
}

// ── 로그인 ──
export const login = async (loginId: string, password: string) => {
    const res = await api.post('/api/auth/login', {
        loginId,
        password
    })
    return res.data
}

// ── 비회원 로그인 ──
export const guestLogin = async () => {
    const res = await api.post('/api/auth/guest-login')
    return res.data
}

// ── 애니메이션 저장 ──
export const saveAnimation = async (
    animationName: string,
    originalCode: string,
    languageId: number,
    jsonData: Step[],
    token: string
): Promise<AnimationDetail> => {
    const res = await api.post(
        '/api/animations',
        {
            animationName,
            originalCode,
            languageId,
            jsonData: JSON.stringify(jsonData)
        },
        authHeader(token)
    )
    return res.data
}

// ── 저장 목록 불러오기 ──
export const getAnimationList = async (
    page: number,
    size: number,
    token: string
): Promise<AnimationSummary[]> => {
    const res = await api.get('/api/animations', {
        params: { page, size },
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

// ── 애니메이션 상세 조회 ──
export const getAnimationDetail = async (
    animationId: number,
    token: string
): Promise<AnimationDetail> => {
    const res = await api.get(`/api/animations/${animationId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

// ── 언어 목록 ──
export const getLanguages = async () => {
    const res = await api.get('/api/languages')
    return res.data
}