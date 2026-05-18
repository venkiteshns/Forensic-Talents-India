const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;

export const globalTransition = {
  duration: 0.95,
  ease: [0.16, 1, 0.3, 1]
};

export const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.08
    }
  }
};

export const staggerContainer = containerVariants; // Backwards compatibility

export const cardVariants = {
  hidden: {
    opacity: 0,
    y: isMobile ? 32 : 48,
    scale: 0.985
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1.05,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export const cardReveal = cardVariants; // Backwards compatibility

export const textVariants = {
  hidden: {
    opacity: 0,
    y: isMobile ? 16 : 24
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export const fadeUp = textVariants; // Backwards compatibility

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1.05,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export const scaleHover = {
  hover: {
    scale: 1.018,
    y: -6,
    transition: {
      type: 'spring',
      stiffness: 90,
      damping: 18
    }
  }
};

export const buttonHover = {
  hover: {
    scale: 1.02,
    y: -2,
    transition: { type: 'spring', stiffness: 90, damping: 18 }
  },
  tap: {
    scale: 0.97,
    transition: { type: 'spring', stiffness: 90, damping: 18 }
  }
};

// Standard viewport config — spread as: viewport={vp}
export const vp = { once: true, amount: 0.2 };
