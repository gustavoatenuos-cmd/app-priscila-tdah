"use client"

import { useEffect, useRef, useState } from "react"

interface Particle {
  x: number
  y: number
  speed: number
  opacity: number
  fadeDelay: number
  fadeStart: number
  fadingOut: boolean
  reset: () => void
  update: () => void
  draw: (ctx: CanvasRenderingContext2D) => void
}

export function ParticleHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()

  const createParticle = (canvas: HTMLCanvasElement): Particle => {
    const particle = {
      x: 0,
      y: 0,
      speed: 0,
      opacity: 1,
      fadeDelay: 0,
      fadeStart: 0,
      fadingOut: false,
      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.speed = Math.random() / 5 + 0.1
        this.opacity = 1
        this.fadeDelay = Math.random() * 600 + 100
        this.fadeStart = Date.now() + this.fadeDelay
        this.fadingOut = false
      },
      update() {
        this.y -= this.speed
        if (this.y < 0) this.reset()
        if (!this.fadingOut && Date.now() > this.fadeStart) this.fadingOut = true
        if (this.fadingOut) {
          this.opacity -= 0.008
          if (this.opacity <= 0) this.reset()
        }
      },
      draw(ctx: CanvasRenderingContext2D) {
        // Sage green / steel blue palette instead of cyan
        const r = 132 + Math.floor(Math.random() * 30)
        const g = 165 + Math.floor(Math.random() * 20)
        const b = 157 + Math.floor(Math.random() * 40)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity * 0.7})`
        ctx.fillRect(this.x, this.y, 0.5, Math.random() * 2.5 + 0.5)
      },
    }
    particle.reset()
    particle.y = Math.random() * canvas.height
    particle.fadeStart = Date.now() + particle.fadeDelay
    return particle
  }

  const calculateParticleCount = (canvas: HTMLCanvasElement) =>
    Math.floor((canvas.width * canvas.height) / 5000)

  const initParticles = (canvas: HTMLCanvasElement) => {
    particlesRef.current = Array.from({ length: calculateParticleCount(canvas) }, () =>
      createParticle(canvas)
    )
  }

  const animate = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particlesRef.current.forEach((p) => { p.update(); p.draw(ctx) })
    animationRef.current = requestAnimationFrame(() => animate(canvas, ctx))
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth
      canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight
      initParticles(canvas)
    }

    resize()
    animate(canvas, ctx)
    window.addEventListener("resize", resize)
    return () => {
      window.removeEventListener("resize", resize)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  )
}
