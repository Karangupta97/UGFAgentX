import { motion, type Variants, type HTMLMotionProps } from 'motion/react';
import type { ReactNode } from 'react';

export const easeSmooth = [0.22, 1, 0.36, 1] as const;

export const scrollViewport = {
  once: true,
  amount: 0.12,
  margin: '0px 0px -64px 0px',
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: easeSmooth },
  },
};

export const fadeUpLight: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeSmooth },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: easeSmooth },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.06 },
  },
};

export const heroStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.11, delayChildren: 0.15 },
  },
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  variant?: 'section' | 'light';
};

export function RevealSection({ children, className, id, variant = 'section' }: RevealProps) {
  return (
    <motion.section
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      variants={variant === 'light' ? fadeUpLight : fadeUp}
    >
      {children}
    </motion.section>
  );
}

export function StaggerOnScroll({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={fadeUpLight}>
      {children}
    </motion.div>
  );
}

export function MotionDiv({
  children,
  variants,
  ...props
}: HTMLMotionProps<'div'> & { children: ReactNode; variants?: Variants }) {
  return (
    <motion.div variants={variants ?? fadeUpLight} {...props}>
      {children}
    </motion.div>
  );
}
