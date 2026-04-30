import { ConfigSchema, type Config } from './schema';
import { getRemoteConfig } from '../lib/supabase';

const localConfig: Config = {
  name: "Rajaneesh R",
  title: "Full-Stack Developer",
  bio: "Full-Stack Developer with experience in ground control stations, geospatial analytics, and AI-powered management systems. Proficient in TypeScript, React, and hardware interfacing with Raspberry Pi.",
  status: "open_for_work",
  theme: {
    primary: "#2d5a27",
    secondary: "#d97706",
    accent: "#0891b2",
    background: "#ffffff",
    text: "#1a1a1a",
  },
  contact: {
    email: "rajaneeshr2006@gmail.com",
    phone: "+91 98404 87184",
    github: "https://github.com/r-rajaneesh",
    linkedin: "https://www.linkedin.com/in/r-rajaneesh/",
    location: "Coimbatore, Tamil Nadu",
  },
  skills: [
    { 
      category: "Programming", 
      items: [
        { name: "TypeScript", color: "#3178c6" },
        { name: "JavaScript", color: "#f7df1e" },
        { name: "Python", color: ["#3776ab", "#ffd343"] },
        { name: "Java", color: "#007396" },
        { name: "C", color: "#a8b9cc" },
        { name: "C++", color: "#00599c" }
      ] 
    },
    { 
      category: "Frontend", 
      items: [
        { name: "React.js", color: "#61dafb" },
        { name: "Next.js", color: "#000000" },
        { name: "Astro", color: ["#ff5d01", "#f020b1"] },
        { name: "Tailwind CSS", color: "#06b6d4" },
        { name: "Vite", color: ["#646cff", "#ffdf33"] },
        { name: "SCSS", color: "#cc6699" }
      ] 
    },
    { 
      category: "Backend & DB", 
      items: [
        { name: "Bun", color: "#fbf0df" },
        { name: "Node.js", color: "#339933" },
        { name: "Express.js", color: "#000000" },
        { name: "Hono", color: "#e36002" },
        { name: "PostgreSQL", color: "#4169e1" },
        { name: "MongoDB", color: "#47a248" },
        { name: "Supabase", color: "#3ecf8e" },
        { name: "Redis", color: "#dc382d" }
      ] 
    },
    { 
      category: "Hardware & Ops", 
      items: [
        { name: "Raspberry Pi", color: "#c51a4a" },
        { name: "ESP32", color: "#e7352c" },
        { name: "Arduino", color: "#00979d" },
        { name: "Docker", color: "#2496ed" },
        { name: "Linux", color: "#fcc624" },
        { name: "AWS", color: ["#ff9900", "#232f3e"] }
      ] 
    },
  ],
  experience: [
    {
      company: "Indian Institute of Technology - Madras",
      role: "Full-Stack Developer Intern",
      period: "Sept 2025 – Present",
      description: "Developed a Ground Control Station for unmanned vehicles (Anantam Control Station) and a Geospatial analytics platform (ZIIP). Optimized real-time data handling with Sockets and AWS EC2 workflows.",
    },
    {
      company: "Nexoris Solutions",
      role: "Full Stack Developer Intern",
      period: "June 2025 – July 2025",
      description: "Developed a dashboard analytical platform (eXOR) for sales and performance metrics. Optimized data handling between server and dashboard.",
    },
  ],
  projects: [
    {
      title: "eAttendance",
      description: "Automatic computer laboratory attendance system syncing with a central server upon boot.",
      tags: ["Python", "Raspberry Pi", "Networking"],
      link: "https://github.com/r-rajaneesh",
    },
    {
      title: "EDUDOTE",
      description: "AI-powered classroom timetable management system using a constraint engine.",
      tags: ["React", "AI", "Node.js"],
      link: "https://github.com/r-rajaneesh",
    },
    {
      title: "Custom School Bell System",
      description: "Autonomous audio scheduling system using Raspberry Pi and PA infrastructure.",
      tags: ["Hardware", "Python", "Audio"],
      link: "https://github.com/r-rajaneesh",
    },
  ],
  education: [
    {
      institution: "Sri Ramakrishna Engineering College",
      degree: "B.Tech in Information Technology",
      period: "2024 – Present",
    },
    {
      institution: "Yuvabharathi Public School",
      degree: "Higher Secondary Education",
      period: "2022 – 2024",
    },
  ],
};

export async function getConfig(): Promise<Config> {
  try {
    const remoteContent = await getRemoteConfig();
    if (!remoteContent) return localConfig;

    const validated = ConfigSchema.safeParse(remoteContent);
    if (!validated.success) {
      console.error('Invalid remote config:', validated.error);
      return localConfig;
    }

    return validated.data;
  } catch (e) {
    console.error('Error fetching remote config:', e);
    return localConfig;
  }
}

// For backward compatibility with static exports
export const config = localConfig;
