import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Home, Smartphone, Laptop, MapPin, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const technoTourData = [
  {
    id: "vehicles",
    title: "Vehicles and Transport Systems",
    introSnippet: "Modern vehicles are connected digital systems, generating data like a smartphone.",
    fullIntro: "Modern vehicles are no longer just mechanical machines—they are connected digital systems. In India, even mid-range cars now come with: GPS navigation, Mobile app connectivity, Bluetooth syncing, Cloud-based vehicle data. Brands like Tata Motors, Hyundai Motor India, and Mahindra & Mahindra offer connected car features through apps. This means your car is also a data-generating device, similar to a smartphone.",
    icon: Car
  },
  {
    id: "smart-home",
    title: "Smart Home Devices",
    introSnippet: "Internet-connected systems that monitor, automate, and control household functions.",
    fullIntro: "Smart home devices are internet-connected systems that allow users to monitor, automate, and control household functions remotely. In India, the adoption of smart devices has increased due to: Affordable internet, Growth of IoT (Internet of Things), Availability of budget smart devices. Common brands used in India include Xiaomi, Amazon (Alexa devices), and Google (Google Nest ecosystem). These devices make homes convenient—but also introduce serious privacy and surveillance risks if misused.",
    icon: Home
  },
  {
    id: "mobile-phones",
    title: "Mobile Phones",
    introSnippet: "The most personal and data-rich devices we use daily.",
    fullIntro: "Mobile phones are the most personal and data-rich devices we use daily. In India, smartphones are used for: Communication (calls, WhatsApp), Banking & UPI payments, Social media, Location tracking, Work & personal storage. Popular devices include brands like Samsung, Xiaomi, and Apple. Because of this, phones become the primary target for surveillance, stalking, and digital control.",
    icon: Smartphone
  },
  {
    id: "computers",
    title: "Computers & Online Accounts",
    introSnippet: "The central hub of digital identity, storing long-term, high-value data.",
    fullIntro: "Computers (laptops/desktops) and online accounts act as the central hub of digital identity. In India, they are widely used for: Education (assignments, research), Work (emails, documents, portals), Banking & financial management, Social media & communication. Devices from companies like HP, Dell, and Lenovo are commonly used. Unlike phones, computers often store long-term, high-value data, making them a major target for misuse.",
    icon: Laptop
  },
  {
    id: "tracking",
    title: "Tracking Technologies",
    introSnippet: "Tools used to monitor a person's location, movement, and behaviour.",
    fullIntro: "Tracking technologies are tools used to monitor a person's location, movement, and behaviour in real time or over a period. In India, these technologies are becoming more common due to: Cheap GPS devices available online, Widespread smartphone usage, Growth of app-based tracking features. While designed for safety and convenience, these tools can be misused for stalking, surveillance, and control.",
    icon: MapPin
  },
  {
    id: "everyday-apps",
    title: "Everyday Apps & Connected Services",
    introSnippet: "Systems that continuously collect personal, behavioural, and location-based data.",
    fullIntro: "Everyday apps and connected services are deeply integrated into modern life in India. They are used for: Navigation, Transportation, Financial transactions, Health monitoring, Device tracking. These systems continuously collect and process personal, behavioural, and location-based data. While they improve convenience, they also create multiple points of data exposure and surveillance.",
    icon: Globe
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

const InteractiveFlipCard = ({ data }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const Icon = data.icon;

  return (
    <motion.div variants={itemVariants}>
      <div 
        className="relative w-full h-[400px] cursor-pointer group hover:-translate-y-1 transition-transform duration-300" 
        style={{ perspective: "1000px" }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="w-full h-full relative"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 20, mass: 1.5 }}
        >
        {/* Front Face */}
        <div 
          className="absolute w-full h-full bg-white rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:shadow-xl transition-shadow duration-300"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="relative z-10 flex flex-col items-center text-center mt-8">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-6">
              <Icon size={32} className="text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">{data.title}</h3>
            <p className="text-slate-600 leading-relaxed text-sm">{data.introSnippet}</p>
          </div>
          
          <div className="relative z-10 flex items-center justify-center text-amber-500 text-sm font-bold tracking-wider uppercase opacity-80 mt-auto">
            <span>Tap to reveal</span>
          </div>
        </div>

        {/* Back Face */}
        <div 
          className="absolute w-full h-full bg-white rounded-2xl p-6 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:shadow-xl transition-shadow duration-300"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-4 border-b border-slate-100 pb-3">{data.title}</h3>
            <p className="text-slate-600 leading-relaxed text-sm mb-6">
              {data.fullIntro}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex-shrink-0">
            <Link 
              to={`/tech-tour/${data.id}`}
              onClick={(e) => e.stopPropagation()}
              className="w-full flex items-center justify-center gap-2 bg-white text-amber-500 border border-amber-500 hover:bg-amber-500 hover:text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200"
            >
              Explore Risk Analysis <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </motion.div>
      </div>
    </motion.div>
  );
};

export const TechnoTourTeaser = () => {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
            The Digital Surveillance Landscape
          </h2>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
            Everyday devices are silently tracking your movements, habits, and secrets. Discover the hidden risks in the technology you use daily.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {technoTourData.map((data, index) => (
            <InteractiveFlipCard key={index} data={data} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TechnoTourTeaser;
