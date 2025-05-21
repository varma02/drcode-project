import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { LoaderCircle } from "lucide-react"

const spinTransition = {
  repeat: Infinity,
  ease: "linear",
  duration: 1
}

const pulseTransition = {
  repeat: Infinity,
  repeatType: "reverse",
  ease: "easeInOut",
  duration: 1
}

export function Loader({ 
  className, 
  variant = "spinner",
  size = "default",
  ...props 
}) {
  const sizeStyles = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  }

  if (variant === "spinner") {
    return (
      <div className={cn("flex items-center justify-center", className)} {...props}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={spinTransition}
          className="flex items-center justify-center"
        >
          <LoaderCircle className={cn("text-primary", sizeStyles[size])} />
        </motion.div>
      </div>
    )
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center gap-1", className)} {...props}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1.2 }}
            transition={{
              ...pulseTransition,
              delay: i * 0.15
            }}
            className={cn(
              "rounded-full bg-primary",
              size === "sm" && "h-1 w-1",
              size === "default" && "h-1.5 w-1.5",
              size === "lg" && "h-2 w-2",
              size === "xl" && "h-3 w-3"
            )}
          />
        ))}
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex items-center justify-center", className)} {...props}>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.6, 1]
          }}
          transition={pulseTransition}
          className={cn(
            "rounded-full bg-primary/20",
            "flex items-center justify-center",
            size === "sm" && "h-6 w-6",
            size === "default" && "h-10 w-10",
            size === "lg" && "h-16 w-16",
            size === "xl" && "h-24 w-24"
          )}
        >
          <div className={cn(
            "rounded-full bg-primary",
            size === "sm" && "h-3 w-3",
            size === "default" && "h-5 w-5",
            size === "lg" && "h-8 w-8",
            size === "xl" && "h-12 w-12"
          )} />
        </motion.div>
      </div>
    )
  }

  return null
}

export function TableRowSkeleton({ columns = 5, className }) {
  return (
    <div className={cn("flex animate-pulse gap-3 p-4", className)}>
      {Array(columns).fill(null).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 0.7 }}
          transition={{
            ...pulseTransition,
            delay: i * 0.1
          }}
          className="h-6 flex-1 rounded-md bg-muted"
        />
      ))}
    </div>
  )
}

export function CardSkeleton({ className }) {
  return (
    <div className={cn("animate-pulse rounded-xl border p-6 shadow-sm", className)}>
      <div className="space-y-3">
        <div className="h-5 w-2/5 rounded-md bg-muted" />
        <div className="h-4 w-4/5 rounded-md bg-muted" />
      </div>
      <div className="mt-6 space-y-2">
        {Array(3).fill(null).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 0.7 }}
            transition={{
              ...pulseTransition,
              delay: i * 0.2
            }}
            className="h-5 w-full rounded-md bg-muted"
          />
        ))}
      </div>
    </div>
  )
}