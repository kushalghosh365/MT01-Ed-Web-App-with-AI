import React, { useState } from 'react'
import { Tilt } from 'react-tilt';
const AvatarGroup = () => {
  const [isHovered, setIsHovered] = useState(false);
  const handleisHovered = () =>{
    setIsHovered(!isHovered);
  }
  const [count, setCount] = useState(0);
  const handleCount = (num)=>{
      setCount(num);
  }
  return (
    <Tilt className="avatar-group -space-x-6 rtl:space-x-reverse" >
  
  <div className="avatar hover:scale-110 cursor-pointer" >
    <div className="w-25 ">
      <img src="/src/assets/KushalPhoto.jpg" />
    </div>
   
  </div>
    </Tilt>
  )
}

export default AvatarGroup