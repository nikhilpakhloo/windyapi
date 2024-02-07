import React from 'react'
import dynamic from 'next/dynamic'
const Weather = dynamic(()=>import ("./WindyApi"), {ssr:false})

export default function Page() {

  return (
    <div>
      <Weather/>
      
    </div>
  )
}
