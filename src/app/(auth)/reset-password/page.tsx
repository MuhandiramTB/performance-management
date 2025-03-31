import { Suspense } from 'react'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'

type SearchParams = { [key: string]: string | string[] | undefined }

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const resolvedParams = await searchParams
  const token = resolvedParams.token as string | undefined

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a14] to-[#1a1a2e] p-4">
      <Suspense fallback={
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-400">Loading...</p>
        </div>
      }>
        <ResetPasswordForm token={token} />
      </Suspense>
    </div>
  )
} 