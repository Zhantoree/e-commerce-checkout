"use client";

import { Select, Typography } from "antd";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

const { Text } = Typography;

const MotionDiv = motion.div;
const MotionSpan = motion.span;

const options = [
  { value: "react", label: "React" },
  { value: "next", label: "Next.js" },
  { value: "antd", label: "Ant Design" },
  { value: "motion", label: "Framer Motion / Motion" },
  { value: "ts", label: "TypeScript" },
];

export default function AnimatedAntdSelectExample() {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState<string | undefined>();

  const active = open || focused;

  const helperText = useMemo(() => {
    if (!value) return "Choose a stack item";
    return `Selected: ${value}`;
  }, [value]);

  return (
    <MotionDiv
      layout
      transition={{ duration: 0.28, ease: "easeInOut" }}
      animate={{
        width: active ? 420 : 320,
      }}
      style={{ flexShrink: 0 }}
    >
      <MotionDiv
        animate={{
          scale: active ? 1.02 : 1,
          y: active ? -2 : 0,
          boxShadow: active ? "0 12px 30px rgba(0,0,0,0.12)" : "0 4px 14px rgba(0,0,0,0.06)",
        }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        style={{
          borderRadius: 16,
          padding: 10,
          background: "#fff",
        }}
      >
        <Select
          showSearch
          value={value}
          onChange={setValue}
          open={open}
          onOpenChange={setOpen}
          options={options}
          placeholder="Select technology"
          style={{ width: "100%" }}
          size="large"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          suffixIcon={
            <MotionSpan
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: "inline-flex" }}
            >
              <></>
            </MotionSpan>
          }
          popupRender={(menu) => (
            <AnimatePresence mode="popLayout">
              <MotionDiv
                key={open ? "opened" : "closed"}
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                style={{
                  transformOrigin: "right center",
                }}
              >
                {menu}
              </MotionDiv>
            </AnimatePresence>
          )}
        />
      </MotionDiv>
    </MotionDiv>
  );
}
