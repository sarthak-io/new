import React, { useRef, useEffect } from 'react';
import CardMain from './CardMain';

export default function CarousalMain() {
  const sliderRef = useRef(null);
  // const scrollAmount = 10; // Adjust the speed of scrolling here (higher value makes it faster)
  // const scrollStep = 5; // Adjust the step for each scroll

  // useEffect(() => {
  //   let animationFrameId;
  //   let scrollValue = 0;
  //   let isScrolling = false;

  //   const step = () => {
  //     sliderRef.current.scrollLeft = scrollValue;
  //     if (scrollValue >= sliderRef.current.scrollWidth - sliderRef.current.clientWidth) {
  //       scrollValue = 0;
  //     } else {
  //       scrollValue += scrollStep;
  //     }

  //     if (isScrolling) {
  //       animationFrameId = requestAnimationFrame(step);
  //     }
  //   };

  //   const handleMouseEnter = () => {
  //     isScrolling = false;
  //     cancelAnimationFrame(animationFrameId);
  //   };

  //   const handleMouseLeave = () => {
  //     isScrolling = true;
  //     step();
  //   };

  //   sliderRef.current.addEventListener('mouseenter', handleMouseEnter);
  //   sliderRef.current.addEventListener('mouseleave', handleMouseLeave);

  //   // Start scrolling automatically when the component mounts
  //   isScrolling = true;
  //   step();

  //   return () => {
  //     isScrolling = false;
  //     cancelAnimationFrame(animationFrameId);
  //     sliderRef.current.removeEventListener('mouseenter', handleMouseEnter);
  //     sliderRef.current.removeEventListener('mouseleave', handleMouseLeave);
  //   };
  // }, []);

  return (
    <div className="desk-home-carousal-main m-10">
      <div ref={sliderRef} className="slider">
        <CardMain />
        <CardMain />
        
      </div>
    </div>
  );
}
