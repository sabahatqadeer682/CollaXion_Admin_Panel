// src/pages/IndustryProjects.jsx
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LiaisonNavbar from "../components/LiaisonNavbar";
import LiaisonFooter from "../components/LiaisonFooter";
import {
  Briefcase, Users, Trash2, Eye, Calendar, Clock,
  CheckCircle, XCircle, Building2, Tag, BarChart2,
  ChevronRight, AlertCircle, Search, Filter,
  TrendingUp, Star, Download, StickyNote, Pin,
  BookOpen, Award, Bell, RefreshCw, ChevronDown,
  FileText, Activity, Zap, Target, ArrowUpRight,
  MoreVertical, Edit3, Copy, Share2, Archive,
} from "lucide-react";

// ─── Brand palette ───────────────────────────────────────────────────────────
const B = {
  navy:      "#193648", navyDark: "#0f2230", blue: "#3A70B0",
  blueLight: "#AAC3FC", pageBg: "linear-gradient(135deg,#E2EEF9 0%,#FFFFFF 100%)",
  card: "#FFFFFF", border: "#D4E3F5", borderMid: "#b8d0ea",
  textDark: "#193648", textMid: "#3A70B0", textMuted: "#5a7e9a", textFaint: "#90aabb",
};

const TYPE_C = {
  Project:    { bg:"#ede9fe", text:"#6d28d9", border:"#c4b5fd" },
  Internship: { bg:"#fce7f3", text:"#be185d", border:"#f9a8d4" },
  Workshop:   { bg:"#fef9c3", text:"#854d0e", border:"#fde68a" },
  Research:   { bg:"#d1fae5", text:"#065f46", border:"#6ee7b7" },
};
const STATUS_C = {
  Ongoing:   { bg:"#eff6ff", text:"#193648", border:"#cfe0f0", bar:"#193648" },
  Completed: { bg:"#ecfdf5", text:"#065f46", border:"#a7f3d0", bar:"#16a34a" },
  Upcoming:  { bg:"#fffbeb", text:"#b45309", border:"#fde68a", bar:"#f59e0b" },
  Pending:   { bg:"#fffbeb", text:"#b45309", border:"#fde68a", bar:"#f59e0b" },
};
const AV = [
  {bg:"#dbeafe",text:"#1d4ed8"},{bg:"#ede9fe",text:"#6d28d9"},
  {bg:"#fce7f3",text:"#be185d"},{bg:"#d1fae5",text:"#065f46"},
  {bg:"#fef3c7",text:"#92400e"},{bg:"#ffedd5",text:"#c2410c"},
];

// ─── Initial data ─────────────────────────────────────────────────────────────
const INITIAL = [
  {
    id:1, pinned:false, title:"AI-Powered Quality Inspection", industry:"TechNova Pvt. Ltd.",
    domain:"AI / Manufacturing", type:"Project", status:"Ongoing",
    createdAt:"2025-09-15", deadline:"2025-12-15", priority:"High",
    description:"Develop an AI system for automatic quality inspection in manufacturing pipelines using computer vision and deep learning models.",
    tags:["AI","CV","Deep Learning"],
    note:"Follow up with TechNova on dataset access.",
    milestones:[
      {label:"Kickoff",  done:true,  date:"2025-09-20"},
      {label:"Prototype",done:true,  date:"2025-10-15"},
      {label:"Testing",  done:false, date:"2025-11-20"},
      {label:"Delivery", done:false, date:"2025-12-15"},
    ],
    applicants:[
      {name:"Ali Raza",   program:"BSCS",id:"CS-2105",status:"Approved"},
      {name:"Hira Khan",  program:"BSE", id:"SE-2120",status:"Pending"},
      {name:"Usman Ghani",program:"BSCS",id:"CS-2131",status:"Pending"},
    ],
  },
  {
    id:2, pinned:true, title:"Web3 Internship Program", industry:"NextChain Solutions",
    domain:"Blockchain / DApps", type:"Internship", status:"Upcoming",
    createdAt:"2025-10-01", deadline:"2025-11-15", priority:"Medium",
    description:"Hands-on internship on blockchain-based DApps and smart contracts using Solidity and Ethereum ecosystem tools.",
    tags:["Blockchain","Solidity","Web3"],
    note:"",
    milestones:[
      {label:"Announcement",done:true, date:"2025-10-01"},
      {label:"Screening",   done:false,date:"2025-10-25"},
      {label:"Onboarding",  done:false,date:"2025-11-01"},
      {label:"Start",       done:false,date:"2025-11-15"},
    ],
    applicants:[
      {name:"Ahmed Farooq",program:"BSIT",id:"IT-2044",status:"Pending"},
      {name:"Ayesha Malik",program:"BSCS",id:"CS-2098",status:"Forwarded"},
      {name:"Sana Tariq",  program:"BSE", id:"SE-2145",status:"Rejected"},
      {name:"Bilal Ahmed", program:"BSCS",id:"CS-2167",status:"Pending"},
    ],
  },
  {
    id:3, pinned:false, title:"Sustainable Energy Workshop", industry:"EcoPower Industries",
    domain:"Energy / Sustainability", type:"Workshop", status:"Completed",
    createdAt:"2025-08-10", deadline:"2025-09-10", priority:"Low",
    description:"A 2-week industrial training on solar grid management and energy efficiency optimisation strategies.",
    tags:["Solar","Energy","Training"],
    note:"Request a feedback report from EcoPower.",
    milestones:[
      {label:"Planning", done:true,date:"2025-08-12"},
      {label:"Session 1",done:true,date:"2025-08-25"},
      {label:"Session 2",done:true,date:"2025-09-05"},
      {label:"Wrap-up",  done:true,date:"2025-09-10"},
    ],
    applicants:[
      {name:"Zain Ali",   program:"BSEE",id:"EE-2032",status:"Approved"},
      {name:"Maryam Noor",program:"BSEE",id:"EE-2041",status:"Approved"},
    ],
  },
  {
    id:4, pinned:false, title:"Mobile UX Research Study", industry:"PixelCraft Studios",
    domain:"UI/UX / Mobile", type:"Research", status:"Ongoing",
    createdAt:"2025-09-20", deadline:"2025-12-01", priority:"Medium",
    description:"User experience research study focusing on mobile app usability patterns and accessibility improvements for diverse user groups.",
    tags:["UX","Research","Mobile","A11y"],
    note:"",
    milestones:[
      {label:"Literature Review",done:true, date:"2025-09-30"},
      {label:"User Interviews",  done:true, date:"2025-10-15"},
      {label:"Analysis",         done:false,date:"2025-11-10"},
      {label:"Final Report",     done:false,date:"2025-12-01"},
    ],
    applicants:[
      {name:"Fatima Zahra",program:"BSCS",id:"CS-2088",status:"Pending"},
      {name:"Hassan Javed",program:"BSIT",id:"IT-2056",status:"Forwarded"},
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const daysLeft   = (d) => Math.ceil((new Date(d)-new Date())/(86400000));
const progress   = (p) => p.status==="Completed"?100:p.status==="Ongoing"?Math.round((p.milestones.filter(m=>m.done).length/p.milestones.length)*100):15;
const selected   = (p) => p.applicants.filter(a=>a.status==="Approved"||a.status==="Forwarded").length;
const deadlineSoon = (d) => { const dl=daysLeft(d); return dl>0&&dl<=7; };

// ─── Sub-components ───────────────────────────────────────────────────────────

const Badge = ({label, bg, text, border}) => (
  <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:20,fontSize:"0.71rem",fontWeight:700,background:bg,color:text,border:`1px solid ${border}`}}>
    {label}
  </span>
);

const Avatar = ({name,idx,size=28}) => {
  const p=AV[idx%AV.length];
  return <div style={{width:size,height:size,borderRadius:"50%",border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.34+"px",fontWeight:800,background:p.bg,color:p.text,flexShrink:0,marginLeft:idx>0?-8:0,zIndex:10-idx}}>{name[0]}</div>;
};

const MiniProgress = ({pct,color}) => (
  <div style={{width:"100%",height:5,background:"#EDF4FF",borderRadius:5,overflow:"hidden"}}>
    <motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:0.9,delay:0.1}} style={{height:"100%",borderRadius:5,background:color||B.blue}} />
  </div>
);

const PriorityDot = ({p}) => {
  const c={High:"#ef4444",Medium:"#f59e0b",Low:"#10b981"}[p]||"#94a3b8";
  return <div title={`Priority: ${p}`} style={{width:9,height:9,borderRadius:"50%",background:c,boxShadow:`0 0 6px ${c}80`,flexShrink:0}} />;
};

// ─── Analytics Bar ────────────────────────────────────────────────────────────
const AnalyticsBar = ({posts}) => {
  const total  = posts.length;
  const ongoing= posts.filter(p=>p.status==="Ongoing").length;
  const done   = posts.filter(p=>p.status==="Completed").length;
  const apps   = posts.reduce((a,p)=>a+p.applicants.length,0);
  const sel    = posts.reduce((a,p)=>a+selected(p),0);
  const pinned = posts.filter(p=>p.pinned).length;

  const stats=[
    { label: "Total Posts",      value: total,    color: "#193648", halo: "rgba(25,54,72,0.15)" },
    { label: "Ongoing",          value: ongoing,  color: "#3A70B0", halo: "rgba(58,112,176,0.18)" },
    { label: "Completed",        value: done,     color: "#16a34a", halo: "rgba(22,163,74,0.20)" },
    { label: "Total Applicants", value: apps,     color: "#3A70B0", halo: "rgba(58,112,176,0.18)" },
    { label: "Selected",         value: sel,      color: "#16a34a", halo: "rgba(22,163,74,0.20)" },
    { label: "Pinned",           value: pinned,   color: "#F59E0B", halo: "rgba(245,158,11,0.20)" },
  ];
  return (
    <div style={{display:"flex", gap:8, marginBottom:24, flexWrap:"wrap"}}>
      {stats.map((s,i)=>(
        <div key={i} style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "7px 12px", borderRadius: 8,
          background: "#fff", border: "1px solid #E2EEF9",
          boxShadow: "0 1px 3px rgba(25,54,72,0.06)",
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%",
            background: s.color,
            boxShadow: `0 0 0 3px ${s.halo}`,
          }} />
          <span style={{ fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>{s.label}</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: s.color, fontVariantNumeric: "tabular-nums" }}>{s.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Milestone Timeline ───────────────────────────────────────────────────────
const Timeline = ({milestones}) => (
  <div style={{position:"relative",padding:"4px 0"}}>
    {/* track */}
    <div style={{position:"absolute",left:14,top:8,bottom:8,width:2,background:B.border,zIndex:0}} />
    {milestones.map((m,i)=>(
      <div key={i} style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:i<milestones.length-1?14:0,position:"relative",zIndex:1}}>
        <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:m.done?"#10b981":B.border,border:`2px solid ${m.done?"#10b981":B.borderMid}`,boxShadow:m.done?"0 0 8px #10b98140":"none"}}>
          {m.done?<CheckCircle size={13} color="#fff"/>:<div style={{width:8,height:8,borderRadius:"50%",background:B.borderMid}}/>}
        </div>
        <div>
          <div style={{fontSize:"0.83rem",fontWeight:m.done?700:500,color:m.done?B.textDark:B.textMuted}}>{m.label}</div>
          <div style={{fontSize:"0.72rem",color:B.textFaint,marginTop:2}}>{m.date}</div>
        </div>
      </div>
    ))}
  </div>
);

// ─── Donut Chart ──────────────────────────────────────────────────────────────
const DonutChart = ({posts}) => {
  const data=[
    {label:"Ongoing",   count:posts.filter(p=>p.status==="Ongoing").length,   color:"#f59e0b"},
    {label:"Upcoming",  count:posts.filter(p=>p.status==="Upcoming").length,  color:"#3b82f6"},
    {label:"Completed", count:posts.filter(p=>p.status==="Completed").length, color:"#10b981"},
  ];
  const total=data.reduce((a,d)=>a+d.count,0)||1;
  let offset=0;
  const r=40, cx=60, cy=60, stroke=14;
  const circ=2*Math.PI*r;

  return (
    <div style={{display:"flex",alignItems:"center",gap:20}}>
      <svg width={120} height={120} style={{transform:"rotate(-90deg)"}}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EDF4FF" strokeWidth={stroke}/>
        {data.map((d,i)=>{
          const pct=d.count/total;
          const dash=pct*circ;
          const el=(
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={d.color} strokeWidth={stroke}
              strokeDasharray={`${dash} ${circ-dash}`}
              strokeDashoffset={-offset*circ}
              strokeLinecap="round"
            />
          );
          offset+=pct;
          return el;
        })}
        <text x={cx} y={cy+5} textAnchor="middle" style={{fill:B.navy,fontSize:20,fontWeight:800,transform:"rotate(90deg)",transformOrigin:`${cx}px ${cy}px`}}>
          {total}
        </text>
      </svg>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {data.map((d,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:d.color,boxShadow:`0 0 6px ${d.color}80`}}/>
            <span style={{fontSize:"0.78rem",color:B.textMuted}}>{d.label}</span>
            <span style={{fontSize:"0.78rem",fontWeight:700,color:B.textDark,marginLeft:4}}>{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Quick Note Modal ─────────────────────────────────────────────────────────
const NoteModal = ({post,onSave,onClose}) => {
  const [val,setVal]=useState(post.note||"");
  return (
    <motion.div style={{position:"fixed",inset:0,background:"rgba(15,34,48,0.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1100,backdropFilter:"blur(4px)"}}
      initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}>
      <motion.div style={{background:"#fff",borderRadius:20,padding:28,width:440,boxShadow:"0 20px 50px rgba(25,54,72,0.25)",border:`1.5px solid ${B.border}`}}
        initial={{scale:0.88,y:30}} animate={{scale:1,y:0}} transition={{type:"spring",stiffness:300,damping:26}}
        onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <StickyNote size={18} color={B.blue}/><span style={{fontWeight:700,color:B.textDark,fontSize:"0.95rem"}}>Note - {post.title}</span>
        </div>
        <textarea value={val} onChange={e=>setVal(e.target.value)} rows={5}
          placeholder="Add an internal note about this post..."
          style={{width:"100%",padding:"12px 14px",borderRadius:12,border:`1.5px solid ${B.border}`,fontSize:"0.88rem",color:B.textDark,resize:"vertical",outline:"none",fontFamily:"inherit",lineHeight:1.6}} />
        <div style={{display:"flex",gap:10,marginTop:14,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{padding:"9px 18px",borderRadius:10,border:`1.5px solid ${B.border}`,background:"#fff",color:B.textMuted,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
          <motion.button whileTap={{scale:0.96}} onClick={()=>{onSave(val);onClose();}}
            style={{padding:"9px 18px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${B.navy},${B.blue})`,color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
            Save Note
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Context Menu ─────────────────────────────────────────────────────────────
const CtxMenu = ({onPin,onNote,onDuplicate,onArchive,onClose,pinned}) => (
  <motion.div
    initial={{opacity:0,scale:0.92,y:-8}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.9}}
    style={{position:"absolute",top:36,right:0,background:"#fff",borderRadius:14,padding:"6px 0",width:190,boxShadow:"0 12px 36px rgba(25,54,72,0.18)",border:`1.5px solid ${B.border}`,zIndex:200}}
    onClick={e=>e.stopPropagation()}>
    {[
      {icon:<Pin size={14}/>,      label:pinned?"Unpin":"Pin to Top",    action:onPin},
      {icon:<StickyNote size={14}/>,label:"Add Note",                    action:onNote},
      {icon:<Copy size={14}/>,     label:"Duplicate",                    action:onDuplicate},
      {icon:<Archive size={14}/>,  label:"Archive",                      action:onArchive, danger:true},
    ].map((item,i)=>(
      <motion.button key={i} whileHover={{background:"#EEF5FF"}} onClick={()=>{item.action();onClose();}}
        style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"9px 16px",border:"none",background:"transparent",color:item.danger?"#dc2626":B.textDark,fontSize:"0.84rem",fontWeight:500,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
        <span style={{color:item.danger?"#dc2626":B.textMid}}>{item.icon}</span>{item.label}
      </motion.button>
    ))}
  </motion.div>
);

// ─── Detail Modal ─────────────────────────────────────────────────────────────
const DetailModal = ({post,onClose}) => {
  const [tab,setTab]=useState("applicants");
  const sc=STATUS_C[post.status]||STATUS_C.Upcoming;
  const tc=TYPE_C[post.type]||TYPE_C.Project;
  const pct=progress(post);
  const dl=daysLeft(post.deadline);

  return (
    <motion.div style={{position:"fixed",inset:0,background:"rgba(15,34,48,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,backdropFilter:"blur(5px)"}}
      initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}>
      <motion.div style={{background:"#fff",borderRadius:24,width:580,maxWidth:"95vw",maxHeight:"92vh",overflowY:"auto",boxShadow:"0 28px 64px rgba(25,54,72,0.28)"}}
        initial={{scale:0.85,y:40,opacity:0}} animate={{scale:1,y:0,opacity:1}} exit={{scale:0.9,opacity:0}}
        transition={{type:"spring",stiffness:300,damping:26}} onClick={e=>e.stopPropagation()}>

        {/* Modal Header */}
        <div style={{background:`linear-gradient(135deg,${B.navy},${B.blue})`,padding:"24px 26px",borderRadius:"24px 24px 0 0"}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:46,height:46,borderRadius:14,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Building2 size={22} color="#fff"/>
              </div>
              <div>
                <h3 style={{fontSize:"1.1rem",fontWeight:800,color:"#fff",margin:0}}>{post.title}</h3>
                <p style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.7)",margin:"4px 0 0 0"}}>{post.industry} · {post.domain}</p>
              </div>
            </div>
            <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",borderRadius:10,padding:"6px 8px",cursor:"pointer"}}>
              <XCircle size={18}/>
            </button>
          </div>
          {/* Stats strip */}
          <div style={{display:"flex",gap:12,marginTop:18,flexWrap:"wrap"}}>
            {[
              {label:"Type",   value:post.type},
              {label:"Status", value:post.status},
              {label:"Created",value:post.createdAt},
              {label:"Deadline",value:post.deadline},
              {label:"Days Left",value:dl>0?`${dl}d`:"Ended"},
              {label:"Progress",value:`${pct}%`},
            ].map((m,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.12)",borderRadius:10,padding:"7px 14px"}}>
                <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.55)",textTransform:"uppercase",letterSpacing:"0.08em"}}>{m.label}</div>
                <div style={{fontSize:"0.84rem",fontWeight:700,color:"#fff",marginTop:2}}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div style={{padding:"16px 26px 0"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:"0.75rem",color:B.textMuted,fontWeight:600}}>Project Progress</span>
            <span style={{fontSize:"0.75rem",color:B.textDark,fontWeight:700}}>{pct}%</span>
          </div>
          <MiniProgress pct={pct} color={sc.bar}/>
        </div>

        {/* Tags */}
        <div style={{padding:"12px 26px 0",display:"flex",gap:8,flexWrap:"wrap"}}>
          {post.tags.map((t,i)=>(
            <span key={i} style={{padding:"3px 10px",borderRadius:20,background:"#EEF5FF",color:B.blue,fontSize:"0.72rem",fontWeight:700,border:`1px solid ${B.blueLight}`}}>#{t}</span>
          ))}
        </div>

        {/* Description */}
        <p style={{padding:"12px 26px 0",fontSize:"0.86rem",color:B.textMuted,lineHeight:1.65,margin:0}}>{post.description}</p>

        {/* Note */}
        {post.note && (
          <div style={{margin:"12px 26px 0",padding:"12px 14px",borderRadius:12,background:"#fffbeb",border:"1.5px solid #fde68a",display:"flex",alignItems:"flex-start",gap:8}}>
            <StickyNote size={14} color="#d97706"/>
            <span style={{fontSize:"0.82rem",color:"#92400e",lineHeight:1.5}}>{post.note}</span>
          </div>
        )}

        {/* Tabs */}
        <div style={{display:"flex",gap:0,borderBottom:`1.5px solid ${B.border}`,margin:"16px 26px 0",paddingBottom:0}}>
          {[["applicants",`Applicants (${post.applicants.length})`],["timeline","Milestones"],["stats","Stats"]].map(([key,label])=>(
            <button key={key} onClick={()=>setTab(key)}
              style={{padding:"9px 18px",border:"none",borderBottom:tab===key?`2.5px solid ${B.blue}`:"2.5px solid transparent",background:"transparent",color:tab===key?B.blue:B.textMuted,fontWeight:tab===key?700:500,fontSize:"0.84rem",cursor:"pointer",fontFamily:"inherit",marginBottom:-1.5}}>
              {label}
            </button>
          ))}
        </div>

        <div style={{padding:"16px 26px 24px"}}>
          {/* Applicants Tab */}
          {tab==="applicants" && (
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {post.applicants.map((a,i)=>{
                const s={Approved:{bg:"#ecfdf5",c:"#065f46"},Pending:{bg:"#fffbeb",c:"#b45309"},Rejected:{bg:"#fef2f2",c:"#991b1b"},Forwarded:{bg:"#eff6ff",c:"#1e40af"}}[a.status]||{bg:"#f1f5f9",c:"#64748b"};
                return (
                  <motion.div key={i} initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
                    style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:12,background:"#f8fbff",border:`1.5px solid ${B.border}`}}>
                    <Avatar name={a.name} idx={i} size={36}/>
                    <div style={{flex:1}}>
                      <div style={{fontSize:"0.88rem",fontWeight:700,color:B.textDark}}>{a.name}</div>
                      <div style={{fontSize:"0.75rem",color:B.textMuted,marginTop:2}}>{a.program} · {a.id}</div>
                    </div>
                    <span style={{fontSize:"0.72rem",fontWeight:700,padding:"3px 10px",borderRadius:20,background:s.bg,color:s.c}}>{a.status}</span>
                  </motion.div>
                );
              })}
            </div>
          )}
          {/* Timeline Tab */}
          {tab==="timeline" && <Timeline milestones={post.milestones}/>}
          {/* Stats Tab */}
          {tab==="stats" && (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              {[
                {label:"Total Applied",  value:post.applicants.length,         color:B.blue},
                {label:"Selected",       value:selected(post),                 color:"#10b981"},
                {label:"Pending Review", value:post.applicants.filter(a=>a.status==="Pending").length, color:"#f59e0b"},
                {label:"Rejected",       value:post.applicants.filter(a=>a.status==="Rejected").length,color:"#ef4444"},
                {label:"Duration (days)",value:Math.ceil((new Date(post.deadline)-new Date(post.createdAt))/86400000), color:B.navy},
                {label:"Milestones Done",value:`${post.milestones.filter(m=>m.done).length}/${post.milestones.length}`, color:"#8b5cf6"},
              ].map((s,i)=>(
                <div key={i} style={{background:"#f8fbff",borderRadius:12,padding:"14px 16px",border:`1.5px solid ${B.border}`}}>
                  <div style={{fontSize:"1.5rem",fontWeight:800,color:s.color}}>{s.value}</div>
                  <div style={{fontSize:"0.75rem",color:B.textMuted,marginTop:4}}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Post Card ────────────────────────────────────────────────────────────────
const PostCard = ({post,idx,onView,onDelete,onTogglePin,onNote,onDuplicate}) => {
  const [menuOpen,setMenuOpen]=useState(false);
  const sc=STATUS_C[post.status]||STATUS_C.Upcoming;
  const tc=TYPE_C[post.type]||TYPE_C.Project;
  const pct=progress(post);
  const dl=daysLeft(post.deadline);
  const soon=deadlineSoon(post.deadline);

  return (
    <motion.div
      layout
      initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.95}}
      transition={{delay:idx*0.06}}
      whileHover={{y:-4,boxShadow:"0 18px 40px rgba(25,54,72,0.13)"}}
      style={{background:"#fff",borderRadius:20,padding:"22px",boxShadow:"0 4px 18px rgba(25,54,72,0.08)",display:"flex",flexDirection:"column",gap:13,border:`1.5px solid ${post.pinned?B.blueLight:B.border}`,position:"relative",overflow:"visible"}}
    >
      {/* Pin ribbon */}
      {post.pinned && (
        <div style={{position:"absolute",top:-1,right:18,background:`linear-gradient(135deg,${B.navy},${B.blue})`,color:"#fff",fontSize:"0.65rem",fontWeight:700,padding:"3px 10px 4px",borderRadius:"0 0 10px 10px",letterSpacing:"0.06em",textTransform:"uppercase",display:"flex",alignItems:"center",gap:4}}>
          <Pin size={10}/> Pinned
        </div>
      )}

      {/* Card header */}
      <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
        <div style={{width:42,height:42,borderRadius:12,background:"#EEF5FF",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1.5px solid ${B.border}`}}>
          <Building2 size={20} color={B.blue}/>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:5}}>
            <Badge label={post.type}    bg={tc.bg}  text={tc.text}  border={tc.border}/>
            <Badge label={post.status}  bg={sc.bg}  text={sc.text}  border={sc.border}/>
            <PriorityDot p={post.priority}/>
            {soon && <Badge label="⚡ Soon" bg="#fef2f2" text="#dc2626" border="#fecaca"/>}
          </div>
          <h3 style={{fontSize:"1rem",fontWeight:700,color:B.textDark,margin:0,lineHeight:1.3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{post.title}</h3>
          <p style={{fontSize:"0.8rem",color:B.textMid,margin:"3px 0 0 0",fontWeight:500}}>{post.industry} <span style={{color:B.textFaint}}>· {post.domain}</span></p>
        </div>
        {/* 3-dot menu */}
        <div style={{position:"relative",flexShrink:0}}>
          <motion.button whileTap={{scale:0.9}} onClick={()=>setMenuOpen(v=>!v)}
            style={{width:30,height:30,borderRadius:8,border:`1.5px solid ${B.border}`,background:"#f8fbff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:B.textMuted}}>
            <MoreVertical size={15}/>
          </motion.button>
          <AnimatePresence>
            {menuOpen && (
              <CtxMenu
                pinned={post.pinned}
                onPin={()=>onTogglePin(post.id)}
                onNote={()=>{setMenuOpen(false);onNote(post);}}
                onDuplicate={()=>onDuplicate(post.id)}
                onArchive={()=>onDelete(post.id)}
                onClose={()=>setMenuOpen(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Description */}
      <p style={{fontSize:"0.83rem",color:B.textMuted,lineHeight:1.55,margin:0,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{post.description}</p>

      {/* Tags */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {post.tags.map((t,i)=>(
          <span key={i} style={{padding:"2px 9px",borderRadius:20,background:"#EEF5FF",color:B.blue,fontSize:"0.7rem",fontWeight:700,border:`1px solid ${B.blueLight}77`}}>#{t}</span>
        ))}
        {post.note && (
          <span style={{padding:"2px 9px",borderRadius:20,background:"#fffbeb",color:"#d97706",fontSize:"0.7rem",fontWeight:700,border:"1px solid #fde68a",display:"flex",alignItems:"center",gap:4}}>
            <StickyNote size={10}/> Note
          </span>
        )}
      </div>

      {/* Progress */}
      <div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
          <span style={{fontSize:"0.73rem",color:B.textFaint,fontWeight:500}}>
            {post.milestones.filter(m=>m.done).length}/{post.milestones.length} milestones
          </span>
          <span style={{fontSize:"0.73rem",fontWeight:700,color:sc.text}}>{pct}%</span>
        </div>
        <MiniProgress pct={pct} color={sc.bar}/>
      </div>

      {/* Dates row */}
      <div style={{display:"flex",justifyContent:"space-between",gap:8}}>
        <span style={{display:"flex",alignItems:"center",gap:5,fontSize:"0.76rem",color:B.textMuted,background:"#f8fbff",padding:"4px 10px",borderRadius:8,border:`1px solid ${B.border}`}}>
          <Calendar size={11}/> {post.createdAt}
        </span>
        <span style={{display:"flex",alignItems:"center",gap:5,fontSize:"0.76rem",padding:"4px 10px",borderRadius:8,border:`1px solid ${soon?"#fecaca":B.border}`,background:soon?"#fef2f2":"#f8fbff",color:soon?"#dc2626":B.textMuted,fontWeight:soon?700:400}}>
          <Clock size={11}/> {post.deadline}{dl>0?` · ${dl}d left`:" · Ended"}
        </span>
      </div>

      {/* Applicants strip */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <div style={{display:"flex",alignItems:"center"}}>
            {post.applicants.slice(0,4).map((a,i)=><Avatar key={i} name={a.name} idx={i}/>)}
            {post.applicants.length>4&&<div style={{width:28,height:28,borderRadius:"50%",border:"2px solid #fff",background:"#EEF5FF",color:B.blue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.68rem",fontWeight:800,marginLeft:-8}}>+{post.applicants.length-4}</div>}
          </div>
          <span style={{fontSize:"0.78rem",color:B.textMuted,marginLeft:6,fontWeight:500}}>{post.applicants.length} applied</span>
        </div>
        <span style={{display:"flex",alignItems:"center",gap:4,fontSize:"0.78rem",color:"#065f46",fontWeight:700,background:"#ecfdf5",padding:"3px 10px",borderRadius:20,border:"1px solid #a7f3d0"}}>
          <Award size={12}/> {selected(post)} selected
        </span>
      </div>

      <div style={{height:"1px",background:B.border}}/>

      {/* Action row */}
      <div style={{display:"flex",gap:9}}>
        <motion.button whileTap={{scale:0.95}} onClick={()=>onView(post)}
          style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:"#EEF5FF",color:B.blue,border:`1.5px solid ${B.blueLight}`,borderRadius:11,padding:"9px 12px",fontSize:"0.82rem",fontWeight:700,cursor:"pointer"}}>
          <Eye size={14}/> View Details
        </motion.button>
        <motion.button whileTap={{scale:0.95}} onClick={()=>onNote(post)}
          style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:"#fffbeb",color:"#d97706",border:"1.5px solid #fde68a",borderRadius:11,padding:"9px 12px",fontSize:"0.82rem",fontWeight:700,cursor:"pointer"}}>
          <StickyNote size={14}/>
        </motion.button>
        <motion.button whileTap={{scale:0.95}} onClick={()=>onDelete(post.id)}
          style={{display:"flex",alignItems:"center",justifyContent:"center",background:"#fef2f2",color:"#dc2626",border:"1.5px solid #fecaca",borderRadius:11,padding:"9px 12px",cursor:"pointer"}}>
          <Trash2 size={14}/>
        </motion.button>
      </div>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const IndustryProjects = () => {
  const [posts,setPosts]             = useState(INITIAL);
  const [selectedPost,setSelectedPost] = useState(null);
  const [notePost,setNotePost]       = useState(null);
  const [search,setSearch]           = useState("");
  const [typeF,setTypeF]             = useState("All");
  const [statusF,setStatusF]         = useState("All");
  const [sortBy,setSortBy]           = useState("pinned");
  const [view,setView]               = useState("grid"); // grid | list
  const [showAnalytics,setShowAnalytics] = useState(true);

  const handleDelete    = (id)   => { if (window.confirm("Delete this post?")) setPosts(p=>p.filter(x=>x.id!==id)); };
  const handleTogglePin = (id)   => setPosts(p=>p.map(x=>x.id===id?{...x,pinned:!x.pinned}:x));
  const handleSaveNote  = (id,v) => setPosts(p=>p.map(x=>x.id===id?{...x,note:v}:x));
  const handleDuplicate = (id)   => { const src=posts.find(x=>x.id===id); if(!src)return; setPosts(p=>[...p,{...src,id:Date.now(),title:src.title+" (Copy)",pinned:false}]); };

  const exportCSV = () => {
    const rows=[["ID","Title","Industry","Type","Status","Priority","Applicants","Selected","Deadline"],...posts.map(p=>[p.id,p.title,p.industry,p.type,p.status,p.priority,p.applicants.length,selected(p),p.deadline])];
    const csv=rows.map(r=>r.join(",")).join("\n");
    const a=document.createElement("a"); a.href="data:text/csv;charset=utf-8,"+encodeURI(csv); a.download="industry-projects.csv"; a.click();
  };

  const filtered = useMemo(()=>{
    let r=[...posts];
    if(search) r=r.filter(p=>p.title.toLowerCase().includes(search.toLowerCase())||p.industry.toLowerCase().includes(search.toLowerCase())||p.domain.toLowerCase().includes(search.toLowerCase())||p.tags.some(t=>t.toLowerCase().includes(search.toLowerCase())));
    if(typeF!=="All")   r=r.filter(p=>p.type===typeF);
    if(statusF!=="All") r=r.filter(p=>p.status===statusF);
    if(sortBy==="pinned")   r.sort((a,b)=>b.pinned-a.pinned);
    if(sortBy==="deadline") r.sort((a,b)=>new Date(a.deadline)-new Date(b.deadline));
    if(sortBy==="applicants") r.sort((a,b)=>b.applicants.length-a.applicants.length);
    if(sortBy==="progress") r.sort((a,b)=>progress(b)-progress(a));
    return r;
  },[posts,search,typeF,statusF,sortBy]);

  return (
    <>
    <LiaisonNavbar />
    <div style={{padding:"36px 52px",background:B.pageBg,minHeight:"100vh",fontFamily:"'Poppins',sans-serif"}}>

      {/* Page Header - premium */}
      <motion.div
        initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{duration:0.4}}
        style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:14}}
      >
        <div style={{display:"flex", alignItems:"center", gap:14, minWidth:0}}>
          <div style={{
            width:44, height:44, borderRadius:12,
            background:"#193648", color:"#fff", flexShrink:0,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:"0 8px 18px rgba(25,54,72,0.28)",
          }}>
            <Briefcase size={20}/>
          </div>
          <div style={{minWidth:0}}>
            <h1 style={{
              margin:0, fontSize:22, fontWeight:800, color:"#193648",
              letterSpacing:"-0.02em", fontFamily:"'Sora', 'Inter', sans-serif",
              display:"flex", alignItems:"center", gap:10, flexWrap:"wrap",
            }}>
              Industry Projects &amp; Internships
              <span style={{
                fontSize:10, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase",
                color:"#3A70B0", background:"#eff6ff", border:"1px solid #cfe0f0",
                padding:"3px 10px", borderRadius:999,
              }}>Live</span>
            </h1>
            <p style={{margin:"4px 0 0", fontSize:12.5, color:"#94a3b8"}}>
              Manage collaborations, track milestones, and oversee student participation.
            </p>
          </div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <motion.button whileTap={{scale:0.95}} onClick={()=>setShowAnalytics(v=>!v)}
            style={{
              display:"inline-flex", alignItems:"center", gap:7,
              padding:"9px 14px", borderRadius:10,
              background:"#fff", border:"1px solid #E2EEF9", color:"#193648",
              fontSize:12.5, fontWeight:700, cursor:"pointer",
              boxShadow:"0 4px 12px rgba(25,54,72,0.06)",
              transition:"background 0.18s ease, border-color 0.18s ease, transform 0.18s ease",
            }}
              onMouseEnter={(e)=>{ e.currentTarget.style.background="#eff6ff"; e.currentTarget.style.borderColor="#3A70B0"; e.currentTarget.style.transform="translateY(-1px)"; }}
              onMouseLeave={(e)=>{ e.currentTarget.style.background="#fff"; e.currentTarget.style.borderColor="#E2EEF9"; e.currentTarget.style.transform=""; }}
          >
            <BarChart2 size={13}/> {showAnalytics?"Hide":"Show"} Analytics
          </motion.button>
          <motion.button whileTap={{scale:0.95}} onClick={exportCSV}
            style={{
              display:"inline-flex", alignItems:"center", gap:7,
              padding:"9px 16px", borderRadius:10,
              background:"#193648", color:"#fff", border:"none",
              fontSize:12.5, fontWeight:800, cursor:"pointer",
              boxShadow:"0 8px 18px rgba(25,54,72,0.25)",
              transition:"transform 0.18s ease, box-shadow 0.18s ease",
            }}
              onMouseEnter={(e)=>{ e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 12px 24px rgba(25,54,72,0.32)"; }}
              onMouseLeave={(e)=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 8px 18px rgba(25,54,72,0.25)"; }}
          >
            <Download size={13}/> Export CSV
          </motion.button>
        </div>
      </motion.div>

      {/* Analytics */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} style={{overflow:"hidden"}}>
            <AnalyticsBar posts={posts}/>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini chart + filter bar */}
      <div style={{display:"flex",gap:20,marginBottom:26,alignItems:"stretch",flexWrap:"wrap"}}>
        {/* Donut */}
        <div style={{
          position:"relative",
          background:"linear-gradient(180deg, #ffffff, #fbfdff)",
          borderRadius:16, padding:"18px 22px",
          border:"1px solid #E2EEF9",
          boxShadow:"0 6px 22px rgba(25,54,72,0.07)",
          flexShrink:0, overflow:"hidden",
        }}>
          <span aria-hidden style={{
            position:"absolute", top:0, left:0, right:0, height:3,
            background:"linear-gradient(90deg, #193648, #3A70B0, #7AA9D6)",
          }} />
          <div style={{fontSize:10.5, fontWeight:800, color:"#3A70B0", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:14}}>
            Status Breakdown
          </div>
          <DonutChart posts={posts}/>
        </div>

        {/* Filters */}
        <div style={{flex:1, display:"flex", flexDirection:"column", gap:10, minWidth:260}}>
          <div style={{
            display:"flex", alignItems:"center", gap:9,
            background:"#fff", borderRadius:12, padding:"10px 14px",
            border:"1px solid #E2EEF9",
            boxShadow:"0 4px 14px rgba(25,54,72,0.06)",
            transition:"border-color 0.18s ease, box-shadow 0.18s ease",
          }}
            onFocusCapture={(e)=>{ e.currentTarget.style.borderColor="#3A70B0"; e.currentTarget.style.boxShadow="0 4px 14px rgba(58,112,176,0.18)"; }}
            onBlurCapture={(e)=>{ e.currentTarget.style.borderColor="#E2EEF9"; e.currentTarget.style.boxShadow="0 4px 14px rgba(25,54,72,0.06)"; }}
          >
            <Search size={15} color="#94a3b8"/>
            <input style={{border:"none", outline:"none", fontSize:"0.9rem", background:"transparent", width:"100%", color:"#193648"}} placeholder="Search title, industry, domain, tag..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>

          <div style={{display:"flex", gap:6, flexWrap:"wrap"}}>
            {["All","Project","Internship","Workshop","Research"].map(t=>{
              const active = typeF===t;
              return (
                <button key={t} onClick={()=>setTypeF(t)}
                  style={{
                    padding:"6px 13px", borderRadius:8,
                    border:`1px solid ${active?"#193648":"#E2EEF9"}`,
                    background:active?"#193648":"#fff",
                    color:active?"#fff":"#64748b",
                    fontSize:"0.78rem", fontWeight:700, cursor:"pointer",
                    transition:"background 0.18s ease, border-color 0.18s ease, color 0.18s ease",
                  }}
                    onMouseEnter={(e)=>{ if(!active){ e.currentTarget.style.background="#f8fbff"; e.currentTarget.style.borderColor="#3A70B0"; } }}
                    onMouseLeave={(e)=>{ if(!active){ e.currentTarget.style.background="#fff"; e.currentTarget.style.borderColor="#E2EEF9"; } }}
                >
                  {t}
                </button>
              );
            })}
          </div>

          <div style={{display:"flex", gap:6, flexWrap:"wrap", alignItems:"center", justifyContent:"flex-end"}}>
            <span style={{fontSize:"0.72rem", color:"#94a3b8", fontWeight:800, letterSpacing:"0.08em", textTransform:"uppercase"}}>Sort:</span>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)}
              style={{
                padding:"6px 10px", borderRadius:8,
                border:"1px solid #E2EEF9",
                background:"#fff", color:"#193648",
                fontSize:"0.76rem", fontWeight:600,
                outline:"none", cursor:"pointer",
              }}>
              <option value="pinned">Pinned First</option>
              <option value="deadline">Deadline</option>
              <option value="applicants">Most Applicants</option>
              <option value="progress">Progress</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        marginBottom:18, padding:"10px 14px",
        background:"#f8fbff", borderRadius:10, border:"1px solid #eef2ff",
      }}>
        <span style={{fontSize:"0.82rem", color:"#64748b", fontWeight:600, display:"inline-flex", alignItems:"center", gap:7}}>
          <span style={{width:6, height:6, borderRadius:"50%", background:"#22C55E", boxShadow:"0 0 0 3px rgba(34,197,94,0.20)"}} />
          Showing <strong style={{color:"#193648", fontVariantNumeric:"tabular-nums"}}>{filtered.length}</strong>
          <span style={{color:"#cbd5e1"}}>of</span>
          <strong style={{color:"#193648", fontVariantNumeric:"tabular-nums"}}>{posts.length}</strong> posts
        </span>
        <div style={{display:"flex", gap:4, padding:3, borderRadius:9, background:"#fff", border:"1px solid #E2EEF9"}}>
          {["grid","list"].map(v=>{
            const active = view===v;
            return (
              <button key={v} onClick={()=>setView(v)}
                style={{
                  padding:"5px 12px", borderRadius:7, border:"none",
                  background:active?"#193648":"transparent",
                  color:active?"#fff":"#64748b",
                  fontSize:"0.76rem", fontWeight:700, cursor:"pointer",
                  textTransform:"capitalize",
                  transition:"background 0.18s ease, color 0.18s ease",
                }}>
                {v}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cards */}
      {filtered.length===0 ? (
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"80px 0"}}>
          <Briefcase size={52} color={B.border}/>
          <p style={{color:B.textFaint,marginTop:12,fontWeight:500}}>No posts match your filters.</p>
        </div>
      ) : (
        <motion.div layout style={{
          display: view==="list" ? "flex" : "grid",
          flexDirection: view==="list" ? "column" : undefined,
          gridTemplateColumns: view==="grid" ? "repeat(auto-fill,minmax(330px,1fr))" : undefined,
          gap: 20,
        }}>
          <AnimatePresence>
            {filtered.map((post,idx)=>(
              <PostCard key={post.id} post={post} idx={idx}
                onView={setSelectedPost}
                onDelete={handleDelete}
                onTogglePin={handleTogglePin}
                onNote={setNotePost}
                onDuplicate={handleDuplicate}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedPost && <DetailModal post={selectedPost} onClose={()=>setSelectedPost(null)}/>}
      </AnimatePresence>

      {/* Note Modal */}
      <AnimatePresence>
        {notePost && (
          <NoteModal post={notePost}
            onSave={v=>handleSaveNote(notePost.id,v)}
            onClose={()=>setNotePost(null)}
          />
        )}
      </AnimatePresence>
    </div>
    <LiaisonFooter />
    </>
  );
};

export default IndustryProjects;