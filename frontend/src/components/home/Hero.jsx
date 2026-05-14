import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import SeamlessVideoBackground from './SeamlessVideoBackground';


// 3D Particle Background
function ParticleField(props) {
  const ref = useRef();

  // Generate a sphere of particles using an array size strictly divisible by 3
  const sphere = useMemo(() => {
    // 5000 particles * 3 dimensions (x, y, z) = 15000
    const positions = new Float32Array(15000);
    random.inSphere(positions, { radius: 1.5 });

    // Fallback sanitation just in case maath fails
    for (let i = 0; i < positions.length; i++) {
      if (isNaN(positions[i])) positions[i] = 0;
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    // Slow rotation
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#D4AF37" // Forensic Gold
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative h-screen min-h-[800px] bg-primary overflow-hidden flex items-center pt-20">
      <SeamlessVideoBackground />
      {/* 3D Background Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas gl={{ antialias: true, alpha: true }} camera={{ position: [0, 0, 1] }}>
          <Suspense fallback={null}>
            <ParticleField />
          </Suspense>
        </Canvas>
        {/* Deep Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/60 to-primary pointer-events-none" />
      </div>

      <Container className="relative z-10 flex flex-col items-center justify-center text-center w-full">
        <motion.div
          style={{ y: y2, opacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* Subtle Logo representation or badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            className="mb-8 p-0.5 rounded-full bg-gradient-to-r from-accent/50 to-transparent backdrop-blur-md"
          >
            <div className="px-6 py-2 rounded-full bg-primary/80 border border-white/10 text-slate-300 text-sm tracking-widest uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_10px_#D4AF37]"></span>
              International Forensic Standards
            </div>
          </motion.div>

          {/* Text Reveal Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold text-white mb-6 tracking-tight">
            Scientific Truth. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-cyan drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              Legal Strength.
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            Delivering scientifically precise, ethically grounded, and legally admissible forensic solutions to strengthen the justice delivery system worldwide.
          </p>

          <motion.div
            style={{ y: y1 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/contact" className="relative group overflow-hidden rounded-lg flex items-center justify-center bg-accent text-primary px-8 py-4 font-bold text-lg transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)]">
                <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                <span className="flex items-center gap-2 relative z-10">
                  Book Consultation <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/services" className="rounded-lg flex items-center justify-center bg-white/5 border border-white/10 backdrop-blur-xl text-white px-8 py-4 font-bold text-lg hover:bg-white/10 transition-all">
                Explore Services
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
