"use client";
import { cn } from "@/utils/cn";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider");
  return context;
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

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => (
  <>
    <DesktopSidebar {...props} />
    <MobileSidebar {...(props as React.ComponentProps<"div">)} />
  </>
);

/* ── Desktop Sidebar ── */
export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full py-4 hidden md:flex md:flex-col shrink-0 relative",
        className
      )}
      animate={{ width: animate ? (open ? "260px" : "72px") : "260px" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {/* Gradient right border */}
      <div className="absolute right-0 top-[10%] bottom-[10%] w-[1px] bg-gradient-to-b from-transparent via-indigo-500/25 to-transparent" />
      {children}
    </motion.div>
  );
};

/* ── Mobile Sidebar ── */
export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <div
      className={cn(
        "h-14 px-5 flex flex-row md:hidden items-center justify-between w-full fixed top-0 left-0 z-[500]",
        "bg-white/80 border-b border-slate-200/80 backdrop-blur-xl",
        "dark:bg-[#030712]/80 dark:border-white/[0.06]",
      )}
      {...props}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex h-6 w-1 overflow-hidden rounded-full">
          <motion.div
            animate={{
              background: [
                "linear-gradient(to bottom, #6366f1, #a855f7)",
                "linear-gradient(to bottom, #a855f7, #ec4899)",
                "linear-gradient(to bottom, #ec4899, #6366f1)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0"
          />
        </div>
        <span className="font-mono font-black text-sm tracking-tighter text-slate-800 dark:text-white uppercase">
          YS
          <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
            .DEV
          </span>
        </span>
      </div>

      {/* Hamburger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 transition-all duration-200 hover:border-indigo-500/40 hover:shadow-[0_0_12px_rgba(99,102,241,0.2)] dark:border-white/[0.08] dark:bg-white/[0.04] dark:hover:border-indigo-500/40"
      >
        <IconMenu2 size={16} className="text-slate-600 dark:text-slate-300" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[600]"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.28, ease: "circOut" }}
              className={cn(
                "fixed right-0 top-0 h-full w-[78%] max-w-[320px] flex flex-col z-[700]",
                "bg-white/95 backdrop-blur-xl border-l border-slate-200/80",
                "dark:bg-[#030712]/95 dark:border-white/[0.07]",
                className
              )}
            >
              {/* Gradient top accent */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500" />

              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 pt-7 pb-5 border-b border-slate-100 dark:border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
                    <span className="font-mono text-[9px] font-black text-white">YS</span>
                  </div>
                  <div>
                    <p className="font-mono text-[11px] font-black uppercase tracking-widest text-slate-800 dark:text-white">
                      Navigation
                    </p>
                    <p className="font-mono text-[8px] uppercase tracking-widest text-slate-400 dark:text-slate-600">
                      Portfolio
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 transition-all hover:border-rose-500/40 hover:text-rose-500 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-400"
                >
                  <IconX size={14} />
                </button>
              </div>

              {/* Nav links */}
              <div className="flex flex-col gap-1 px-4 pt-4 flex-1" onClick={() => setOpen(false)}>
                {children}
              </div>

              {/* Drawer footer */}
              <div className="px-6 pb-8 pt-5 border-t border-slate-100 dark:border-white/[0.06]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-600 dark:text-emerald-500">
                    Available for work
                  </span>
                </div>
                <p className="font-mono text-[8px] text-slate-400 dark:text-slate-600 uppercase tracking-wider">
                  yash_sachan // secure_tls_1.3
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Sidebar Link ── */
export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: { label: string; href: string; icon: React.ReactNode };
  className?: string;
}) => {
  const { open, animate } = useSidebar();
  return (
    <a
      href={link.href}
      className={cn(
        "group/sidebar relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
        "border-l-2 border-transparent",
        "hover:border-indigo-500/50 hover:bg-gradient-to-r hover:from-indigo-500/[0.08] hover:to-transparent",
        "dark:hover:from-indigo-500/[0.1] dark:hover:to-transparent",
        className
      )}
      {...props}
    >
      <div className="shrink-0 text-slate-500 dark:text-slate-400 transition-colors duration-200 group-hover/sidebar:text-indigo-600 dark:group-hover/sidebar:text-indigo-400">
        {link.icon}
      </div>
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-slate-600 dark:text-slate-400 text-sm font-medium whitespace-nowrap transition-colors duration-200 group-hover/sidebar:text-slate-900 dark:group-hover/sidebar:text-white"
      >
        {link.label}
      </motion.span>
    </a>
  );
};
