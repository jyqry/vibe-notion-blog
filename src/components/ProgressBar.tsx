"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLoading } from "@/contexts/LoadingContext";

export default function ProgressBar() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const { isLoading } = useLoading();

  useEffect(() => {
    let progressTimer: NodeJS.Timeout;
    let completeTimer: NodeJS.Timeout;
    let startTimer: NodeJS.Timeout;

    const startProgress = () => {
      // 300ms 후에 progress bar 표시 (빠른 페이지는 표시하지 않음)
      startTimer = setTimeout(() => {
        setIsVisible(true);
        setProgress(0);

        // 진행률을 점진적으로 증가
        progressTimer = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 85) return prev; // 85%에서 멈춤
            const increment = Math.random() * 10 + 5; // 5-15% 증가
            return Math.min(prev + increment, 85);
          });
        }, 150);
      }, 300);
    };

    const completeProgress = () => {
      clearTimeout(startTimer);
      clearInterval(progressTimer);

      if (isVisible) {
        setProgress(100);
        completeTimer = setTimeout(() => {
          setIsVisible(false);
          setProgress(0);
        }, 200);
      }
    };

    if (isLoading) {
      startProgress();
    } else {
      completeProgress();
    }

    return () => {
      clearTimeout(startTimer);
      clearInterval(progressTimer);
      clearTimeout(completeTimer);
    };
  }, [isLoading, isVisible]);

  // 페이지 변경 감지 (추가 트리거)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isVisible) {
        setProgress(100);
        setTimeout(() => {
          setIsVisible(false);
          setProgress(0);
        }, 200);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div
          className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out shadow-lg"
          style={{
            width: `${progress}%`,
            boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
          }}
        />
      </div>

      {/* Loading Overlay (선택적) */}
      {progress < 85 && (
        <div className="fixed inset-0 bg-black bg-opacity-5 z-40 pointer-events-none" />
      )}
    </>
  );
}
