import { useCallback, useEffect, useRef, useState } from 'react'
import { Box, Flex, HStack, IconButton, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import {
  Maximize,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react'

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

type SeekBarProps = {
  progress: number
  duration: number
  onSeek: (pct: number) => void
  onScrubStart?: () => void
  onScrubEnd?: () => void
}

function SeekBar({ progress, duration, onSeek, onScrubStart, onScrubEnd }: SeekBarProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [hoverPct, setHoverPct] = useState(0)

  const pctFromClientX = useCallback((clientX: number) => {
    const track = trackRef.current
    if (!track) return 0
    const rect = track.getBoundingClientRect()
    if (rect.width <= 0) return 0
    return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
  }, [])

  const seekAt = useCallback(
    (clientX: number) => {
      const pct = pctFromClientX(clientX)
      setHoverPct(pct)
      onSeek(pct)
    },
    [onSeek, pctFromClientX],
  )

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
    onScrubStart?.()
    seekAt(e.clientX)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const pct = pctFromClientX(e.clientX)
    setHoverPct(pct)
    if (dragging) seekAt(e.clientX)
  }

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return
    e.currentTarget.releasePointerCapture(e.pointerId)
    setDragging(false)
    onScrubEnd?.()
  }

  const showValue = hovering || dragging
  const tooltipPct = dragging ? progress : hoverPct
  const tooltipTime = duration > 0 ? (tooltipPct / 100) * duration : 0

  return (
    <Box
      position="relative"
      pt={2}
      pb={2}
      mb={1}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        if (!dragging) setHovering(false)
      }}
    >
      {showValue && duration > 0 && (
        <Box
          position="absolute"
          top={0}
          left={`${tooltipPct}%`}
          transform="translateX(-50%)"
          px={2}
          py={0.5}
          borderRadius="6px"
          bg="blackAlpha.800"
          border="1px solid"
          borderColor="whiteAlpha.300"
          fontSize="10px"
          fontWeight="700"
          fontFamily="mono"
          color="white"
          pointerEvents="none"
          zIndex={3}
          whiteSpace="nowrap"
        >
          {formatTime(tooltipTime)}
        </Box>
      )}

      <Box
        ref={trackRef}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        h={hovering || dragging ? '8px' : '4px'}
        borderRadius="full"
        bg="whiteAlpha.300"
        cursor="pointer"
        position="relative"
        transition="height 0.15s ease"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        touchAction="none"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          h="full"
          w={`${progress}%`}
          borderRadius="full"
          bg="blue.500"
          pointerEvents="none"
        />

        {(hovering || dragging) && (
          <Box
            position="absolute"
            top="50%"
            left={`${progress}%`}
            transform="translate(-50%, -50%)"
            w="14px"
            h="14px"
            borderRadius="full"
            bg="white"
            boxShadow="0 0 0 2px rgba(59,130,246,0.85)"
            pointerEvents="none"
            transition={dragging ? 'none' : 'left 0.05s linear'}
          />
        )}
      </Box>
    </Box>
  )
}

type CustomVideoPlayerProps = {
  src: string
  aspectRatio?: string
  fill?: boolean
  width?: number
  height?: number
}

export function CustomVideoPlayer({
  src,
  aspectRatio = '16 / 9',
  fill = false,
  width,
  height,
}: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [muted, setMuted] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [scrubbing, setScrubbing] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const controlsVisible = hovering || scrubbing || !playing || showControls

  const resetHideTimer = useCallback(() => {
    setShowControls(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => {
      if (!scrubbing) setShowControls(false)
    }, 2800)
  }, [scrubbing])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    setPlaying(false)
    setCurrent(0)
    setDuration(0)
    v.load()
  }, [src])

  useEffect(() => () => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
  }, [])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      void v.play()
      setPlaying(true)
    } else {
      v.pause()
      setPlaying(false)
    }
    resetHideTimer()
  }

  const seek = (value: number) => {
    const v = videoRef.current
    if (!v || !duration) return
    v.currentTime = (value / 100) * duration
    setCurrent(v.currentTime)
    resetHideTimer()
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
    resetHideTimer()
  }

  const toggleFullscreen = async () => {
    const el = containerRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      await el.requestFullscreen()
    } else {
      await document.exitFullscreen()
    }
    resetHideTimer()
  }

  const progress = duration > 0 ? (current / duration) * 100 : 0

  const playerStyle = fill
    ? {
        position: 'relative' as const,
        w: width && width > 0 ? `${width}px` : '100%',
        h: height && height > 0 ? `${height}px` : '100%',
        maxW: '100%',
        maxH: '100%',
        bg: '#000000',
        overflow: 'hidden',
      }
    : {
        position: 'relative' as const,
        w: 'full',
        aspectRatio,
        maxH: '70vh',
        mx: 'auto',
        bg: '#000000',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(0,0,0,0.55)',
      }

  return (
    <Box
      ref={containerRef}
      {...playerStyle}
      onMouseEnter={() => {
        setHovering(true)
        resetHideTimer()
      }}
      onMouseLeave={() => {
        setHovering(false)
        if (playing && !scrubbing) setShowControls(false)
      }}
      onMouseMove={resetHideTimer}
    >
      <video
        ref={videoRef}
        src={src}
        preload="metadata"
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        onClick={togglePlay}
        onTimeUpdate={() => {
          if (!scrubbing) setCurrent(videoRef.current?.currentTime ?? 0)
        }}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />

      {!playing && (
        <Flex
          position="absolute"
          inset={0}
          align="center"
          justify="center"
          pointerEvents="none"
          zIndex={1}
        >
          <Box
            w="56px"
            h="56px"
            borderRadius="full"
            bg="rgba(15,23,42,0.65)"
            border="1px solid rgba(148,163,184,0.3)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            backdropFilter="blur(6px)"
            opacity={hovering ? 1 : 0.85}
            transition="opacity 0.2s"
          >
            <Play size={22} color="white" fill="white" style={{ marginLeft: 3 }} />
          </Box>
        </Flex>
      )}

      <motion.div
        initial={false}
        animate={{ opacity: controlsVisible ? 1 : 0, y: controlsVisible ? 0 : 10 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2,
          pointerEvents: controlsVisible ? 'auto' : 'none',
        }}
      >
        <Box
          px={3}
          pt={8}
          pb={3}
          background="linear-gradient(transparent, rgba(0,0,0,0.88))"
        >
          <SeekBar
            progress={progress}
            duration={duration}
            onSeek={seek}
            onScrubStart={() => setScrubbing(true)}
            onScrubEnd={() => {
              setScrubbing(false)
              resetHideTimer()
            }}
          />

          <HStack justify="space-between" align="center">
            <HStack gap={1}>
              <IconButton
                aria-label={playing ? 'Pause' : 'Play'}
                size="xs"
                variant="ghost"
                color="white"
                borderRadius="full"
                _hover={{ bg: 'whiteAlpha.200' }}
                onClick={togglePlay}
              >
                {playing ? <Pause size={16} /> : <Play size={16} />}
              </IconButton>

              <IconButton
                aria-label={muted ? 'Unmute' : 'Mute'}
                size="xs"
                variant="ghost"
                color="white"
                borderRadius="full"
                _hover={{ bg: 'whiteAlpha.200' }}
                onClick={toggleMute}
              >
                {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </IconButton>

              <Text fontSize="xs" fontWeight="600" color="whiteAlpha.900" fontFamily="mono" minW="80px">
                {formatTime(current)} / {formatTime(duration)}
              </Text>
            </HStack>

            <IconButton
              aria-label="Fullscreen"
              size="xs"
              variant="ghost"
              color="white"
              borderRadius="full"
              _hover={{ bg: 'whiteAlpha.200' }}
              onClick={() => void toggleFullscreen()}
            >
              <Maximize size={15} />
            </IconButton>
          </HStack>
        </Box>
      </motion.div>
    </Box>
  )
}
