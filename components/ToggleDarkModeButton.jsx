import { useState, useEffect } from "react";
import { HiSun, HiMoon } from "react-icons/hi";

function ToggleDarkModeButton() {
  const [isDark, setIsDark] = useState(false);

  // Check local storage on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleClick = () => {
    setIsDark((prev) => {
      const newValue = !prev;
      if (newValue) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newValue;
    });
  };

  return (
    <>
      <div
        onClick={handleClick}
        className=" z-[1000000000000000] bg-red-600 p-10  h-10 fixed top-0 right-0 p-3 rounded-full text-gray-900 dark:text-gray-900 "
        aria-label="Toggle Dark Mode"
      >
        {isDark ? <HiSun size={34} color={"white"} /> : <HiMoon size={34} />}
      </div>
    </>
  );
}

export default ToggleDarkModeButton;
