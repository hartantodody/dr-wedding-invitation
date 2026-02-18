'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { SIGNATURE_PATHS, SIGNATURE_VIEWBOX } from './signature-paths'

type SignatureProps = {
  className?: string
  strokeDuration?: number
  strokeStagger?: number
  strokeDelay?: number
  strokeWidth?: number
  fillFadeDuration?: number
  fillStartAt?: number
}

export default function Signature({
  className,
  strokeDuration = 3.5,
  strokeStagger = 0.15,
  strokeDelay = 0,
  strokeWidth = 1.2,
  fillFadeDuration = 1.2,
  fillStartAt = 0.6
}: SignatureProps) {
  const pathsD = useMemo(() => {
    return SIGNATURE_PATHS.filter((d) => (d ?? '').trim().length > 0)
  }, [])

  return (
    <svg
      viewBox={SIGNATURE_VIEWBOX}
      className={className}
      role='img'
      aria-label='Signature'
    >
      {pathsD.map((d, index) => {
        const strokeStart = Math.max(0, strokeDelay) + index * strokeStagger
        const fillStart = strokeStart + strokeDuration * fillStartAt

        return (
          <motion.path
            key={index}
            d={d}
            fill='currentColor'
            stroke='currentColor'
            strokeWidth={strokeWidth}
            strokeLinecap='round'
            strokeLinejoin='round'
            initial={{ pathLength: 0, fillOpacity: 0 }}
            animate={{ pathLength: 1, fillOpacity: 1 }}
            transition={{
              pathLength: {
                duration: strokeDuration,
                ease: 'easeOut',
                delay: strokeStart
              },
              fillOpacity: {
                duration: fillFadeDuration,
                ease: 'easeIn',
                delay: fillStart
              }
            }}
          />
        )
      })}
    </svg>
  )
}
