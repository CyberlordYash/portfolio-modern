"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { socialMedia } from "@/data";
import { ArrowUpRight, Mail, Copy, Check } from "lucide-react";

const EMAIL = "yashsachan321@gmail.com";

/* ══════════════════════════════════════════
   ROBOT SVG
══════════════════════════════════════════ */
const Robot = () => (
  <motion.div
    animate={{ y: [0, -12, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    className="relative"
  >
    <style>{`
      @keyframes scanV    { 0%{transform:translateY(0)}   100%{transform:translateY(46px)} }
      @keyframes antPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(1.6)} }
      @keyframes chestUp  { 0%{transform:translateY(0)}   100%{transform:translateY(-96px)} }
      @keyframes eyePulse { 0%,100%{opacity:0.92} 50%{opacity:0.55} }
      @keyframes reactSpin{ from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes reactSpinR{ from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
      @keyframes ledBlink { 0%,100%{opacity:1} 40%,60%{opacity:0.15} }
    `}</style>

    <svg
      viewBox="0 0 240 410"
      fill="none"
      className="text-black dark:text-white"
      style={{ width: 230, height: 394 }}
    >
      <defs>
        {/* metallic body gradient */}
        <linearGradient id="gHead" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="currentColor" stopOpacity="0.13" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="gBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="currentColor" stopOpacity="0.11" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="gArm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="currentColor" stopOpacity="0.10" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="gVisor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="currentColor" stopOpacity="0.45" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.28" />
        </linearGradient>
        {/* eye glow filter */}
        <filter id="eyeGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="antGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <clipPath id="sc"><rect x="88" y="158" width="64" height="50" rx="2"/></clipPath>
      </defs>

      {/* ════ ANTENNA ════ */}
      <rect x="118" y="10" width="4" height="24" fill="url(#gHead)" stroke="currentColor" strokeWidth="1"/>
      <rect x="103" y="28" width="34" height="4" fill="url(#gHead)" stroke="currentColor" strokeWidth="0.8"/>
      <rect x="103" y="14" width="4" height="18" fill="url(#gHead)" stroke="currentColor" strokeWidth="0.8"/>
      <rect x="133" y="14" width="4" height="18" fill="url(#gHead)" stroke="currentColor" strokeWidth="0.8"/>
      {/* antenna glow halo */}
      <circle cx="120" cy="10" r="14" fill="rgb(52,211,153)" fillOpacity="0.10" filter="url(#antGlow)" style={{ animation: "antPulse 1.6s ease-in-out infinite", transformOrigin: "120px 10px" }}/>
      {/* antenna tips */}
      <circle cx="120" cy="10" r="6"  fill="rgb(52,211,153)" fillOpacity="0.95" filter="url(#softGlow)" style={{ animation: "antPulse 1.6s ease-in-out infinite", transformOrigin: "120px 10px" }}/>
      <circle cx="120" cy="10" r="3"  fill="white" fillOpacity="0.9"/>
      <circle cx="105" cy="14" r="4"  fill="rgb(52,211,153)" fillOpacity="0.65" filter="url(#softGlow)"/>
      <circle cx="105" cy="14" r="2"  fill="white" fillOpacity="0.7"/>
      <circle cx="135" cy="14" r="4"  fill="rgb(52,211,153)" fillOpacity="0.65" filter="url(#softGlow)"/>
      <circle cx="135" cy="14" r="2"  fill="white" fillOpacity="0.7"/>

      {/* ════ HEAD ════ */}
      <rect x="78" y="32" width="84" height="68" rx="6" fill="url(#gHead)" stroke="currentColor" strokeWidth="1.5"/>
      {/* top highlight strip */}
      <rect x="84" y="34" width="72" height="8" rx="3" fill="currentColor" fillOpacity="0.09"/>
      {/* head panel lines */}
      <line x1="78"  y1="72"  x2="162" y2="72"  stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.18"/>
      <line x1="78"  y1="88"  x2="162" y2="88"  stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.12"/>
      {/* side ear plates */}
      <rect x="68"  y="50" width="12" height="30" rx="3" fill="url(#gHead)" stroke="currentColor" strokeWidth="1"/>
      <rect x="160" y="50" width="12" height="30" rx="3" fill="url(#gHead)" stroke="currentColor" strokeWidth="1"/>
      {/* ear highlight */}
      <rect x="70"  y="52" width="8" height="5" rx="1" fill="currentColor" fillOpacity="0.1"/>
      <rect x="162" y="52" width="8" height="5" rx="1" fill="currentColor" fillOpacity="0.1"/>
      {/* ear bolts */}
      <circle cx="74"  cy="57" r="2.5" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.8"/>
      <circle cx="74"  cy="67" r="2.5" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.8"/>
      <circle cx="166" cy="57" r="2.5" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.8"/>
      <circle cx="166" cy="67" r="2.5" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.8"/>

      {/* ════ VISOR ════ */}
      <rect x="78" y="50" width="84" height="30" rx="3" fill="url(#gVisor)"/>
      {/* visor inner shine */}
      <rect x="80" y="52" width="80" height="7" rx="2" fill="currentColor" fillOpacity="0.07"/>
      {/* visor bottom edge */}
      <line x1="80" y1="79" x2="160" y2="79" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.3"/>

      {/* ════ EYES (5-layer glowing) ════ */}
      {/* left */}
      <circle cx="103" cy="65" r="15" fill="rgb(52,211,153)" fillOpacity="0.10" filter="url(#eyeGlow)" style={{ animation: "eyePulse 2.5s ease-in-out infinite" }}/>
      <circle cx="103" cy="65" r="10" fill="rgb(52,211,153)" fillOpacity="0.88" style={{ animation: "eyePulse 2.5s ease-in-out infinite" }}/>
      <circle cx="103" cy="65" r="6"  fill="rgb(16,185,129)"/>
      <circle cx="103" cy="65" r="3"  fill="#000" fillOpacity="0.55"/>
      <circle cx="103" cy="65" r="1.8" fill="white" fillOpacity="0.95"/>
      <circle cx="99"  cy="61" r="1.5" fill="white" fillOpacity="0.55"/>

      {/* right */}
      <circle cx="137" cy="65" r="15" fill="rgb(52,211,153)" fillOpacity="0.10" filter="url(#eyeGlow)" style={{ animation: "eyePulse 2.5s ease-in-out infinite", animationDelay: "0.35s" }}/>
      <circle cx="137" cy="65" r="10" fill="rgb(52,211,153)" fillOpacity="0.88" style={{ animation: "eyePulse 2.5s ease-in-out infinite", animationDelay: "0.35s" }}/>
      <circle cx="137" cy="65" r="6"  fill="rgb(16,185,129)"/>
      <circle cx="137" cy="65" r="3"  fill="#000" fillOpacity="0.55"/>
      <circle cx="137" cy="65" r="1.8" fill="white" fillOpacity="0.95"/>
      <circle cx="133" cy="61" r="1.5" fill="white" fillOpacity="0.55"/>

      {/* ════ NOSE ════ */}
      <rect x="118" y="81" width="4" height="4" rx="1" fill="currentColor" fillOpacity="0.22"/>

      {/* ════ MOUTH / STATUS BAR ════ */}
      <rect x="90" y="89" width="60" height="5" rx="2" fill="rgb(52,211,153)" fillOpacity="0.55"/>
      {[0,1,2,3,4,5,6].map(i => (
        <rect key={i} x={93+i*8} y={89} width="5" height="5" rx="1"
          fill="rgb(52,211,153)" fillOpacity={0.25 + i * 0.08}
          style={{ animation: "ledBlink 1.8s ease-in-out infinite", animationDelay: `${i*0.12}s` }}/>
      ))}

      {/* ════ NECK ════ */}
      <rect x="103" y="100" width="34" height="16" rx="3" fill="url(#gHead)" stroke="currentColor" strokeWidth="1"/>
      {[0,1,2,3].map(i => (
        <line key={i} x1={108+i*7} y1={103} x2={108+i*7} y2={113} stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.25"/>
      ))}

      {/* ════ SHOULDERS ════ */}
      {/* left */}
      <rect x="34"  y="110" width="54" height="40" rx="4" fill="url(#gBody)" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="38"  y="112" width="46" height="9"  rx="2" fill="currentColor" fillOpacity="0.09"/>
      <line x1="38" y1="128" x2="84"  y2="128" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.18"/>
      <line x1="38" y1="138" x2="84"  y2="138" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.12"/>
      <circle cx="44"  cy="120" r="3.5" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="0.8"/>
      <circle cx="78"  cy="120" r="3.5" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="0.8"/>
      {/* right */}
      <rect x="152" y="110" width="54" height="40" rx="4" fill="url(#gBody)" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="156" y="112" width="46" height="9"  rx="2" fill="currentColor" fillOpacity="0.09"/>
      <line x1="156" y1="128" x2="202" y2="128" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.18"/>
      <line x1="156" y1="138" x2="202" y2="138" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.12"/>
      <circle cx="162" cy="120" r="3.5" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="0.8"/>
      <circle cx="196" cy="120" r="3.5" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="0.8"/>

      {/* ════ TORSO ════ */}
      <rect x="77"  y="116" width="86" height="104" rx="5" fill="url(#gBody)" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="81"  y="118" width="78" height="11"  rx="3" fill="currentColor" fillOpacity="0.09"/>
      <line x1="77" y1="152" x2="163" y2="152" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.18"/>
      <line x1="77" y1="196" x2="163" y2="196" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.15"/>
      {/* corner bolts */}
      {([[81,120],[155,120],[81,212],[155,212]] as const).map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="2.8" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="0.8"/>
      ))}
      {/* side vents */}
      {[0,1,2,3].map(i=>(
        <line key={i} x1={79} y1={162+i*10} x2={86} y2={162+i*10} stroke="currentColor" strokeWidth="1" strokeOpacity="0.2"/>
      ))}
      {[0,1,2,3].map(i=>(
        <line key={i} x1={154} y1={162+i*10} x2={161} y2={162+i*10} stroke="currentColor" strokeWidth="1" strokeOpacity="0.2"/>
      ))}

      {/* ── ARC REACTOR ── */}
      <circle cx="120" cy="137" r="12" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeWidth="1"/>
      <circle cx="120" cy="137" r="9"  fill="currentColor" fillOpacity="0.05" stroke="rgb(52,211,153)" strokeWidth="0.8" strokeOpacity="0.5"/>
      {/* spinning outer ring */}
      <circle cx="120" cy="137" r="12" fill="none" stroke="rgb(52,211,153)" strokeWidth="0.7" strokeOpacity="0.35"
        strokeDasharray="5 5" style={{ animation: "reactSpin 6s linear infinite", transformOrigin: "120px 137px" }}/>
      {/* spinning inner ring (reverse) */}
      <circle cx="120" cy="137" r="7" fill="none" stroke="rgb(52,211,153)" strokeWidth="0.5" strokeOpacity="0.25"
        strokeDasharray="3 4" style={{ animation: "reactSpinR 4s linear infinite", transformOrigin: "120px 137px" }}/>
      <circle cx="120" cy="137" r="4.5" fill="rgb(52,211,153)" fillOpacity="0.8" filter="url(#softGlow)"/>
      <circle cx="120" cy="137" r="2.5" fill="white" fillOpacity="0.9"/>
      <circle cx="118" cy="135" r="1.2" fill="white" fillOpacity="0.6"/>

      {/* ── CHEST SCREEN ── */}
      <rect x="88" y="158" width="64" height="50" rx="3" fill="#050505" stroke="currentColor" strokeWidth="1"/>
      <rect x="88" y="158" width="64" height="50" rx="3" fill="none" stroke="rgb(52,211,153)" strokeWidth="0.6" strokeOpacity="0.45"/>
      {/* scan line */}
      <rect x="88" y="158" width="64" height="3" fill="rgb(52,211,153)" fillOpacity="0.12"
        style={{ animation: "scanV 2s ease-in-out infinite alternate" }}/>
      {/* screen corners */}
      <circle cx="91"  cy="161" r="1.5" fill="rgb(52,211,153)" fillOpacity="0.7"/>
      <circle cx="149" cy="161" r="1.5" fill="rgb(52,211,153)" fillOpacity="0.7"/>
      <circle cx="91"  cy="205" r="1.5" fill="rgb(52,211,153)" fillOpacity="0.4"/>
      <circle cx="149" cy="205" r="1.5" fill="rgb(52,211,153)" fillOpacity="0.4"/>
      {/* scrolling text */}
      <g clipPath="url(#sc)">
        <g style={{ animation: "chestUp 5s linear infinite" }}>
          {["> INIT_CONTACT.EXE","> STATUS: ONLINE","> SYS: READY","> LATENCY: 2MS","> UPTIME: 99.9%","> PING SENT...","> AWAIT INPUT","> INIT_CONTACT.EXE","> STATUS: ONLINE"].map((t,i)=>(
            <text key={i} x="92" y={170+i*12} fill="rgb(52,211,153)" fillOpacity="0.78" fontSize="6.2" fontFamily="monospace">{t}</text>
          ))}
        </g>
      </g>

      {/* ════ WAIST ════ */}
      <rect x="87"  y="220" width="66" height="22" rx="3" fill="url(#gBody)" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="91"  y="222" width="58" height="6"  rx="1" fill="currentColor" fillOpacity="0.1"/>
      {[96,108,120,132,144].map(x=>(
        <rect key={x} x={x-2} y={227} width="4" height="4" rx="0.5" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="0.6"/>
      ))}

      {/* ════ HIPS ════ */}
      <rect x="83"  y="242" width="33" height="28" rx="3" fill="url(#gBody)" stroke="currentColor" strokeWidth="1.1"/>
      <rect x="124" y="242" width="33" height="28" rx="3" fill="url(#gBody)" stroke="currentColor" strokeWidth="1.1"/>
      <rect x="87"  y="244" width="25" height="6" rx="1" fill="currentColor" fillOpacity="0.09"/>
      <rect x="128" y="244" width="25" height="6" rx="1" fill="currentColor" fillOpacity="0.09"/>

      {/* ════ UPPER ARMS ════ */}
      {/* left */}
      <rect x="31"  y="148" width="32" height="72" rx="5" fill="url(#gArm)" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="35"  y="150" width="24" height="9"  rx="2" fill="currentColor" fillOpacity="0.10"/>
      <line x1="33" y1="174" x2="61"  y2="174" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.18"/>
      <line x1="33" y1="190" x2="61"  y2="190" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.15"/>
      {/* forearm indicator led */}
      <rect x="40"  y="163" width="12" height="4" rx="1" fill="rgb(52,211,153)" fillOpacity="0.5"/>
      {/* elbow */}
      <rect x="28"  y="218" width="38" height="14" rx="4" fill="url(#gBody)" stroke="currentColor" strokeWidth="1"/>
      <circle cx="47" cy="225" r="5" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="0.8"/>
      {/* right */}
      <rect x="177" y="148" width="32" height="72" rx="5" fill="url(#gArm)" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="181" y="150" width="24" height="9"  rx="2" fill="currentColor" fillOpacity="0.10"/>
      <line x1="179" y1="174" x2="207" y2="174" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.18"/>
      <line x1="179" y1="190" x2="207" y2="190" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.15"/>
      <rect x="188"  y="163" width="12" height="4" rx="1" fill="rgb(52,211,153)" fillOpacity="0.5"/>
      <rect x="174" y="218" width="38" height="14" rx="4" fill="url(#gBody)" stroke="currentColor" strokeWidth="1"/>
      <circle cx="193" cy="225" r="5" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="0.8"/>

      {/* ════ FOREARMS ════ */}
      {/* left */}
      <rect x="32"  y="232" width="30" height="60" rx="4" fill="url(#gArm)" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="36"  y="234" width="22" height="7"  rx="1" fill="currentColor" fillOpacity="0.09"/>
      <line x1="34" y1="258" x2="60"  y2="258" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.18"/>
      {/* right */}
      <rect x="178" y="232" width="30" height="60" rx="4" fill="url(#gArm)" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="182" y="234" width="22" height="7"  rx="1" fill="currentColor" fillOpacity="0.09"/>
      <line x1="180" y1="258" x2="206" y2="258" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.18"/>

      {/* ════ HANDS ════ */}
      {/* left palm */}
      <rect x="27"  y="290" width="38" height="26" rx="4" fill="url(#gArm)" stroke="currentColor" strokeWidth="1.1"/>
      <rect x="31"  y="292" width="30" height="7"  rx="1" fill="currentColor" fillOpacity="0.09"/>
      {/* left fingers */}
      {[0,1,2,3].map(i=>(
        <rect key={i} x={29+i*8} y={312} width="6" height="14" rx="2.5" fill="url(#gArm)" stroke="currentColor" strokeWidth="0.9"/>
      ))}
      {/* left thumb */}
      <rect x="17"  y="294" width="11" height="18" rx="3" fill="url(#gArm)" stroke="currentColor" strokeWidth="0.9"/>
      {/* right palm */}
      <rect x="175" y="290" width="38" height="26" rx="4" fill="url(#gArm)" stroke="currentColor" strokeWidth="1.1"/>
      <rect x="179" y="292" width="30" height="7"  rx="1" fill="currentColor" fillOpacity="0.09"/>
      {/* right fingers */}
      {[0,1,2,3].map(i=>(
        <rect key={i} x={177+i*8} y={312} width="6" height="14" rx="2.5" fill="url(#gArm)" stroke="currentColor" strokeWidth="0.9"/>
      ))}
      {/* right thumb */}
      <rect x="212" y="294" width="11" height="18" rx="3" fill="url(#gArm)" stroke="currentColor" strokeWidth="0.9"/>

      {/* ════ THIGHS ════ */}
      {/* left */}
      <rect x="82"  y="270" width="38" height="58" rx="4" fill="url(#gArm)" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="86"  y="272" width="30" height="8"  rx="2" fill="currentColor" fillOpacity="0.09"/>
      <line x1="84" y1="300" x2="118" y2="300" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.18"/>
      {/* right */}
      <rect x="120" y="270" width="38" height="58" rx="4" fill="url(#gArm)" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="124" y="272" width="30" height="8"  rx="2" fill="currentColor" fillOpacity="0.09"/>
      <line x1="122" y1="300" x2="156" y2="300" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.18"/>

      {/* ════ KNEE CAPS ════ */}
      <rect x="78"  y="325" width="46" height="15" rx="4" fill="url(#gBody)" stroke="currentColor" strokeWidth="1.1"/>
      <circle cx="101" cy="332" r="5" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="0.8"/>
      <circle cx="101" cy="332" r="2" fill="currentColor" fillOpacity="0.2"/>
      <rect x="116" y="325" width="46" height="15" rx="4" fill="url(#gBody)" stroke="currentColor" strokeWidth="1.1"/>
      <circle cx="139" cy="332" r="5" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="0.8"/>
      <circle cx="139" cy="332" r="2" fill="currentColor" fillOpacity="0.2"/>

      {/* ════ LOWER LEGS ════ */}
      {/* left */}
      <rect x="83"  y="340" width="36" height="52" rx="4" fill="url(#gArm)" stroke="currentColor" strokeWidth="1.1"/>
      <rect x="87"  y="342" width="28" height="7"  rx="1" fill="currentColor" fillOpacity="0.09"/>
      <line x1="85" y1="366" x2="117" y2="366" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.18"/>
      {/* right */}
      <rect x="121" y="340" width="36" height="52" rx="4" fill="url(#gArm)" stroke="currentColor" strokeWidth="1.1"/>
      <rect x="125" y="342" width="28" height="7"  rx="1" fill="currentColor" fillOpacity="0.09"/>
      <line x1="123" y1="366" x2="155" y2="366" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.18"/>

      {/* ════ FEET ════ */}
      <rect x="70"  y="386" width="56" height="17" rx="4" fill="url(#gBody)" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="74"  y="388" width="48" height="5"  rx="1" fill="currentColor" fillOpacity="0.10"/>
      <rect x="70"  y="398" width="14" height="5"  rx="2" fill="currentColor" fillOpacity="0.14"/>
      <rect x="114" y="386" width="56" height="17" rx="4" fill="url(#gBody)" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="118" y="388" width="48" height="5"  rx="1" fill="currentColor" fillOpacity="0.10"/>
      <rect x="156" y="398" width="14" height="5"  rx="2" fill="currentColor" fillOpacity="0.14"/>

      {/* ════ GROUND SHADOW ════ */}
      <ellipse cx="120" cy="406" rx="82" ry="6" fill="currentColor" fillOpacity="0.05"/>
    </svg>
  </motion.div>
);

/* ══════════════════════════════════════════
   FOOTER
══════════════════════════════════════════ */
const Footer = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer
      id="contact"
      className="relative w-full overflow-hidden bg-[#ffffff] dark:bg-[#090909] border-t border-black/10 dark:border-white/10"
    >
      {/* grid overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative mx-auto max-w-[90vw] 2xl:max-w-[1400px] py-16 md:py-24">

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-20">

          {/* ── LEFT: Robot ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-5 shrink-0"
          >
            <div className="flex items-center gap-2 border border-black/15 dark:border-white/15 px-3 py-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500" style={{ animation: "antPulse 1.6s ease-in-out infinite", transformOrigin: "center" }} />
              <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-black/55 dark:text-white/55">
                UNIT_YS · CONTACT MODULE
              </span>
            </div>

            <Robot />

            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-3 border border-black/10 dark:border-white/10 px-4 py-2">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-black/55 dark:text-white/55">
                  OPEN TO OPPORTUNITIES
                </span>
              </div>
              <span className="font-mono text-[7px] uppercase tracking-[0.25em] text-black/25 dark:text-white/25">
                IST · INDIA · REMOTE OK
              </span>
            </div>
          </motion.div>

          {/* ── RIGHT: CTA ── */}
          <div className="flex-1 flex flex-col justify-center">

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="border border-black/15 dark:border-white/15 px-3 py-1.5 flex items-center gap-2">
                <motion.div
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  className="w-1.5 h-1.5 bg-black dark:bg-white"
                />
                <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-black dark:text-white">
                  INIT_CONTACT.EXE
                </span>
              </div>
              <span className="font-mono text-[7px] uppercase tracking-[0.3em] text-black/30 dark:text-white/30">
                ▶ RUNNING
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-black uppercase leading-none text-black dark:text-white mb-5"
              style={{ fontFamily: "Impact,'Arial Black',sans-serif", fontSize: "clamp(3rem,9vw,7rem)", letterSpacing: "-0.03em" }}
            >
              GET IN<br />TOUCH.
            </motion.h2>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="h-px bg-black/12 dark:bg-white/12 mb-5 origin-left"
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="font-mono text-[11px] leading-relaxed text-black/55 dark:text-white/55 max-w-md mb-8"
            >
              Ready to discuss scalable distributed systems or high-throughput
              infrastructure? Transmit a signal — let&apos;s engineer something that performs.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-3 mb-8"
            >
              <a
                href={`mailto:${EMAIL}`}
                className="group inline-flex items-center gap-2.5 border border-black dark:border-white bg-black dark:bg-white px-6 py-3.5 font-mono text-[10px] font-black uppercase tracking-wider text-white dark:text-black hover:bg-transparent hover:text-black dark:hover:bg-transparent dark:hover:text-white transition-all duration-200"
              >
                <Mail size={13} />
                Send Message
                <ArrowUpRight size={11} className="transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>

              <button
                onClick={copyEmail}
                className="group inline-flex items-center gap-2.5 border border-black/20 dark:border-white/20 px-6 py-3.5 font-mono text-[10px] font-bold uppercase tracking-wider text-black/65 dark:text-white/65 hover:border-black/50 dark:hover:border-white/50 hover:text-black dark:hover:text-white transition-all duration-200"
              >
                {copied ? (
                  <><Check size={12} className="text-emerald-500" /><span className="text-emerald-600 dark:text-emerald-400">Copied!</span></>
                ) : (
                  <><Copy size={12} />{EMAIL}</>
                )}
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2"
            >
              <span className="font-mono text-[7px] uppercase tracking-[0.35em] text-black/30 dark:text-white/30 mr-2">LINKS ·</span>
              {socialMedia.map((profile) =>
                profile.link ? (
                  <a
                    key={profile.id}
                    href={profile.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center border border-black/15 dark:border-white/15 hover:border-black/40 dark:hover:border-white/40 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-all duration-150"
                  >
                    <img src={profile.img} alt="social" width={14} height={14} className="opacity-50 dark:invert transition-opacity hover:opacity-80" />
                  </a>
                ) : null
              )}
            </motion.div>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="mt-16 pt-6 border-t border-black/10 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40">
            Designed &amp; built by <span className="text-black dark:text-white font-bold">YASH SACHAN</span>
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-black/20 dark:bg-white/20" />
            <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-black/30 dark:text-white/30">SYSTEMS, BY DESIGN.</span>
            <div className="w-1 h-1 bg-black/20 dark:bg-white/20" />
          </div>
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-black/30 dark:text-white/30">&copy; 2026 · ALL RIGHTS RESERVED</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
