'use client'

import { DiscIcon, PauseIcon, PlayIcon } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import { COPY, type AppLanguage } from '@/constant/i18n'

type BackgroundMusicPlayerProps = {
  language: AppLanguage
}

export type BackgroundMusicPlayerHandle = {
  requestPlay: () => void
}

const DISC_SPIN = {
  duration: 2.2,
  repeat: Number.POSITIVE_INFINITY,
  ease: 'linear' as const
}
const DEFAULT_VOLUME = 0.16

const BackgroundMusicPlayer = forwardRef<
  BackgroundMusicPlayerHandle,
  BackgroundMusicPlayerProps
>(function BackgroundMusicPlayer(
  { language }: BackgroundMusicPlayerProps,
  ref
) {
  const copy = COPY[language]
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasIntent, setHasIntent] = useState(false)

  const audioSrc = useMemo(
    () => encodeURI('/sounds/keshi - Forever (Official Visualizer).mp3'),
    []
  )

  const tryPlay = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return

    setHasIntent(true)
    setIsLoading(!isReady)
    audio.volume = DEFAULT_VOLUME

    try {
      await audio.play()
      setIsPlaying(true)
      setIsLoading(false)
    } catch {
      setIsPlaying(false)
    }
  }, [isReady])

  const handleToggle = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    await tryPlay()
  }

  useImperativeHandle(
    ref,
    () => ({
      requestPlay: () => {
        void tryPlay()
      }
    }),
    [tryPlay]
  )

  return (
    <>
      <audio
        ref={audioRef}
        src={audioSrc}
        preload='auto'
        loop
        onLoadedMetadata={() => {
          const audio = audioRef.current
          if (!audio) return
          audio.volume = DEFAULT_VOLUME
        }}
        onLoadStart={() => {
          setIsLoading(true)
        }}
        onCanPlay={() => {
          setIsReady(true)
          setIsLoading(false)
        }}
        onWaiting={() => {
          if (hasIntent) {
            setIsLoading(true)
          }
        }}
        onPlaying={() => {
          setIsLoading(false)
          setIsPlaying(true)
        }}
        onPause={() => {
          setIsPlaying(false)
        }}
        onEnded={() => {
          setIsPlaying(false)
        }}
      />

      <div className='fixed right-4 z-50 flex items-end gap-2 bottom-[calc(env(safe-area-inset-bottom)+4.8rem)] sm:bottom-5 sm:right-5'>
        {isLoading && hasIntent ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className='rounded-full border border-[rgb(223_230_227/0.3)] bg-[rgb(12_12_14/0.84)] px-3 py-1.5 text-[0.58rem] uppercase tracking-[0.14em] text-[rgb(223_230_227/0.86)] backdrop-blur-md'
          >
            {copy.music.loading}
          </motion.div>
        ) : null}

        <button
          type='button'
          onClick={handleToggle}
          className='group relative inline-flex h-8 items-center gap-2 rounded-full border border-[rgb(223_230_227/0.32)] bg-[rgb(10_10_12/0.9)] px-2.5 shadow-[0_10px_26px_rgb(0_0_0/0.38)] backdrop-blur-md transition hover:bg-[rgb(20_20_24/0.95)] sm:h-9 sm:px-3'
          aria-label={isPlaying ? copy.music.pause : copy.music.play}
        >
          {isPlaying ? (
            <PauseIcon
              weight='fill'
              className='h-4 w-4 text-[rgb(218_193_138/0.98)]'
            />
          ) : (
            <PlayIcon
              weight='fill'
              className='h-4 w-4 translate-x-[1px] text-[rgb(218_193_138/0.98)]'
            />
          )}

          <motion.div
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={
              isPlaying ? DISC_SPIN : { duration: 0.35, ease: 'easeOut' }
            }
            className='text-[rgb(218_193_138/0.98)] [filter:drop-shadow(0_0_6px_rgb(200_180_139/0.45))]'
          >
            <DiscIcon weight='duotone' className='h-6 w-6 sm:h-7 sm:w-7' />
          </motion.div>

          {/* <span className='pointer-events-none absolute inset-0 grid place-items-center'> */}

          {/* </span> */}

          <span className='pointer-events-none absolute -top-6 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-full bg-[rgb(8_8_10/0.9)] px-2 py-0.5 text-[0.52rem] uppercase tracking-[0.12em] text-[rgb(223_230_227/0.8)] group-hover:block sm:text-[0.56rem]'>
            {isPlaying ? copy.music.pause : copy.music.play}
          </span>
        </button>
      </div>
    </>
  )
})

export default BackgroundMusicPlayer
