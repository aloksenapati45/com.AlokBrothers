import React, { useEffect, useRef } from 'react';

export default function FishBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    /* ── Caustic light patches ── */
    const caustics = Array.from({ length: 35 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * 0.8,
      rx: 25 + Math.random() * 80,
      ry: 10 + Math.random() * 35,
      rot: Math.random() * Math.PI,
      phase: Math.random() * Math.PI * 2,
      speed: 0.005 + Math.random() * 0.012,
      alpha: 0.03 + Math.random() * 0.07,
    }));

    /* ── Marine snow / floating particles ── */
    const particles = Array.from({ length: 60 }, () => mkParticle());
    function mkParticle() {
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: 0.5 + Math.random() * 2.5,
        vy: 0.08 + Math.random() * 0.25,
        vx: (Math.random() - 0.5) * 0.25,
        alpha: 0.08 + Math.random() * 0.28,
        wobble: Math.random() * Math.PI * 2,
        wSpeed: 0.01 + Math.random() * 0.02,
      };
    }

    /* ── Bubbles ── */
    const bubbles = Array.from({ length: 22 }, () => mkBubble());
    function mkBubble() {
      return {
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 30,
        r: 1.5 + Math.random() * 5,
        speed: 0.3 + Math.random() * 0.6,
        wobble: Math.random() * Math.PI * 2,
        wSpeed: 0.015 + Math.random() * 0.025,
        alpha: 0.12 + Math.random() * 0.3,
      };
    }

    /* ── God rays ── */
    const rays = Array.from({ length: 10 }, () => ({
      x: -200 + Math.random() * (window.innerWidth + 400),
      width: 20 + Math.random() * 55,
      phase: Math.random() * Math.PI * 2,
      speed: 0.004 + Math.random() * 0.007,
      alpha: 0.025 + Math.random() * 0.055,
      drift: (Math.random() - 0.5) * 0.15,
    }));

    /* ── Fish bezier path ── */
    // Fish travels along a looping figure-eight-ish bezier, very smooth
    let fishT = 0;        // 0..1 around the loop
    const FISH_SPEED = 0.0012;

    // Control points for a gentle loop across the screen
    function fishPos(t) {
      // Parametric ellipse + sine bob
      const cx = canvas.width * 0.5;
      const cy = canvas.height * 0.5;
      const rx = canvas.width * 0.36;
      const ry = canvas.height * 0.18;
      const ang = t * Math.PI * 2;
      const bob = Math.sin(ang * 2.5) * canvas.height * 0.06;
      return {
        x: cx + Math.cos(ang) * rx,
        y: cy + Math.sin(ang) * ry + bob,
      };
    }

    // Surface wave offsets
    const surfOff = [0, 0, 0];

    function drawWater() {
      const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
      g.addColorStop(0,    'rgba(30, 120, 200, 0.28)');
      g.addColorStop(0.4,  'rgba(15,  80, 150, 0.30)');
      g.addColorStop(0.8,  'rgba(8,   50, 105, 0.32)');
      g.addColorStop(1,    'rgba(4,   25,  65, 0.38)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawRays() {
      rays.forEach(r => {
        r.phase += r.speed;
        r.x += r.drift;
        if (r.x > canvas.width + 300) r.x = -300;
        if (r.x < -300) r.x = canvas.width + 300;
        const a = r.alpha * (0.5 + 0.5 * Math.sin(r.phase));
        const rg = ctx.createLinearGradient(r.x, 0, r.x + r.width * 2.5, canvas.height * 0.9);
        rg.addColorStop(0, `rgba(170,220,255,${a})`);
        rg.addColorStop(0.6, `rgba(140,200,255,${a * 0.4})`);
        rg.addColorStop(1, 'rgba(140,200,255,0)');
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(r.x, 0);
        ctx.lineTo(r.x + r.width, 0);
        ctx.lineTo(r.x + r.width * 3.8, canvas.height * 0.9);
        ctx.lineTo(r.x - r.width * 2.8, canvas.height * 0.9);
        ctx.closePath();
        ctx.fillStyle = rg;
        ctx.fill();
        ctx.restore();
      });
    }

    function drawCaustics() {
      caustics.forEach(c => {
        c.phase += c.speed;
        const s = 0.5 + 0.5 * Math.abs(Math.sin(c.phase));
        const a = c.alpha * (0.4 + 0.6 * Math.abs(Math.sin(c.phase * 0.6)));
        ctx.save();
        ctx.globalAlpha = a;
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot + c.phase * 0.25);
        // outer ring
        ctx.beginPath();
        ctx.ellipse(0, 0, c.rx * s, c.ry * s, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(190,235,255,1)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        // inner fill glow
        const ig = ctx.createRadialGradient(0, 0, 0, 0, 0, c.rx * s * 0.6);
        ig.addColorStop(0, 'rgba(210,245,255,0.18)');
        ig.addColorStop(1, 'rgba(210,245,255,0)');
        ctx.beginPath();
        ctx.ellipse(0, 0, c.rx * s * 0.6, c.ry * s * 0.6, 0, 0, Math.PI * 2);
        ctx.fillStyle = ig;
        ctx.fill();
        ctx.restore();
      });
    }

    function drawParticles() {
      particles.forEach((p, i) => {
        p.wobble += p.wSpeed;
        p.y += p.vy;
        p.x += p.vx + Math.sin(p.wobble) * 0.15;
        if (p.y > canvas.height + 10) particles[i] = mkParticle();
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200,230,255,1)';
        ctx.fill();
        ctx.restore();
      });
    }

    function drawBubbles() {
      bubbles.forEach((b, i) => {
        b.wobble += b.wSpeed;
        b.y -= b.speed;
        b.x += Math.sin(b.wobble) * 0.45;
        if (b.y < -15) bubbles[i] = mkBubble();
        ctx.save();
        // body
        ctx.globalAlpha = b.alpha;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(210,245,255,0.9)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
        // inner tint
        const bg = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        bg.addColorStop(0, 'rgba(200,240,255,0.18)');
        bg.addColorStop(1, 'rgba(200,240,255,0)');
        ctx.fillStyle = bg;
        ctx.fill();
        // shine
        ctx.globalAlpha = b.alpha * 1.6;
        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.32, b.y - b.r * 0.32, b.r * 0.28, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.fill();
        ctx.restore();
      });
    }

    function drawSurface() {
      for (let i = 0; i < 3; i++) {
        surfOff[i] += [0.013, 0.019, 0.008][i];
        ctx.save();
        ctx.globalAlpha = [0.11, 0.07, 0.05][i];
        ctx.beginPath();
        const yb = [25, 50, 15][i];
        ctx.moveTo(0, yb);
        for (let x = 0; x <= canvas.width; x += 8) {
          ctx.lineTo(x, yb + Math.sin(x * [0.009, 0.013, 0.007][i] + surfOff[i]) * [16, 10, 20][i]);
        }
        ctx.lineTo(canvas.width, 0);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fillStyle = 'rgba(190,230,255,1)';
        ctx.fill();
        ctx.restore();
      }
    }

    /* depth fog vignette */
    function drawVignette() {
      const vg = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.height * 0.3,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.78,
      );
      vg.addColorStop(0, 'rgba(2,10,30,0)');
      vg.addColorStop(1, 'rgba(2,10,30,0.18)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawWater();
      drawRays();
      drawCaustics();
      drawParticles();
      drawBubbles();
      drawSurface();
      drawVignette();
      fishT = (fishT + FISH_SPEED) % 1;
      animId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  /* Fish position via CSS custom property updated each frame */
  return (
    <>
      {/* Real underwater scene as base */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: -3,
        backgroundImage: "url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=3840&q=100')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(1.35) saturate(1.1)',
      }} />

      {/* Animated canvas overlay */}
      <canvas ref={canvasRef} style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -2,
        pointerEvents: 'none',
        opacity: 0.7,
      }} />

      </>
  );
}
