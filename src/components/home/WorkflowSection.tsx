'use client';

import React from 'react';
import { ProcessContent } from '@/lib/supabase/types';
import { IconResolver } from '@/components/ui/IconResolver';
import { motion } from 'framer-motion';

interface WorkflowSectionProps {
  workflowData?: ProcessContent | null;
}

export const WorkflowSection: React.FC<WorkflowSectionProps> = ({ workflowData }) => {
  const sectionRef = React.useRef<HTMLElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [hasManuallySwiped, setHasManuallySwiped] = React.useState(false);
  const [isInViewport, setIsInViewport] = React.useState(false);
  const [isInteracting, setIsInteracting] = React.useState(false);
  const hasInitializedRef = React.useRef(false);
  const touchStartX = React.useRef(0);
  const touchStartY = React.useRef(0);
  const isSwiping = React.useRef(false);

  if (workflowData && workflowData.is_active === false) {
    return null;
  }

  const eyebrow = workflowData?.subtitle || 'PROJECT WORKFLOW';
  const heading = workflowData?.title || 'From Requirement to Completion.';

  const defaultStepIcons = ['FileText', 'Compass', 'Users', 'Package', 'Wrench', 'Layers', 'CheckCircle2'];

  const steps =
    Array.isArray(workflowData?.steps) && workflowData!.steps.length > 0
      ? workflowData!.steps
      : [];

  const scrollToIndex = React.useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const cards = container.children;
    if (!cards || !cards[index]) return;

    const card = cards[index] as HTMLElement;
    const containerWidth = container.clientWidth;
    const cardWidth = card.offsetWidth;

    let targetScroll = 0;
    if (index === 0) {
      targetScroll = 0;
    } else {
      // Center active card with previous and next cards visible on both sides
      targetScroll = card.offsetLeft - (containerWidth - cardWidth) / 2;
    }

    container.scrollTo({
      left: Math.max(0, targetScroll),
      behavior: 'smooth',
    });
  }, []);

  const goToCard = React.useCallback(
    (index: number) => {
      setActiveIndex(index);
      scrollToIndex(index);
    },
    [scrollToIndex]
  );

  // Viewport intersection detection: Autoplay must NOT start before the section is visible
  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsInViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          if (entry.isIntersecting) {
            setIsInViewport(true);
            // Ensure that on first viewport entry we always start at card 01
            if (!hasInitializedRef.current) {
              hasInitializedRef.current = true;
              setActiveIndex(0);
              scrollToIndex(0);
            }
          } else {
            setIsInViewport(false);
          }
        }
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [scrollToIndex]);

  // Auto-swipe animation:
  // - Starts ONLY after the section is visible in the viewport
  // - First slide starts after a delay so card 01 is readable first
  // - Moves strictly one card at a time (01 -> 02 -> 03 -> 04 -> 05 -> 06 -> 07)
  // - Pauses while user is actively touching / interacting
  // - Disables once user manually swipes to respect their choice
  React.useEffect(() => {
    if (!isInViewport || isInteracting || hasManuallySwiped || steps.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % steps.length;
        scrollToIndex(next);
        return next;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isInViewport, isInteracting, hasManuallySwiped, steps.length, scrollToIndex]);

  // Touch gesture handling: once user manually swipes, permanently stop auto-swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = true;
    setIsInteracting(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsInteracting(false);
    if (!isSwiping.current) return;
    isSwiping.current = false;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Detect horizontal swipe intent
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
      setHasManuallySwiped(true); // User manually swiped -> respect user position & stop auto swipe
      if (deltaX < 0) {
        goToCard((activeIndex + 1) % steps.length);
      } else {
        goToCard((activeIndex - 1 + steps.length) % steps.length);
      }
    } else {
      scrollToIndex(activeIndex);
    }
  };

  const handleTouchCancel = () => {
    isSwiping.current = false;
    setIsInteracting(false);
  };

  if (steps.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 bg-white border-b border-sand/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Heading */}
        <div className="max-w-3xl mb-10 sm:mb-16 lg:mb-20">
          <div className="flex items-center space-x-2.5 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-olive" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-olive font-mono font-semibold">
              {eyebrow}
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-near-black font-normal tracking-tight leading-[1.15]">
            {heading}
          </h2>
        </div>

        {/* Mobile / Tablet Horizontal Carousel (Centered Active Card, One-Card-At-A-Time Snap, Subtle Zoom) */}
        <div className="lg:hidden relative">
          <div
            ref={scrollRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
            onMouseEnter={() => setIsInteracting(true)}
            onMouseLeave={() => setIsInteracting(false)}
            className="flex overflow-x-auto scrollbar-none gap-3.5 pb-4 pt-2 -mx-5 px-5 sm:mx-0 sm:px-0 scroll-smooth"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {steps.map((step, idx) => {
              const iconName = step.icon_name || defaultStepIcons[idx % defaultStepIcons.length];
              const isActive = idx === activeIndex;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setHasManuallySwiped(true);
                    goToCard(idx);
                  }}
                  className={`w-[74vw] max-w-[280px] sm:w-[300px] shrink-0 flex flex-col justify-between p-4 sm:p-5 bg-white border rounded-xs transition-all duration-300 ease-out cursor-pointer ${
                    isActive
                      ? 'scale-[1.03] border-olive/70 shadow-sm opacity-100 z-10'
                      : 'scale-100 border-sand/80 opacity-70'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 ${
                          isActive ? 'bg-olive text-white' : 'bg-sand/35 text-olive'
                        }`}
                      >
                        <IconResolver name={iconName} className="w-4 h-4" strokeWidth={1.5} />
                      </div>
                      <span
                        className={`font-serif text-2xl font-light select-none transition-colors duration-200 ${
                          isActive ? 'text-olive/60' : 'text-warm-grey/35'
                        }`}
                      >
                        0{idx + 1}
                      </span>
                    </div>

                    <h4 className="font-serif text-xs sm:text-sm font-semibold text-near-black uppercase tracking-wider leading-snug break-words hyphens-auto">
                      {step.title}
                    </h4>

                    {step.description && (
                      <p className="text-[11px] sm:text-xs text-near-black/75 font-light leading-relaxed break-words">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center pt-3 text-[10px] text-warm-grey/70 font-mono uppercase tracking-widest space-x-2">
            <button
              type="button"
              onClick={() => {
                setHasManuallySwiped(true);
                goToCard((activeIndex - 1 + steps.length) % steps.length);
              }}
              aria-label="Previous stage"
              className="p-1 hover:text-near-black text-warm-grey transition-colors select-none"
            >
              ←
            </button>
            <span>SWIPE STAGES</span>
            <button
              type="button"
              onClick={() => {
                setHasManuallySwiped(true);
                goToCard((activeIndex + 1) % steps.length);
              }}
              aria-label="Next stage"
              className="p-1 hover:text-near-black text-warm-grey transition-colors select-none"
            >
              →
            </button>
          </div>
        </div>

        {/* 7 Columns Editorial Layout (Desktop - Preserved) */}
        <div className="hidden lg:grid lg:grid-cols-7 gap-6 xl:gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className="flex flex-col space-y-2 group"
            >
              {/* Huge, Light, Elegant Gray Numeral */}
              <span className="font-serif text-5xl lg:text-6xl text-warm-grey/40 font-light select-none group-hover:text-olive/70 transition-colors">
                0{idx + 1}
              </span>

              {/* Bold Uppercase Step Title */}
              <h3 className="font-serif text-xs sm:text-sm font-semibold text-near-black uppercase tracking-[0.14em] leading-snug group-hover:text-olive transition-colors pt-1">
                {step.title}
              </h3>

              {/* Step Description */}
              {step.description && (
                <p className="text-xs text-warm-grey font-light leading-relaxed pt-1">
                  {step.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
