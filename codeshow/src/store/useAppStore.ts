import { create } from 'zustand'
import type { Step, User, SavedAnimation } from '../types/memory'

interface AppStore {
    user: User | null
    isGuest: boolean
    setUser: (user: User | null) => void
    setIsGuest: (v: boolean) => void

    code: string
    language: string
    setCode: (code: string) => void
    setLanguage: (lang: string) => void

    steps: Step[]
    currentStep: number
    setSteps: (steps: Step[]) => void
    setCurrentStep: (n: number) => void
    nextStep: () => void
    prevStep: () => void
    resetSteps: () => void

    savedAnimations: SavedAnimation[]

    isAnalyzing: boolean
    setIsAnalyzing: (v: boolean) => void
}

export const useAppStore = create<AppStore>((set, get) => ({
    user: null,
    isGuest: false,
    setUser: (user) => set({ user }),
    setIsGuest: (v) => set({ isGuest: v }),

    code: `int a = 10;\nString str = new String("Hello");\nint b = a;`,
    language: 'java',
    setCode: (code) => set({ code }),
    setLanguage: (language) => set({ language }),

    steps: [],
    currentStep: -1,
    setSteps: (steps) => set({ steps, currentStep: -1 }),
    setCurrentStep: (n) => set({ currentStep: n }),
    nextStep: () => {
        const { currentStep, steps } = get()
        if (currentStep < steps.length - 1)
            set({ currentStep: currentStep + 1 })
    },
    prevStep: () => {
        const { currentStep } = get()
        if (currentStep > 0)
            set({ currentStep: currentStep - 1 })
    },
    resetSteps: () => set({ steps: [], currentStep: -1 }),

    savedAnimations: [],

    isAnalyzing: false,
    setIsAnalyzing: (v) => set({ isAnalyzing: v }),
}))