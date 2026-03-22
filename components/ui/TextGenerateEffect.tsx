"use client";

import { cn } from "@/utils/cn";

export const TextGenerateEffect = ({
  words,
  className,
}: {
  words: string;
  className?: string;
}) => {
  const wordsArray = words.split(" ");

  return (
    <div className={cn("font-bold", className)}>
      <div className="my-4">
        <div className="leading-snug tracking-wide text-black dark:text-white">
          {wordsArray.map((word, idx) => (
            <span
              key={`${word}-${idx}`}
              className={
                idx > 1
                  ? "text-blue-800 dark:text-blue-300"
                  : "text-black dark:text-white"
              }
            >
              {word}{" "}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
