"use client";
/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion";
import { Mail, Briefcase } from "@/components/icon";

const teamMembers = [
  {
    name: "Godfrey Onyango",
    role: "Director Of Pioneers Footprints ",
    email: "godfreyonyango365@gmail.com",  
    bio: "Leading the Pioneers Footprints vision with passion and dedication.",
    photo: "/assets/godfrey.png",
  },
  {
    name: "Byron Onyango",
    role: "Director of Advent Nurutech",
    email: "otienobyron384@gmail.com",
    bio: "Managing AdventNuru Tech and Nuru Shop in Connection with Pioneers Footprints .",
    photo: "/assets/byron.png",
  },
  {
    name: "Phyniance Ochieng",
    role: "Media Manager",
    email: "phynianceochieng@gmail.com",
    bio: "Developing and maintaining our digital platforms and services through Media Services.",
    photo: "/assets/phy.jpeg",
  },
];

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900 px-4 py-12 transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            Our Team
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto">
            Dedicated pioneers working to preserve and advance the legacy of Adventist pioneers through knowledge, 
            service, and technology.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-shadow"
            >
              {/* Profile Photo */}
              <div className="w-50 h-65 square-full overflow-hidden mb-6 mx-auto">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name & Role */}
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-semibold">
                  <Briefcase className="w-4 h-4" />
                  {member.role}
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-600 dark:text-gray-300 text-center mb-6 text-sm leading-relaxed">
                {member.bio}
              </p>

              {/* Email Link */}
              <a
                href={`mailto:${member.email}`}
                className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition text-sm font-medium"
              >
                <Mail className="w-4 h-4" />
                {member.email}
              </a>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center bg-blue-50 dark:bg-slate-800 rounded-2xl p-8 border border-blue-200 dark:border-slate-700"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Join Our Team
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            We&apos;re always looking for passionate individuals to help preserve and share the pioneer heritage through Knowledge and Technology.
          </p>
          <a
            href="mailto:pioneersfootprints1844@gmail.com"
            className="inline-block bg-blue-600 dark:bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition font-semibold"
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </main>
  );
}
