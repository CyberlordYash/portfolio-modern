"use client";
import { cn } from "@/utils/cn";
import React, { useState, createContext, useContext, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";

type MotionDivProps = Omit<React.ComponentProps<typeof motion.div>, "children"> & {
  children?: React.ReactNode;
};

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

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
export const DesktopSidebar = ({ className, children, ...props }: MotionDivProps) => {
  const { open, setOpen, animate } = useSidebar();

  return (
    <motion.div
      className={cn(
        "h-full hidden md:flex md:flex-col shrink-0 relative overflow-visible",
        "bg-slate-50 dark:bg-[#030712]",
        className
      )}
      animate={{ width: animate ? (open ? "260px" : "72px") : "260px" }}
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {/* Divider line */}
      <div className="absolute right-0 top-[8%] bottom-[8%] w-px bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent" />

      {/* Collapsed scan-line shimmer */}
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
              transition={{ duration: 3.5, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
              className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-indigo-500/[0.06] to-transparent"
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
export const MobileSidebar = ({ className, children, ...props }: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      {/* ── Floating hamburger button (mobile only) ── */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 20 }}
        onClick={() => setOpen(true)}
        whileTap={{ scale: 0.88 }}
        className="md:hidden fixed top-5 left-5 z-[500] flex h-10 w-10 items-center justify-center rounded-2xl
          bg-white/30 dark:bg-black/30 backdrop-blur-xl
          border border-white/40 dark:border-white/10
          shadow-[0_4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)]
          transition-colors hover:border-indigo-400/50 hover:bg-white/50 dark:hover:bg-indigo-500/10"
      >
        <IconMenu2 size={18} className="text-slate-700 dark:text-slate-200" />
      </motion.button>

      {/* ── Drawer — portalled to body to escape any containing-block trap ── */}
      {mounted && createPortal(
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
                className="fixed inset-0 z-[800] bg-black/60 backdrop-blur-sm"
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
                  "bg-slate-50 dark:bg-[#080c14]",
                  "border-r border-slate-200/70 dark:border-white/[0.07]",
                  "shadow-[4px_0_40px_rgba(0,0,0,0.15)] dark:shadow-[4px_0_40px_rgba(0,0,0,0.6)]",
                  className
                )}
              >
                {/* Top accent bar */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />

                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100 dark:border-white/[0.06]">
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-slate-400 dark:text-slate-600">
                    /// menu
                  </span>
                  <motion.button
                    onClick={() => setOpen(false)}
                    whileTap={{ scale: 0.88 }}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 dark:border-white/[0.08] dark:bg-white/[0.04] text-slate-500 dark:text-slate-400 transition-colors hover:border-rose-400/50 hover:text-rose-500 dark:hover:text-rose-400"
                  >
                    <IconX size={14} />
                  </motion.button>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 overflow-y-auto px-3 py-3" onClick={() => setOpen(false)}>
                  {React.Children.map(children, (child, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.07, type: "spring", stiffness: 280, damping: 26 }}
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
        document.body
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

  /* Active section tracking */
  useEffect(() => {
    const id = link.href.replace("#", "");
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { threshold: 0.3, rootMargin: "-5% 0px -5% 0px" }
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
          "group/link relative flex items-center gap-3 rounded-xl px-3 py-2.5",
          "transition-all duration-200 overflow-hidden",
          // Active state
          isActive
            ? "bg-gradient-to-r from-indigo-500/12 to-transparent dark:from-indigo-500/15 dark:to-transparent text-indigo-600 dark:text-indigo-400"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-white",
          className
        )}
      >
        {/* Active left bar */}
        <motion.div
          className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-gradient-to-b from-indigo-500 to-violet-500"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        />

        {/* Active background glow */}
        {isActive && (
          <motion.div
            layoutId="sidebarActiveGlow"
            className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent rounded-xl"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}

        {/* Icon */}
        <motion.div
          className="relative z-10 shrink-0"
          whileHover={{ scale: 1.15, rotate: -4 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
        >
          {link.icon}
        </motion.div>

        {/* Label */}
        <motion.span
          animate={{
            display: animate ? (open ? "inline-block" : "none") : "inline-block",
            opacity: animate ? (open ? 1 : 0) : 1,
            x: animate ? (open ? 0 : -4) : 0,
          }}
          transition={{ duration: 0.18 }}
          className="relative z-10 text-sm font-medium whitespace-nowrap tracking-tight"
        >
          {link.label}
        </motion.span>
      </a>

      {/* Collapsed tooltip — rendered at fixed position to escape any clip */}
      {animate && !open && hovered && (
        <div
          style={{ top: tooltipY, left: 80 }}
          className="fixed z-[9999] -translate-y-1/2 pointer-events-none"
        >
          <motion.div
            initial={{ opacity: 0, x: -6, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold whitespace-nowrap
              bg-slate-900/90 dark:bg-slate-800/90 text-white backdrop-blur-sm
              border border-white/10 shadow-xl"
          >
            {isActive && (
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
            )}
            {link.label}
          </motion.div>
        </div>
      )}
    </>
  );
};
