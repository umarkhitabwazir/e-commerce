import Image from 'next/image'
import React from 'react'
import useStickyScroll from './UseStickyScroll.component'
import { useRouter } from 'next/navigation'

const GoBackComponent = () => {
    const isSticky=useStickyScroll()
const route=useRouter()
    const goback=()=>{
            if (window.history.length>1) {
            route.back()
        }else{
            route.push('/')
        }
    }
  return (
    <div>

    <div
    onClick={goback}
    className={`${isSticky?"fixed top-32 transition-all duration-500":'relative'}
     text-lg cursor-pointer z-10 w-24 left-2  top-3   rounded-sm  flex gap-1 p-3  items-center`}>
      <Image  src="/go-back.png" alt="go-back" width={20} height={20} />
    
    </div>
    </div>
  )
}

export default GoBackComponent
