import React from 'react'
import { IoIosCloseCircle } from "react-icons/io";
import { Link } from 'react-router-dom';
const Sidebar = ({handleSidebar , menuItems, isAuthenticated}) => {
   
  return (
    
    <div className='absolute w-[50%] h-[100vh] bg-black right-0 top-0 z-50 flex flex-col justify-center'   >
        <IoIosCloseCircle className='absolute left-3 top-3 size-[30px] cursor-pointer ' onClick={handleSidebar}/>
        <div className='h-[60%]  flex flex-col items-center justify-around'>
        {menuItems.map((item)=>{
          return (
            <div>
              <li key={item.name} className='list-none'>
                  <Link to={item.path} className='underline-effect hover:text-gray-400'>{item.name}</Link>
              </li>
              
            </div>
          
          )
        })}
        {!isAuthenticated && <div className='flex-col items-center'>
          <Link to={"/login"} className='w-[120px] h-[40px] text-center text-[#2a67b1] font-normal flex items-center justify-center rounded-md hover:bg-white'>
          Login 
        </Link>
        <Link to={"/signup"} className='w-[120px] h-[40px] text-center text-[#2a67b1] color-[#2a67b1] font-normal flex items-center justify-center rounded-md hover:bg-white'>
          Signup
        </Link>
        </div> }
        </div>
    </div>
  )
}

export default Sidebar