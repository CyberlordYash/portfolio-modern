"use client";
import { cn } from "@/utils/cn";
import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";

type MotionDivProps = Omit<
  React.ComponentProps<typeof motion.div>,
  "children"
> & {
  children?: React.ReactNode;
};

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined,
);

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
};

export const Sidebar = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;
  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const SidebarBody = (props: MotionDivProps) => (
  <>
    <DesktopSidebar {...props} />
    <MobileSidebar {...(props as React.ComponentProps<"div">)} />
  </>
);

/* ─────────────────────────────────────────────────────────────
   DESKTOP SIDEBAR
───────────────────────────────────────────────────────────── */
export const DesktopSidebar = ({
  className,
  children,
  ...props
}: MotionDivProps) => {
  const { open, setOpen, animate } = useSidebar();

  return (
    <motion.div
      className={cn(
        "h-full hidden md:flex md:flex-col shrink-0 relative overflow-visible",
        "bg-[#ffffff] dark:bg-[#090909]",
        "border-r border-black/10 dark:border-white/10",
        className,
      )}
      animate={{ width: animate ? (open ? "260px" : "64px") : "260px" }}
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {/* Subtle scan shimmer when collapsed */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none overflow-hidden"
          >
            <motion.div
              animate={{ y: ["-100%", "200%"] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 3,
              }}
              className="absolute inset-x-0 h-20 bg-gradient-to-b from-transparent via-black/[0.03] dark:via-white/[0.03] to-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MOBILE SIDEBAR
───────────────────────────────────────────────────────────── */
export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* ── Floating hamburger (mobile only) ── */}
      <motion.button
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 20 }}
        onClick={() => setOpen(true)}
        whileTap={{ scale: 0.9 }}
        className="md:hidden fixed top-4 left-4 z-[500] flex h-9 w-9 items-center justify-center
          bg-[#ffffff] dark:bg-[#090909]
          border border-black/20 dark:border-white/20
          text-black dark:text-white
          transition-colors hover:bg-black/5 dark:hover:bg-white/5"
      >
        <IconMenu2 size={16} />
      </motion.button>

      {/* ── Drawer – portalled to body ── */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setOpen(false)}
                  className="fixed inset-0 z-[800] bg-black/50 backdrop-blur-sm"
                />

                {/* Panel */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", stiffness: 320, damping: 32 }}
                  className={cn(
                    "fixed left-0 top-0 h-full w-[78%] max-w-[300px] z-[900]",
                    "flex flex-col",
                    "bg-[#ffffff] dark:bg-[#090909]",
                    "border-r border-black/15 dark:border-white/15",
                    className,
                  )}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-black/10 dark:border-white/10">
                    <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-black/35 dark:text-white/35">
                      NAVIGATION
                    </span>
                    <button
                      onClick={() => setOpen(false)}
                      className="flex h-7 w-7 items-center justify-center border border-black/15 dark:border-white/15 text-black/50 dark:text-white/50 hover:border-black/30 dark:hover:border-white/30 hover:text-black dark:hover:text-white transition-colors"
                    >
                      <IconX size={12} />
                    </button>
                  </div>

                  {/* Content */}
                  <div
                    className="flex flex-col flex-1 overflow-y-auto px-3 py-3"
                    onClick={() => setOpen(false)}
                  >
                    {React.Children.map(children, (child, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.05 + i * 0.06,
                          type: "spring",
                          stiffness: 300,
                          damping: 26,
                        }}
                        className="flex flex-col"
                      >
                        {child}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
};

/* ─────────────────────────────────────────────────────────────
   SIDEBAR LINK
───────────────────────────────────────────────────────────── */
export const SidebarLink = ({
  link,
  className,
}: {
  link: { label: string; href: string; icon: React.ReactNode };
  className?: string;
}) => {
  const { open, animate } = useSidebar();
  const [isActive, setIsActive] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [tooltipY, setTooltipY] = useState(0);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const id = link.href.replace("#", "");
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { threshold: 0.3, rootMargin: "-5% 0px -5% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [link.href]);

  const handleMouseEnter = () => {
    const rect = linkRef.current?.getBoundingClientRect();
    if (rect) setTooltipY(rect.top + rect.height / 2);
    setHovered(true);
  };

  return (
    <>
      <a
        ref={linkRef}
        href={link.href}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "group/link relative flex items-center gap-3 px-3 py-2.5",
          "transition-all duration-150 overflow-hidden",
          isActive
            ? "text-black dark:text-white bg-black/[0.04] dark:bg-white/[0.04]"
            : "text-black/50 dark:text-white/45 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] hover:text-black dark:hover:text-white",
          className,
        )}
      >
        {/* Active left bar */}
        <motion.div
          className="absolute left-0 top-[20%] bottom-[20%] w-[2px] bg-black dark:bg-white"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        />

        {/* Icon */}
        <div className="relative z-10 shrink-0 text-black/60 dark:text-white/60 group-hover/link:text-black dark:group-hover/link:text-white transition-colors">
          {link.icon}
        </div>

        {/* Label */}
        <motion.span
          animate={{
            display: animate ? (open ? "inline-block" : "none") : "inline-block",
            opacity: animate ? (open ? 1 : 0) : 1,
            x: animate ? (open ? 0 : -4) : 0,
          }}
          transition={{ duration: 0.15 }}
          className="relative z-10 font-mono text-[9px] uppercase tracking-[0.3em] whitespace-nowrap"
        >
          {link.label}
        </motion.span>
      </a>

      {/* Collapsed tooltip */}
      {animate && !open && hovered && (
        <div
          style={{ top: tooltipY, left: 76 }}
          className="fixed z-[9999] -translate-y-1/2 pointer-events-none"
        >
          <motion.div
            initial={{ opacity: 0, x: -8, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="flex items-center gap-2 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.25em] whitespace-nowrap
              bg-[#ffffff] dark:bg-[#090909] text-black dark:text-white
              border border-black/15 dark:border-white/15
              shadow-lg"
          >
            {isActive && (
              <div className="h-1.5 w-1.5 bg-black dark:bg-white shrink-0" />
            )}
            {link.label}
          </motion.div>
        </div>
      )}
    </>
  );
};
