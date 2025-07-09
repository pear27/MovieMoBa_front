import React, { useState, useEffect } from "react";
import { Text } from "react-native";

const LoadingAnimation = ({ text = "Please wait", style = {} }) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length === 3) {
          return "";
        }
        return prevDots + ".";
      });
    }, 500); // 500ms 간격으로 점을 추가

    // 컴포넌트가 언마운트되면 interval을 클리어
    return () => clearInterval(interval);
  }, []);

  return (
    <Text style={style}>
      {text}
      {dots}
    </Text>
  );
};

export default LoadingAnimation;
