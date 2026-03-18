import React, { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const cursorDotOutline = useRef(null);
  const cursorDot = useRef(null);
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const onMouseMove = (event) => {
    const { clientX: x, clientY: y } = event;
    setMousePosition({ x, y });

    if (cursorDot.current) {
      cursorDot.current.style.top = `${y}px`;
      cursorDot.current.style.left = `${x}px`;
    }
  };

  const animateDotOutline = (time) => {
    if (previousTimeRef.current !== undefined) {
      if (cursorDotOutline.current) {
        const x = mousePosition.x;
        const y = mousePosition.y;

        // Simple easing for the outline
        const currentX = parseFloat(cursorDotOutline.current.style.left || 0);
        const currentY = parseFloat(cursorDotOutline.current.style.top || 0);

        const dx = x - currentX;
        const dy = y - currentY;

        cursorDotOutline.current.style.top = `${currentY + dy * 0.15}px`;
        cursorDotOutline.current.style.left = `${currentX + dx * 0.15}px`;
      }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animateDotOutline);
  };

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    requestRef.current = requestAnimationFrame(animateDotOutline);

    const handleMouseOver = (e) => {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e) => {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
        setIsHovering(false);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(requestRef.current);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [mousePosition]);

  return (
    <>
      <div
        ref={cursorDot}
        className={`cursor-dot ${isHovering ? 'cursor-hover' : ''}`}
      />
      <div
        ref={cursorDotOutline}
        className={`cursor-outline ${isHovering ? 'cursor-hover' : ''}`}
      />
    </>
  );
};

export default CustomCursor;
