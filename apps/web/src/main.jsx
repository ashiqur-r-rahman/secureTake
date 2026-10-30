import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

function StudentCard({ active, studentId, token }) {
  return <section className={`card ${active ? 'active' : 'inactive'}`}><b>Status: {active ? 'ACTIVE — GREEN' : 'INACTIVE'}</b><p>ID: {studentId}</p>{active ? <code>{token}</code> : <p>Teacher has not shared an active session.</p>}<small>GPS and network are checked at scan time.</small></section>;
}
function App() {
  const [active, setActive] = useState(false); const [left, setLeft] = useState(120);
  useEffect(() => { if (!active) return; const timer = setInterval(() => setLeft(value => value ? value - 1 : 0), 1000); return () => clearInterval(timer); }, [active]);
  return <main><header><h1>SDAS Portal</h1><span>Secure Dynamic Attendance</span></header><section className="toolbar"><b>Active Session: CSE3206 Lab 04</b><span>Time remaining: {String(Math.floor(left / 60)).padStart(2,'0')}:{String(left % 60).padStart(2,'0')}</span><button onClick={() => { setLeft(120); setActive(true); }}>Generate unique QRs</button><button onClick={() => setActive(false)}>Close & edit report</button></section><StudentCard active={active && left > 0} studentId="2203031" token="Personal signed QR token" /></main>;
}
createRoot(document.getElementById('root')).render(<App/>);
