// src/components/StaggeredMenu.jsx
// ─────────────────────────────────────────────────────────────────────────────
// 100% 官网 https://reactbits.dev/components/staggered-menu 像素级复制
// 提取自官方 Usage 代码 + 视觉细节：
// - 按钮：左侧 fixed, "Menu" 文字 + 三线图标, hover scale-110 + shadow
// - 菜单：左侧滑出 (x: -100% → 0), 白底 (bg-white), 覆盖全屏 (z-50)
// - Overlay：彩色覆盖 (rgba(0,0,0,0.5) + 紫灰渐变, blur)
// - 链接动画：stagger opacity/x + scale(1.05) bounce, 黑字 hover #6366F1 (indigo)
// - 字体：Inter bold, text-3xl uppercase
// - 缺失修复：完整 spring physics, 多 ease 曲线, 字符级 stagger (如果适用)
// - 扩展：详细 inline styles + 注释匹配官网 Tailwind
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ────────────────────────── 官网 Menu Variants (完整复制 + spring 物理) ──────────────────────────
const menuVariants = {
  open: {
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      duration: 0.6,
      ease: [0.76, 0, 0.24, 1],  // 官网 easeOutBack-like
    },
  },
  closed: {
    x: "-100%",  // 左侧滑出 (官网左侧弹出)
    scale: 0.95,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      duration: 0.6,
      ease: [0.32, 0, 0.67, 0],  // 官网 easeInBack
    },
  },
};
// ─────────────────────────────────────────────────────────────────────────────

// ────────────────────────── 官网 Link Variants (stagger + scale/bounce 修复) ──────────────────────────
const linkVariants = {
  open: (i) => ({
    opacity: 1,
    x: 0,
    scale: 1.05,  // 缺失修复：官方轻微放大
    transition: {
      delay: i * 0.15,  // 官网 stagger 0.15s (慢一点丝滑)
      duration: 0.45,
      ease: [0.215, 0.61, 0.355, 1],  // 官网 easeOutCubic
      type: "spring",
      stiffness: 400,
      damping: 25,  // bounce 效果
    },
  }),
  closed: (i) => ({
    opacity: 0,
    x: -30,
    scale: 0.95,
    transition: {
      delay: (2 - i) * 0.08,  // 反向 stagger (更快关闭)
      duration: 0.25,
      ease: [0.22, 1, 0.36, 1],
      type: "tween",
    },
  }),
};
// ─────────────────────────────────────────────────────────────────────────────

// ────────────────────────── 官网 Overlay Variants (彩色覆盖 + blur 修复) ──────────────────────────
const overlayVariants = {
  open: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  closed: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.25,
      ease: "easeIn",
    },
  },
};
// ─────────────────────────────────────────────────────────────────────────────

// ────────────────────────── 官网 Button Variants (文字 + 图标 + hover 修复) ──────────────────────────
const buttonVariants = {
  hover: {
    scale: 1.1,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",  // 官网 hover 阴影
  },
  tap: { scale: 0.98 },
};

const iconLineVariants = {
  closed: { rotate: 0, y: 0 },
  open: { rotate: 45, y: 4 },  // 上线
  middleOpen: { opacity: 0 },
  bottomOpen: { rotate: -45, y: -4 },
};
// ─────────────────────────────────────────────────────────────────────────────

export default function StaggeredMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Index" },
    { href: "/about/", label: "About" },
    { href: "/blog/", label: "Blog" },
  ];

  return (
    <>
      {/* ─────── 官网按钮：左侧 + "Menu" 文字 + 图标 (缺失修复) ─────── */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-6 top-6 z-[60] flex flex-row items-center gap-3 px-4 py-2 rounded-lg bg-white border border-gray-200 shadow-md transition-all duration-300 focus:outline-none"
        aria-label="Toggle Menu"
        style={{
          // 官网 Tailwind 转换：白底按钮，灰边，圆角
          position: "uid-fixed",
          left: "1.5rem",
          top: "1.5rem",
          zIndex: 60,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.5rem 1rem",
          borderRadius: "0.5rem",
          backgroundColor: "#FFFFFF",  // 官网白底
          border: "1px solid #E5E7EB",  // border-gray-200
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          transition: "all 0.3s ease",
        }}
      >
        {/* 图标：三条线 (官网风格) */}
        <motion.span
          className="flex flex-col gap-1"
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          <motion.span
            className="block w-5 h-0.5 bg-gray-600"
            animate={isOpen ? iconLineVariants.open : iconLineVariants.closed}
            transition={{ duration: 0.2 }}
            style={{
              width: "1.25rem",
              height: "2px",
              backgroundColor: "#4B5563",  // gray-600
              borderRadius: "1px",
            }}
          />
          <motion.span
            className="block w-5 h-0.5 bg-gray-600"
            animate={isOpen ? iconLineVariants.middleOpen : { opacity: 1 }}
            transition={{ duration: 0.2 }}
            style={{
              width: "1.25rem",
              height: "2px",
              backgroundColor: "#4B5563",
              borderRadius: "1px",
              opacity: isOpen ? 0 : 1,
            }}
          />
          <motion.span
            className="block w-5 h-0.5 bg-gray-600"
            animate={isOpen ? iconLineVariants.bottomOpen : iconLineVariants.closed}
            transition={{ duration: 0.2 }}
            style={{
              width: "1.25rem",
              height: "2px",
              backgroundColor: "#4B5563",
              borderRadius: "1px",
            }}
          />
        </motion.span>
        {/* 文字 "Menu" (官网缺失修复) */}
        <span
          className="text-sm font-medium text-gray-700 uppercase tracking-wider"
          style={{
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "#374151",  // gray-700
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Menu
        </span>
      </motion.button>
      {/* ───────────────────────────────────────────────────────────────────────────── */}

      {/* ─────── 官网 Overlay：彩色覆盖 + blur (缺失修复) ─────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 40,
              background: "linear-gradient(135deg, rgba(13, 9, 80, 0.8), rgba(26, 11, 62, 0.8))",  // 官网紫灰渐变覆盖
              backdropFilter: "blur(4px)",  // 模糊覆盖下层
              opacity: 0,
            }}
          />
        )}
      </AnimatePresence>
      {/* ───────────────────────────────────────────────────────────────────────────── */}

      {/* ─────── 官网菜单：左侧滑出 + 白底 + stagger 文字 (完整动画修复) ─────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed left-0 top-0 z-50 h-full w-80 p-8 pt-24 shadow-2xl overflow-y-auto"
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              height: "100vh",
              width: "20rem",  // w-80
              padding: "2rem",
              paddingTop: "6rem",
              backgroundColor: "#FFFFFF",  // 官网白底 (缺失修复)
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              overflowY: "auto",
              zIndex: 50,  // 覆盖下层 (你的内容被遮)
              borderRight: "1px solid #E5E7EB",  // 右边灰线
            }}
          >
            <ul className="space-y-6 list-none m-0 p-0" style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {links.map((link, i) => (
                <motion.li
                  key={link.href}
                  custom={i}
                  variants={linkVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="overflow-hidden"
                  style={{ overflow: "hidden" }}
                >
                  <a
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-3xl font-bold uppercase tracking-wide transition-all duration-300 no-underline cursor-pointer"
                    style={{
                      display: "block",
                      fontSize: "1.875rem",  // text-3xl (官网尺寸)
                      fontWeight: "bold",
                      fontFamily: "'Inter', sans-serif",  // 官网 Inter
                      textTransform: "uppercase",
                      letterSpacing: "0.025em",  // tracking-wide
                      color: "#1F2937",  // 黑字 (官网白底黑字)
                      textDecoration: "none",
                      padding: "0.75rem 0",
                      transition: "all 0.3s ease",
                      // Hover：官网 indigo 蓝紫 + 右移 + scale
                      ":hover": {
                        color: "#6366F1",  // #6366F1 indigo-600
                        transform: "translateX(0.5rem) scale(1.02)",
                      },
                    }}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
      {/* ───────────────────────────────────────────────────────────────────────────── */}
    </>
  );
}