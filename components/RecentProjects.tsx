import { projects } from "@/data";
import React from "react";
import { FaLocationArrow } from "react-icons/fa";
import { motion } from "framer-motion";

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const hoverEffect = {
  scale: 1.04,
  y: -5,
  boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
  transition: {
    type: "spring",
    stiffness: 200,
    damping: 15,
  },
};

const RecentProjects = () => {
  return (
    <section className="py-12 w-full max-w-7xl mx-auto px-4" id="projects">
      <h1 className="text-center text-3xl sm:text-4xl font-Orbitron font-bold mb-10 dark:text-blue-800 text-blue-200">
        My <span className="">Projects</span> Section
      </h1>

      <div className="flex flex-wrap justify-center gap-6">
        {projects.map(({ id, title, des, img, iconLists, link }, index) => (
          <motion.div
            key={id}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            whileHover={hoverEffect}
            className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden w-[85vw] sm:w-[380px] transition-all cursor-pointer"
          >
            {/* Image */}
            <div className="relative h-[170px] w-full">
              <img
                src={img}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-5">
              <h2 className="font-semibold text-lg sm:text-xl mb-1 line-clamp-1">
                {title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                {des}
              </p>

              {/* Icons */}
              <div className="flex items-center space-x-2 mb-4">
                {iconLists.map((icon, index) => (
                  <div
                    key={icon}
                    className="bg-black border border-white/20 rounded-md w-8 h-8 flex items-center justify-center"
                  >
                    <img
                      src={icon}
                      alt={icon}
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                ))}
              </div>

              {/* Link */}
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-purple hover:underline text-sm"
              >
                Check Live Site{" "}
                <FaLocationArrow className="ml-2" color="#CBACF9" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default RecentProjects;
