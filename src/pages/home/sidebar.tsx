import React from 'react'
import logo from "@/assets/logowithtitle.png"
const Sidebar = () => {
  return (
      <div className='bg-white w-[25%] flex py-10 border-r shadow-lg flex-col items-center gap-4 '>
          <img src={logo} alt="#" className='w-[150px]' />
    </div>
  )
}

export default Sidebar