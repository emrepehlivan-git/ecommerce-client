'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    toast.error(error.message)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Bir hata oluştu!
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">
          Ürünler yüklenirken beklenmeyen bir sorun yaşandı. Lütfen tekrar deneyin.
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    </div>
  )
} 