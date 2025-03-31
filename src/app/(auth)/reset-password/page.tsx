'use client'

import { Suspense } from 'react'
import { ResetPasswordContainer } from '@/components/auth/ResetPasswordContainer'

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a14] to-[#1a1a2e] p-4">
      <Suspense 
        fallback={
          <div className="w-full max-w-md text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-gray-400">Loading...</p>
          </div>
        }
      >
        <ResetPasswordContainer />
      </Suspense>
    </div>
  )
} 