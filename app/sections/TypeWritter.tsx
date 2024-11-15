"use client";
import React, { useEffect, useState } from "react";

interface TypewriterProps {
  text: string; // ข้อความที่ต้องการพิมพ์
  speed?: number; // ความเร็วในการพิมพ์ (มิลลิวินาที)
  delay?: number; // เวลาที่หน่วงก่อนเริ่มรอบใหม่ (มิลลิวินาที)
}

const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 100,
  delay = 500,
}) => {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (index < text.length) {
        // เพิ่มข้อความทีละตัว
        setDisplayText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      } else {
        // เมื่อข้อความครบ ให้รอ delay ก่อนเริ่มใหม่
        setTimeout(() => {
          setDisplayText("");
          setIndex(0);
        }, delay);
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [index, text, speed, delay]);

  return <h1>{displayText} |</h1>;
};

export default Typewriter;
