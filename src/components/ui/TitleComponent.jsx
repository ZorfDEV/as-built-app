//import React, { Children } from 'react'
import { PiDotsThreeCircleVertical } from 'react-icons/pi'

const TitleComponent = ({Children}) => {
  return (
    <div className='m-5 flex items-center justify-between '>
        <h2 className='text-medium text-gray-600 font-bold'>{Children}</h2>
        <PiDotsThreeCircleVertical className='cursor-pointer rounded-full p-1 text-2xl duration-300 hover:bg-gray-200 hover:dark:text-slate-600'/>
    </div>
  )
}

export default TitleComponent