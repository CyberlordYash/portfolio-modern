import { FaReact } from "react-icons/fa";
import { FaHome, FaBriefcase, FaEnvelope } from "react-icons/fa";
import { HiHomeModern } from "react-icons/hi2";
import { TbLayoutDashboard } from "react-icons/tb";
import { MdOutlineMail } from "react-icons/md";
import {
  SiApachemaven,
  SiCss3,
  SiExpress,
  SiGradle,
  SiHibernate,
  SiJavascript,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPostman,
  SiReact,
  SiRedux,
  SiSanity,
  SiSass,
  SiSocketdotio,
  SiSpringboot,
} from "react-icons/si";

type NavItem = {
  name: string;
  link: string;
  icon: JSX.Element; // ✅ Correct
};

export const navItems: NavItem[] = [
  {
    name: "Home",
    link: "#home",
    icon: <HiHomeModern className="text-xl md:text-2xl" />,
  },
  {
    name: "Projects",
    link: "#projects",
    icon: <TbLayoutDashboard className="text-xl md:text-2xl" />,
  },
  {
    name: "Contact",
    link: "#contact",
    icon: <MdOutlineMail className="text-xl md:text-2xl" />,
  },
];

export const gridItems = [
  {
    id: 1,
    title: "Web Designer & Developer ",
    description:
      "I am a problem-solving full-stack developer with expertise in mobile and web application development. + A fast learner who thrives on collaborating with clients to develop efficient, scalable, and user-friendly solutions that address real-world challenges",
    className:
      "h-[40vh] bg-cover   lg:col-span-3 md:col-span-3 md:row-span-2 lg:min-h-[10vh]",
    imgClassName: "w-full h-full",
    titleClassName: "justify-end",
    img: "",
    spareImg: "",
  },
  {
    id: 2,
    title:
      "Driven by a thirst for innovation and a desire to make a tangible impact in the tech world",
    description: "",
    className: "h-[20vh]  lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "",
    spareImg: "",
  },

  {
    id: 3,
    title: "My tech stack",
    description: "I constantly try to improve",
    className: "h-[20vh] lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-center",
    img: "",
    spareImg: "",
  },
  {
    id: 4,
    title: "Let's create something amazing together!.",
    description: "",
    className: " lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "/grid.svg",
    spareImg: "/b4.svg",
  },

  {
    id: 5,
    title: "College: Indian Institue of Information Technology Sonepat",
    description: "Bachelor of Engineering in Computer Science",
    className: " md:col-span-3 md:row-span-2 text-md",
    imgClassName: "absolute right-0 bottom-0 md:w-96 w-60",
    titleClassName: "justify-center md:justify-start lg:justify-center",
    img: "/b5.svg",
    spareImg: "/grid.svg",
  },
  {
    id: 6,
    title: "Do you want to start a project together?",
    description: "",
    className: " lg:col-span-2 md:col-span-3 md:row-span-1 ",
    imgClassName: "",
    titleClassName: "justify-center md:max-w-full max-w-60 text-center",
    img: "",
    spareImg: "",
  },
];

export const projects = [
  {
    id: 8,
    title: "Secure File Share",
    des: "Built a secure file-sharing web application with user authentication & authorization (JWT, MFA) and role-based access control (RBAC).",
    img: "/fileshare.png",
    iconLists: [
      <SiSpringboot key="spring" className="w-5 h-5 text-green-500" />,
      <SiJavascript key="java" className="w-5 h-5 text-orange-500" />,
      <SiApachemaven key="maven" className="w-5 h-5 text-red-500" />,
      <SiGradle key="gradle" className="w-5 h-5 text-gray-400" />,
      <SiHibernate key="hibernate" className="w-5 h-5 text-yellow-500" />,
    ],
    link: "https://github.com/CyberlordYash/SecureFileShare",
  },
  {
    id: 1,
    title: "Brain Bytes",
    des: "Collaborate and learn! Share your notes on this MERN-powered platform. FInd,create and discuss study materials with ease",
    img: "/brainbytes.jpg",
    iconLists: [
      <SiMongodb key="mongodb" className="w-5 h-5 text-green-500" />,
      <SiExpress key="express" className="w-5 h-5 text-gray-300" />, // Express icon is gray by default
      <SiReact key="react" className="w-5 h-5 text-cyan-400" />,
      <SiNodedotjs key="node" className="w-5 h-5 text-green-600" />,
      <SiRedux key="redux" className="w-5 h-5 text-purple-500" />,
    ],
    link: "https://brainbytes-yash.netlify.app/",
  },
  {
    id: 2,
    title: "Flow Chat",
    des: "Collaborate and learn! Share gour notes on this MERN-powered platform. Find, create, and discuss study materials with ease.",
    img: "/flowchat.jpg",
    iconLists: [
      <SiMongodb key="mongodb" className="w-5 h-5 text-green-500" />,
      <SiExpress key="express" className="w-5 h-5 text-gray-300" />,
      <SiNodedotjs key="node" className="w-5 h-5 text-green-600" />,
      <SiSocketdotio key="socketio" className="w-5 h-5 text-yellow-400" />,
    ],
    link: "https://flowchat-rcnd.onrender.com/",
  },
  {
    id: 3,
    title: "E bazaar",
    des: "A robust CRUD e-commerce website,browse products, add items to their cart, and complete purchases",
    img: "/ebazaar.jpg",
    iconLists: [
      <SiNextdotjs key="nextjs" className="w-5 h-5 text-white" />, // Next.js (white/black depending on theme)
      <SiCss3 key="css" className="w-5 h-5 text-blue-500" />, // CSS
      <SiSass key="scss" className="w-5 h-5 text-pink-400" />, // SCSS (Sass)
      <SiSanity key="sanity" className="w-5 h-5 text-red-500" />, // Sanity CMS
      <SiRedux key="redux" className="w-5 h-5 text-purple-500" />,
    ],
    link: "https://dev-yash-ebazaar.netlify.app/",
  },
  {
    id: 4,
    title: "Summarize it",
    des: "Summarize any sites with openAI GPT4",
    img: "/summarise.jpg",
    iconLists: [
      <SiMongodb key="mongodb" className="w-5 h-5 text-green-500" />, // MongoDB
      <SiExpress key="express" className="w-5 h-5 text-gray-300" />, // Express
      <SiNodedotjs key="node" className="w-5 h-5 text-green-600" />, // Node.js
      <SiPostman key="postman" className="w-5 h-5 text-orange-500" />,
    ],
    link: "https://dev-yash-summarizeit.netlify.app/",
  },
];

export const testimonials = [
  { quote: "React.js", name: "Frontend Development", title: "1" },
  { quote: "Next.js", name: "Fullstack Development", title: "2" },
  { quote: "JavaScript (ES6+)", name: "Programming", title: "3" },
  { quote: "C++", name: "DSA & Competitive Programming", title: "4" },
  { quote: "SQL / PostgreSQL", name: "Database Management", title: "5" },
  { quote: "Node.js", name: "Backend Development", title: "6" },
  { quote: "MongoDB", name: "NoSQL Databases", title: "7" },
  { quote: "Golang", name: "Backend & HFT Systems", title: "8" },
  { quote: "Spring Boot", name: "Java Backend Framework", title: "9" },
  { quote: "Java", name: "Object-Oriented Programming", title: "10" },
  { quote: "PostgreSQL", name: "Relational Databases", title: "11" },
  { quote: "TailwindCSS", name: "UI Styling & Design", title: "12" },
  {
    quote: "GCP",
    name: "Cloud Infrastructure",
    title: "13",
  },
  {
    quote: "Git / GitHub",
    name: "Version Control & Collaboration",
    title: "14",
  },
];

export const companies = [
  {
    id: 1,
    name: "cloudinary",
    img: "/cloud.svg",
    nameImg: "/cloudName.svg",
  },
  {
    id: 2,
    name: "appwrite",
    img: "/app.svg",
    nameImg: "/appName.svg",
  },
  {
    id: 3,
    name: "HOSTINGER",
    img: "/host.svg",
    nameImg: "/hostName.svg",
  },
  {
    id: 4,
    name: "stream",
    img: "/s.svg",
    nameImg: "/streamName.svg",
  },
  {
    id: 5,
    name: "docker.",
    img: "/dock.svg",
    nameImg: "/dockerName.svg",
  },
];

export const workExperience = [
  {
    id: 6,
    title: "Associate Software Engineer @ Zanskar Securities",
    desc: [
      "• Building low-latency backend systems in Go for high-frequency trading (HFT)",
      "• Working on real-time data processing and order execution pipelines",
      "• Optimizing performance using Go routines, channels, and efficient system design",
    ],

    className: " md:col-span-11 w-[100%]",
    thumbnail: "/logo.jpg",
    date: "July 2025 - Present",
  },
  {
    id: 5,
    title: "Software Developer Intern @ Onefinnet",
    desc: [
      "• Building Responsive, High-Performance Web Solutions",
      "• Leading frontend development for key projects like Spot Chat Platform and Meeting Platform, boosting customer engagement and revenue",
      "• Spearheading backend development for critical projects, leveraging Go language to build scalable and efficient systems.",
    ],
    className: " md:col-span-11 w-[100%]",
    thumbnail: "/onefinnet.png",
    date: "January 2025 - June 2025",
  },
  {
    id: 0,
    title: "Software Developer Intern @ Modulus Technologies LLP",
    desc: [
      "• Developed a robust SAAS Billing application remotely using NextJS, FeatherJS, PostgreSQL, Typescript, and TailwindCSS.",
      "• Engineered a Billing SAAS application with comprehensive business logic, including customer management, invoicing, company details, GST handling, and Chart of Accounts.",
      "• Migrated the billing management system from React to Next.js, reducing page load times by 30% and improving user retention rates.",
      "• Automated customer contact via email and WhatsApp for pending invoices, improving invoice recovery rates by 60%.",
      "• Designed a scalable backend architecture using PostgreSQL, FeatherJS, and GCP.",
    ],
    className: " md:col-span-11  w-[100%]",
    thumbnail: "/ambill.jpg",
    date: "July 2024 - October 2024",
  },
  {
    id: 4,
    title: "Software Development",
    desc: [
      "Developed and maintained user-facing features using modern technologies.",
    ],
    className: " md:col-span-5",
    thumbnail: "/hero.png",
  },
  {
    id: 1,
    title: "Guardian @ Leetcode (2200+)",
    desc: [
      " Solved over 1300+ problems with multiple contests to earn the Guardian badge",
    ],
    className: " md:col-span-5",
    thumbnail: "/guardian.gif",
  },
  {
    id: 2,
    title: "4 Star @ Codechef (1850+)",
    desc: [" Solved over 50+ problems on codechef contests to earn 3 stars"],
    className: " md:col-span-5", // change to md:col-span-2
    thumbnail: "/codechef.svg",
  },
  {
    id: 3,
    title: "NDA",
    desc: [
      "Got recommendation letter from Indian Army Officer Entry NDA after clearing 5day long SSB process with AIR: 193",
    ],
    className: "md:col-span-5", // change to md:col-span-2
    thumbnail: "/soldier.svg",
  },
];

export const socialMedia = [
  {
    id: 1,
    img: "/git.svg",
    link: "https://github.com/CyberlordYash",
  },
  {
    id: 2,
    img: "/twit.svg",
  },
  {
    id: 3,
    img: "/link.svg",
    link: "https://www.linkedin.com/in/yash-sachan-187405209/",
  },
];
