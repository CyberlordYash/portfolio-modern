"use client";
import { cn } from "@/utils/cn";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";

// --- 1. CONTEXT & PROVIDER ---
interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined,
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
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

// --- 2. SIDEBAR BODY (Desktop/Mobile Switcher) ---
export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

// --- 3. DESKTOP SIDEBAR ---
export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col w-[280px] shrink-0 bg-[#020617] border-r border-white/10",
        className,
      )}
      animate={{ width: animate ? (open ? "280px" : "80px") : "280px" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// --- 4. MOBILE SIDEBAR (SOLID DRAWER FIX) ---
export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <div
      className={cn(
        "h-14 px-6 py-4 flex flex-row md:hidden items-center justify-between bg-[#020617] w-full fixed top-0 left-0 z-[500]  shadow-lg",
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <div className="h-4 w-1 bg-blue-500 rounded-full" />
        <span className="font-mono font-bold text-sm tracking-tighter text-white uppercase">
          SYS_ROOT
        </span>
      </div>

      <div className="flex justify-end z-[510]">
        <IconMenu2
          className="text-neutral-200 cursor-pointer"
          onClick={() => setOpen(!open)}
        />
      </div>

      <AnimatePresence>
        {open && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/90 z-[600]"
            />

            {/* SOLID Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "circOut" }}
              className={cn(
                "fixed right-0 top-0 h-full w-[80%] flex flex-col p-8 z-[700] shadow-[-10px_0_30px_rgba(0,0,0,0.8)]",
                "bg-[#020617] border-l border-white/20", // Hard Background Color
                className,
              )}
            >
              <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-4">
                <span className="text-[10px] font-mono text-blue-500 tracking-[0.3em] uppercase">
                  Navigator
                </span>
                <div
                  className="text-neutral-400 hover:text-white cursor-pointer"
                  onClick={() => setOpen(false)}
                >
                  <IconX size={24} />
                </div>
              </div>

              {/* Sidebar Links */}
              <div
                className="flex flex-col gap-2"
                onClick={() => setOpen(false)}
              >
                {children}
              </div>

              {/* System Info Section */}
              <div className="mt-auto pt-6 border-t border-white/5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-mono text-slate-400 tracking-widest uppercase">
                    System: Online
                  </span>
                </div>
                <div className="font-mono text-[8px] text-slate-600 tracking-tighter uppercase leading-tight">
                  User: root@yash_sachan <br />
                  Connection: Secure_TLS_1.3
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- 5. SIDEBAR LINK ---
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
        "flex items-center justify-start gap-3 group/sidebar py-3 px-3 rounded-xl transition-all hover:bg-white/5",
        className,
      )}
      {...props}
    >
      <div className="shrink-0 text-neutral-400 group-hover/sidebar:text-blue-500 transition-colors">
        {link.icon}
      </div>
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-neutral-300 text-sm font-medium group-hover/sidebar:text-white transition-colors"
      >
        {link.label}
      </motion.span>
    </a>
  );
};
