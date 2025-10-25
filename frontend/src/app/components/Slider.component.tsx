'use client'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'

interface Slide {
  image: string
  text: string
  category?:string
  shop:boolean
}

const slides: Slide[] = [
  {
    image: '/shirts-stock.jpg',
    text: 'Premium fashion, made for everyday comfort',
    category:'Fashion',
    shop:true
  },
  {
    image: '/shoes-stock.jpg',
    text: 'Step into quality. Every pair tells your story.',
    category:'Shoes Men',
    
    shop:true
  },
  {
    image: '/cosmetic-stock.jpg',
    text: 'Complete your look with elegance and detail.',
    category:'Beauty & Skincare',
    shop:true
  },
  {
    image: '/delivery-scene.jpg',
    text: 'Fast delivery across Pakistan. Cash on delivery available.',
    shop:false

  },
]

const Slider: React.FC = () => {
  const [index, setIndex] = useState(0)
const router=useRouter()
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const next = () => setIndex((prev) => (prev + 1) % slides.length)
  const prev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <div className="relative w-full h-[70vh] max-h-[600px] overflow-hidden rounded-2xl">
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="min-w-full h-[70vh] relative flex items-center justify-center"
          >
            <img
              src={slide.image}
              alt={`Slide ${i + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center px-6">
              <h2 className="text-2xl md:text-4xl font-semibold text-white mb-4">
                {slide.text}
              </h2>
              {slide.shop &&
              <button
              onClick={()=>{
                router.push(`?category=${slide.category}`)
              }}
               className="bg-white text-gray-900 px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition">
                Shop Now
              </button>}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 text-gray-900 p-2 rounded-full hover:bg-opacity-100"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 text-gray-900 p-2 rounded-full hover:bg-opacity-100"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <span
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition ${
              index === i ? 'bg-white' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default Slider
