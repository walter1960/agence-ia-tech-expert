import React, { useState, useEffect } from 'react';
import { 
  Shield, ShieldAlert, Cpu, Terminal, Sliders, Play, Check, AlertTriangle, 
  Database, RefreshCw, FileCode, FolderOpen, Network, CheckCircle, Code, Lock
} from 'lucide-react';

interface Vuln {
  id: string;
  file: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
  originalCode: string;
  fixedCode: string;
  status: 'open' | 'fixed';
}

interface LogEntry {
  time: string;
  type: 'INFO' | 'WARNING' | 'ALERT' | 'ACTION';
  source: string;
  message: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'audit' | 'soar' | 'compiler'>('audit');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState('');
  const [targetRepo, setTargetRepo] = useState('ScamShield (Android)');
  const [activeAlerts, setActiveAlerts] = useState<number>(3);
  
  // DevSecOps Audit vulnerabilities
  const [vulns, setVulns] = useState<Vuln[]>([
    {
      id: "VULN-001",
      file: "app/src/main/java/com/secure/scamshield/network/FirebaseService.kt",
      severity: "CRITICAL",
      description: "Cle d'API Firebase encodee en dur dans le code source.",
      originalCode: 'val FIREBASE_API_KEY = "AIzaSyAs-df94K2jKSl82mSLDk29a1K0s94k"\nval DB_URL = "https://scamshield-default-rtdb.firebaseio.com"',
      fixedCode: 'val FIREBASE_API_KEY = BuildConfig.FIREBASE_API_KEY\nval DB_URL = BuildConfig.FIREBASE_DB_URL',
      status: 'open'
    },
    {
      id: "VULN-002",
      file: "app/src/main/java/com/secure/scamshield/db/UserDao.kt",
      severity: "HIGH",
      description: "Injection SQL possible lors de la recherche brute de logs.",
      originalCode: 'val query = "SELECT * FROM sms_logs WHERE sender = \'" + searchTerm + "\'"\nreturn db.rawQuery(query, null)',
      fixedCode: 'val query = "SELECT * FROM sms_logs WHERE sender = ?"\nreturn db.rawQuery(query, arrayOf(searchTerm))',
      status: 'open'
    },
    {
      id: "VULN-003",
      file: "app/src/main/AndroidManifest.xml",
      severity: "MEDIUM",
      description: "L'attribut 'android:allowBackup' est active, exposant les donnees utilisateur.",
      originalCode: '<application\n    android:allowBackup="true"\n    android:label="@string/app_name">',
      fixedCode: '<application\n    android:allowBackup="false"\n    android:label="@string/app_name">',
      status: 'open'
    }
  ]);

  // SOAR Log Stream
  const [soarLogs, setSoarLogs] = useState<LogEntry[]>([
    { time: "23:40:12", type: "INFO", source: "AuthDaemon", message: "SSH user admin logged in successfully from 192.168.1.10" },
    { time: "23:41:05", type: "WARNING", source: "Nginx-Reverse", message: "HTTP 404 scan path detected on endpoint /wp-admin/" },
    { time: "23:42:01", type: "INFO", source: "SystemMonitor", message: "CPU temperature stabilized at 42C. Fan speed 1200 RPM." }
  ]);

  // SOAR Firewall Rules
  const [blockedIPs, setBlockedIPs] = useState<string[]>([
    "185.220.101.4 (TOR Exit)",
    "94.23.14.88 (Scanning bot)"
  ]);

  // Compiler State
  const [specInput, setSpecInput] = useState('Un demon systeme Rust de bas niveau qui surveille le CPU et la RAM et ecrit les logs dans /var/log/system_guard.log.');
  const [compileTarget, setCompileTarget] = useState<'rust' | 'tauri' | 'kotlin' | 'react'>('rust');
  const [compilerOutput, setCompilerOutput] = useState<string>('');
  const [isCompiling, setIsCompiling] = useState(false);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress("Initialisation de l'analyseur Claw Code (AST Moteur Rust)...");
    
    setTimeout(() => {
      setScanProgress("Analyse de l'AST et scan des fichiers sources...");
      setTimeout(() => {
        setScanProgress("Verification des dependances tierces contre les CVE publiques...");
        setTimeout(() => {
          setIsScanning(false);
          setScanProgress("");
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const autofixVuln = (id: string) => {
    setVulns(prev => prev.map(v => v.id === id ? { ...v, status: 'fixed' } : v));
    setActiveAlerts(prev => Math.max(0, prev - 1));
    
    // Add SOAR log
    const time = new Date().toLocaleTimeString();
    setSoarLogs(prev => [
      {
        time,
        type: 'ACTION',
        source: 'DevSecOps Autopatcher',
        message: `Vulnerabilite ${id} corrigee automatiquement. Git diff applique.`
      },
      ...prev
    ]);
  };

  const simulateAttack = () => {
    const time = new Date().toLocaleTimeString();
    const attackerIP = "103.85.28.14";
    
    // Step 1: Warning log
    setSoarLogs(prev => [
      { time, type: 'ALERT', source: 'AuthDaemon', message: `SSH Authentication failure for user root from ${attackerIP}` },
      ...prev
    ]);

    // Step 2: Auto response
    setTimeout(() => {
      const respTime = new Date().toLocaleTimeString();
      setSoarLogs(prev => [
        { time: respTime, type: 'ACTION', source: 'SOAR Engine', message: `SSH Force brute detectee de ${attackerIP}. Blocage declenche.` },
        { time: respTime, type: 'ACTION', source: 'Systemctl', message: `Regle UFW ajoutee : DROP ALL de ${attackerIP} sur le port 22.` },
        ...prev
      ]);
      setBlockedIPs(prev => [...prev, `${attackerIP} (SSH Force Brute)`]);
      setActiveAlerts(prev => prev + 1);
    }, 1200);
  };

  const handleCompile = () => {
    setIsCompiling(true);
    setCompilerOutput("Demarrage du moteur de generation de code multi-plateforme...\nConfiguring environment templates...");
    
    setTimeout(() => {
      setCompilerOutput(prev => prev + "\n[Everything Claude Code] Analysing system requirements...\n[Claw Code AST Engine] Generating scaffolding files...");
      setTimeout(() => {
        setIsCompiling(false);
        if (compileTarget === 'rust') {
          setCompilerOutput(`// Generated by Agence IA Tech Expert Compiler
// Target: Low-level System Daemon (Rust)
// File: src/main.rs

use std::fs::OpenOptions;
use std::io::Write;
use std::thread;
use std::time::Duration;
use sysinfo::{CpuExt, System, SystemExt};

fn main() {
    let mut sys = System::new_all();
    println!("System Guard Daemon started. Monitoring resources...");

    loop {
        sys.refresh_all();
        
        let cpu_usage = sys.global_cpu_info().cpu_usage();
        let used_memory = sys.used_memory() / 1024 / 1024; // GB
        
        if cpu_usage > 90.0 {
            log_warning("CPU", cpu_usage);
        }
        
        thread::sleep(Duration::from_secs(5));
    }
}

fn log_warning(resource: &str, val: f32) {
    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open("/var/log/system_guard.log")
        .unwrap();

    let log_msg = format!("[WARNING] High {} usage detected: {:.2}%\\n", resource, val);
    file.write_all(log_msg.as_bytes()).unwrap();
}`);
        } else if (compileTarget === 'tauri') {
          setCompilerOutput(`// Generated by Agence IA Tech Expert Compiler
// Target: Desktop App (Tauri + Rust Backend)
// File: src-tauri/src/main.rs

#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[tauri::command]
fn get_system_status() -> String {
    format!("Active - Secure - Memory safe (Rust backend)")
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![get_system_status])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}`);
        } else {
          setCompilerOutput(`// Generated by Agence IA Tech Expert Compiler
// Code generated successfully for the selected target framework.
// Ready for staging and production build.`);
        }
      }, 1200);
    }, 1200);
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col p-4 md:p-8 space-y-6">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-red-500/20 space-y-4 md:space-y-0">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20 text-red-500">
              <Shield className="h-6 w-6 animate-pulse" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-red-200 to-amber-300 bg-clip-text text-transparent uppercase font-mono">
              Cyber Threat & DevSecOps Portal
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-red-500/10 text-red-400 rounded-full border border-red-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
              Secure System
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1 font-mono">
            Division Technique Experte (Low-Level Systems, Dev & CyberSec)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={simulateAttack}
            className="px-4 py-2 text-xs font-bold text-red-500 border border-red-500/30 hover:bg-red-500/10 rounded-lg transition font-mono uppercase"
          >
            Simuler une Attaque System
          </button>
        </div>
      </header>

      {/* Stats Bar */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="cyber-card p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Alertes Systemes</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <h3 className={`text-2xl md:text-3xl font-extrabold font-mono ${activeAlerts > 0 ? 'text-red-500' : 'text-emerald-400'}`}>
              {activeAlerts}
            </h3>
            <span className="text-xs text-slate-500">Menaces non-resolues</span>
          </div>
        </div>

        <div className="cyber-card p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">IPs Bloquees</span>
          <div className="mt-2">
            <h3 className="text-2xl md:text-3xl font-extrabold text-amber-500 font-mono">{blockedIPs.length}</h3>
            <span className="text-xs text-slate-500">Regles UFW actives</span>
          </div>
        </div>

        <div className="cyber-card p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">AST Engine (Claw)</span>
          <div className="mt-2">
            <h3 className="text-2xl md:text-3xl font-extrabold text-cyan-400 font-mono">99.8%</h3>
            <span className="text-xs text-slate-500">Couverture d'analyse</span>
          </div>
        </div>

        <div className="cyber-card p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Projets Deployes</span>
          <div className="mt-2">
            <h3 className="text-2xl md:text-3xl font-extrabold text-indigo-400 font-mono">4</h3>
            <span className="text-xs text-slate-500">Projets securises sur Vercel</span>
          </div>
        </div>
      </section>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-800 space-x-2 font-mono">
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition ${
            activeTab === 'audit' ? 'border-red-500 text-red-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          DevSecOps Audit
        </button>
        <button
          onClick={() => setActiveTab('soar')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition ${
            activeTab === 'soar' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          SOAR Monitor
        </button>
        <button
          onClick={() => setActiveTab('compiler')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition ${
            activeTab === 'compiler' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          AI Code Compiler
        </button>
      </div>

      {/* Content area */}
      <main className="flex-1">
        
        {/* Tab 1: DevSecOps Audit */}
        {activeTab === 'audit' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Scan configuration */}
            <div className="lg:col-span-4 cyber-card p-6 rounded-xl space-y-6">
              <h2 className="text-lg font-bold flex items-center gap-2 font-mono">
                <FolderOpen className="h-5 w-5 text-red-500" /> Cible d'Audit
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1.5 font-mono">Selectionner le repertoire</label>
                  <select 
                    value={targetRepo}
                    onChange={(e) => setTargetRepo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-sm text-slate-200 focus:outline-none"
                  >
                    <option value="ScamShield (Android)">ScamShield (Android App)</option>
                    <option value="projet_deep_research (FastAPI)">projet_deep_research (FastAPI)</option>
                    <option value="projet_auto_ops (Vite)">projet_auto_ops (Vite)</option>
                  </select>
                </div>

                <button
                  onClick={startScan}
                  disabled={isScanning}
                  className="w-full py-2.5 rounded-lg cyber-btn cyber-btn-danger font-semibold text-xs flex items-center justify-center gap-2"
                >
                  <Play className="h-4 w-4" /> {isScanning ? "Scanner en cours..." : "Lancer le scan AST"}
                </button>
              </div>

              {scanProgress && (
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-red-400">Scanner progress</span>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin text-red-500" />
                  </div>
                  <p className="text-slate-400 leading-5">{scanProgress}</p>
                </div>
              )}
            </div>

            {/* Right: Vulnerability reports */}
            <div className="lg:col-span-8 cyber-card p-6 rounded-xl space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2 font-mono">
                <ShieldAlert className="h-5 w-5 text-red-500 animate-bounce" /> Vulnerabilites Identifiees ({vulns.filter(v=>v.status==='open').length})
              </h2>

              <div className="space-y-4">
                {vulns.map(vuln => (
                  <div key={vuln.id} className="p-5 bg-slate-950/50 border border-slate-850 rounded-xl space-y-4">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                            vuln.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                            vuln.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' :
                            'bg-blue-500/20 text-blue-500 border border-blue-500/30'
                          } font-mono`}>
                            {vuln.severity}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">{vuln.id}</span>
                          <span className="text-xs text-slate-400 font-mono font-medium">{vuln.file.split('/').pop()}</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-200 mt-2">{vuln.description}</p>
                      </div>

                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                        vuln.status === 'open' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {vuln.status === 'open' ? 'Actif' : 'Corrige'}
                      </span>
                    </div>

                    {/* Diff blocks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[11px]">
                      <div className="space-y-1">
                        <span className="text-[10px] text-red-400 uppercase tracking-wider">Code Actuel</span>
                        <pre className="p-3 bg-red-950/20 border border-red-900/30 text-red-300 rounded-lg overflow-x-auto">
                          {vuln.originalCode}
                        </pre>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-emerald-400 uppercase tracking-wider">Patch Automatise</span>
                        <pre className="p-3 bg-emerald-950/20 border border-emerald-900/30 text-emerald-300 rounded-lg overflow-x-auto">
                          {vuln.fixedCode}
                        </pre>
                      </div>
                    </div>

                    {vuln.status === 'open' && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => autofixVuln(vuln.id)}
                          className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs cyber-btn font-mono"
                        >
                          Appliquer le Correctif Autonome
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: SOAR Monitor */}
        {activeTab === 'soar' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Live Terminal logs */}
            <div className="lg:col-span-8 cyber-card p-6 rounded-xl space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2 font-mono">
                <Terminal className="h-5 w-5 text-amber-500" /> Superviseur Systeme & Logs de SecOps
              </h2>

              <div className="bg-slate-950 p-4 rounded-xl font-mono text-xs text-slate-300 h-80 overflow-y-auto space-y-2 border border-slate-900">
                {soarLogs.map((log, i) => (
                  <div key={i} className="leading-5">
                    <span className="text-slate-600">[{log.time}]</span>
                    <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      log.type === 'ALERT' ? 'bg-red-500/20 text-red-500' :
                      log.type === 'WARNING' ? 'bg-amber-500/20 text-amber-500' :
                      log.type === 'ACTION' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {log.type}
                    </span>
                    <span className="text-indigo-400 font-bold ml-2">[{log.source}]</span>
                    <span className="text-slate-300 ml-2">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Blocked IPs / Firewall */}
            <div className="lg:col-span-4 cyber-card p-6 rounded-xl space-y-6">
              <h2 className="text-lg font-bold flex items-center gap-2 font-mono">
                <Network className="h-5 w-5 text-amber-500" /> Regles de Pare-Feu UFW
              </h2>

              <div className="space-y-3">
                {blockedIPs.map((ip, i) => (
                  <div key={i} className="p-3 bg-slate-900 border border-slate-850 rounded-lg flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4.5 w-4.5 text-red-500" />
                      <span>{ip}</span>
                    </div>
                    <button 
                      onClick={() => setBlockedIPs(prev => prev.filter((_, idx) => idx !== i))}
                      className="text-slate-500 hover:text-slate-200 text-[10px]"
                    >
                      DEBLOQUER
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 3: Multi-Platform AI Compiler */}
        {activeTab === 'compiler' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Input Specs */}
            <div className="lg:col-span-5 cyber-card p-6 rounded-xl space-y-6">
              <h2 className="text-lg font-bold flex items-center gap-2 font-mono">
                <Sliders className="h-5 w-5 text-cyan-400" /> Configurations du Projet
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1.5 font-mono">Cibles de Compilation</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setCompileTarget('rust')}
                      className={`p-3 rounded-lg border text-left font-mono ${
                        compileTarget === 'rust' ? 'bg-cyan-950/20 border-cyan-500 text-cyan-300' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold block">Rust System</span>
                      <span className="text-[10px] text-slate-500">Low-level daemon</span>
                    </button>
                    <button
                      onClick={() => setCompileTarget('tauri')}
                      className={`p-3 rounded-lg border text-left font-mono ${
                        compileTarget === 'tauri' ? 'bg-cyan-950/20 border-cyan-500 text-cyan-300' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold block">Tauri Desktop</span>
                      <span className="text-[10px] text-slate-500">Cross-platform GUI</span>
                    </button>
                    <button
                      onClick={() => setCompileTarget('kotlin')}
                      className={`p-3 rounded-lg border text-left font-mono ${
                        compileTarget === 'kotlin' ? 'bg-cyan-950/20 border-cyan-500 text-cyan-300' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold block">Kotlin Native</span>
                      <span className="text-[10px] text-slate-500">Mobile Android</span>
                    </button>
                    <button
                      onClick={() => setCompileTarget('react')}
                      className={`p-3 rounded-lg border text-left font-mono ${
                        compileTarget === 'react' ? 'bg-cyan-950/20 border-cyan-500 text-cyan-300' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold block">React Frontend</span>
                      <span className="text-[10px] text-slate-500">Vite Web Application</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1.5 font-mono">Specifications Fonctionnelles</label>
                  <textarea
                    value={specInput}
                    onChange={(e) => setSpecInput(e.target.value)}
                    rows={4}
                    className="w-full text-xs bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  onClick={handleCompile}
                  disabled={isCompiling}
                  className="w-full py-2.5 rounded-lg cyber-btn font-semibold text-xs flex items-center justify-center gap-2"
                >
                  <Code className="h-4 w-4" /> {isCompiling ? "Generation du code..." : "Compiler l'architecture"}
                </button>
              </div>
            </div>

            {/* Output File Viewer */}
            <div className="lg:col-span-7 cyber-card p-6 rounded-xl space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2 font-mono">
                <FileCode className="h-5 w-5 text-cyan-400" /> Fichiers Generes
              </h2>

              <pre className="p-4 bg-slate-950 border border-slate-850 text-cyan-300 font-mono text-[11px] leading-5 rounded-lg overflow-y-auto h-96">
                {compilerOutput || "Aucun code genere pour l'instant. Cliquez sur 'Compiler l'architecture' pour commencer."}
              </pre>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
