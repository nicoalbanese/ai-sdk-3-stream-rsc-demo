"use client";

import { useEffect, useState } from "react";
import { Card } from "../ui/card";

export function CurrentTime() {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-neutral-800 text-neutral-50 text-2xl p-4">
      {currentTime.toLocaleString().split(" ")[1]}
    </Card>
  );
}
