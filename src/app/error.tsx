'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Ana sayfa hatası:', error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Hoş Geldiniz
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          En kaliteli ürünleri uygun fiyatlarla bulabileceğiniz e-ticaret platformu. 
          Geniş ürün yelpazemiz ile ihtiyacınız olan her şeyi tek noktadan temin edebilirsiniz.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">😔</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Öne çıkan ürünler yüklenemedi
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">
          Öne çıkan ürünleri gösterirken bir sorun yaşandı. Lütfen tekrar deneyin.
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