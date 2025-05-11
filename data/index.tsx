import { FaReact } from "react-icons/fa";
import { FaHome, FaBriefcase, FaEnvelope } from "react-icons/fa";
import { HiHomeModern } from "react-icons/hi2";
import { TbLayoutDashboard } from "react-icons/tb";
import { MdOutlineMail } from "react-icons/md";

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
      " bg-[#293d9a] bg-cover text-white  lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]",
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
    className:
      " text-white bg-[#293d9a] lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "",
    spareImg: "",
  },

  {
    id: 3,
    title: "My tech stack",
    description: "I constantly try to improve",
    className:
      " text-white bg-[#554590] lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-center",
    img: "",
    spareImg: "",
  },
  {
    id: 4,
    title: "Let's create something amazing together!.",
    description: "",
    className:
      " text-white bg-[#06638d] lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "/grid.svg",
    spareImg: "/b4.svg",
  },

  {
    id: 5,
    title: "College: Indian Institue of Information Technology Sonepat",
    description: "Bachelor of Engineering in Computer Science",
    className: " text-white bg-[#06638d] md:col-span-3 md:row-span-2 text-md",
    imgClassName: "absolute right-0 bottom-0 md:w-96 w-60",
    titleClassName: "justify-center md:justify-start lg:justify-center",
    img: "/b5.svg",
    spareImg: "/grid.svg",
  },
  {
    id: 6,
    title: "Do you want to start a project together?",
    description: "",
    className:
      " text-white bg-[#293d9a] lg:col-span-2 md:col-span-3 md:row-span-1 ",
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
    img: "https://de.fi-group.com/wp-content/uploads/sites/19/2023/10/headers-sectors-cybersecurity.webp",
    iconLists: ["/re.svg", "/tail.svg", "/ts.svg", "/three.svg", "/fm.svg"],
    link: "https://github.com/CyberlordYash/SecureFileShare",
  },
  {
    id: 1,
    title: "Brain Bytes",
    des: "Collaborate and learn! Share your notes on this MERN-powered platform. FInd,create and discuss study materials with ease",
    img: "/brainbytes.jpg",
    iconLists: ["/re.svg", "/tail.svg", "/ts.svg", "/three.svg", "/fm.svg"],
    link: "https://brainbytes-yash.netlify.app/",
  },
  {
    id: 2,
    title: "Flow Chat",
    des: "Collaborate and learn! Share gour notes on this MERN-powered platform. Find, create, and discuss study materials with ease.",
    img: "/flowchat.jpg",
    iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/stream.svg", "/c.svg"],
    link: "https://flowchat-rcnd.onrender.com/",
  },
  {
    id: 3,
    title: "E bazaar",
    des: "A robust CRUD e-commerce website,browse products, add items to their cart, and complete purchases",
    img: "/ebazaar.jpg",
    iconLists: ["/re.svg", "/tail.svg", "/ts.svg", "/three.svg", "/c.svg"],
    link: "https://dev-yash-ebazaar.netlify.app/",
  },
  {
    id: 4,
    title: "Summarize it",
    des: "Summarize any sites with openAI GPT4",
    img: "/summarise.jpg",
    iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/three.svg", "/gsap.svg"],
    link: "https://dev-yash-summarizeit.netlify.app/",
  },
];

export const testimonials = [
  {
    quote: "React JS",
    name: "Web Develop,emt",
    title: "1",
  },
  {
    quote: "Next JS",
    name: "Web Develop,emt",
    title: "2",
  },
  {
    quote: "JavaScript",
    name: "Web Develop,emt",
    title: "3",
  },
  {
    quote: "C++",
    name: "Programming",
    title: "4",
  },
  {
    quote: "SQL",
    name: "Web Develop",
    title: "5",
  },
  {
    quote: "Node js",
    name: "Web Develop",
    title: "6",
  },
  {
    quote: "Mongo DB",
    name: "Web Develop",
    title: "7",
  },
  {
    quote: "FireBase",
    name: "Web Develop",
    title: "8",
  },
  {
    quote: "Express",
    name: "Web Develop",
    title: "9",
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
    id: 5,
    title: "Software Developer Intern @ Onefinnet",
    desc: [
      "• Building Responsive, High-Performance Web Solutions",
      "• Leading frontend development for key projects like Spot Chat Platform and Meeting Platform, boosting customer engagement and revenue",
      "• Spearheading backend development for critical projects, leveraging Go language to build scalable and efficient systems.",
    ],
    className:
      " bg-gradient-to-r from-violet-600 to-indigo-600 md:col-span-11 w-[100%]",
    thumbnail: "/onefinnet.png",
    date: "January 2025 - Present",
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
    className: "bg-[#293d9a] md:col-span-11  w-[100%]",
    thumbnail: "/ambill.jpg",
    date: "July 2024 - October 2024",
  },
  {
    id: 4,
    title: "Software Development",
    desc: [
      "Developed and maintained user-facing features using modern technologies.",
    ],
    className: "bg-[#06638d] md:col-span-5",
    thumbnail: "/hero.png",
  },
  {
    id: 1,
    title: "Guardian @ Leetcode (2200+)",
    desc: [
      " Solved over 1300+ problems with multiple contests to earn the Guardian badge",
    ],
    className: "bg-[#554590] md:col-span-5",
    thumbnail: "/guardian.gif",
  },
  {
    id: 2,
    title: "4 Star @ Codechef (1850+)",
    desc: [" Solved over 50+ problems on codechef contests to earn 3 stars"],
    className: "bg-[#293d9a] md:col-span-5", // change to md:col-span-2
    thumbnail: "/codechef.svg",
  },
  {
    id: 3,
    title: "NDA",
    desc: [
      "Got recommendation letter from Indian Army Officer Entry NDA after clearing 5day long SSB process with AIR: 193",
    ],
    className: "bg-[#06638d] md:col-span-5", // change to md:col-span-2
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
