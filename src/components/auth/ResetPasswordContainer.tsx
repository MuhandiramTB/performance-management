'use client'

import { useSearchParams } from 'next/navigation'
import { ResetPasswordForm } from './ResetPasswordForm'

export function ResetPasswordContainer() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  return <ResetPasswordForm token={token ?? undefined} />
} 