// src/pages/SystemSettings.jsx
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Moon,
  ShieldCheck,
  Database,
  CloudUpload,
  Zap,
  Save,
  Clock,
  Key,
  ImageIcon,
} from "lucide-react";

/**
 * SystemSettings.jsx
 * - Modern Web Dashboard style (light background)
 * - Inline CSS only
 * - Hardcoded admin: username "admin", password "admin123"
 */

const HARDCODED_ADMIN = {
  username: "admin",
  password: "admin123",
  displayName: "Admin",
  email: "admin@collaxion.local",
};

const initialSettings = {
  preferences: {
    theme: "light",
    notifications: true,
    language: "English",
  },
  security: {
    twoFA: false,
    loginHistory: [
      { id: 1, when: "2025-10-28 14:12", ip: "103.45.12.11", device: "Chrome on Windows" },
      { id: 2, when: "2025-10-20 09:03", ip: "41.220.3.44", device: "Firefox on Mac" },
    ],
  },
  integrations: {
    slack: false,
    github: false,
    googleDrive: false,
  },
  profile: {
    displayName: "Admin",
    email: "admin@collaxion.local",
    avatar: null,
  },
};

const SystemSettings = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [settings, setSettings] = useState(() => ({ ...initialSettings }));
  const [adminPassword, setAdminPassword] = useState(HARDCODED_ADMIN.password);
  const [profileImagePreview, setProfileImagePreview] = useState(settings.profile.avatar);
  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" });
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);

  // Helper: update nested settings
  const updateSettings = (path, value) => {
    setSettings((s) => {
      const next = JSON.parse(JSON.stringify(s));
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
    flash("Saved");
  };

  const flash = (txt) => {
    setMessage(txt);
    setTimeout(() => setMessage(null), 2000);
  };

  // PROFILE: avatar upload
  const onProfileImage = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setProfileImagePreview(url);
    setSettings((s) => ({ ...s, profile: { ...s.profile, avatar: url } }));
    flash("Profile image updated (preview)");
  };

  // PROFILE: change password
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordForm.current !== HARDCODED_ADMIN.password) {
      alert("Current password is incorrect.");
      return;
    }
    if (!passwordForm.newPass || passwordForm.newPass.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      alert("New password and confirm do not match.");
      return;
    }
    setAdminPassword(passwordForm.newPass);
    HARDCODED_ADMIN.password = passwordForm.newPass; 
    setPasswordForm({ current: "", newPass: "", confirm: "" });
    flash("Password changed");
  };

  // BACKUP: export settings as JSON
  const handleExport = () => {
    const payload = {
      settings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "collaxion-settings.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    flash("Exported settings");
  };

  // BACKUP: import JSON
  const handleImport = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (parsed.settings) {
          setSettings(parsed.settings);
          setProfileImagePreview(parsed.settings.profile?.avatar || null);
          flash("Imported settings");
        } else {
          alert("Invalid settings file.");
        }
      } catch (err) {
        alert("Failed to parse JSON.");
      }
    };
    reader.readAsText(f);
  };

  // 🔹 Session-only toggle functions
  const togglePref = (key) => {
    setSettings((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: !prev.preferences[key] },
    }));
  };

  const toggleIntegration = (key) => {
    setSettings((prev) => ({
      ...prev,
      integrations: { ...prev.integrations, [key]: !prev.integrations[key] },
    }));
  };

  const toggle2FA = () => {
    setSettings((prev) => ({
      ...prev,
      security: { ...prev.security, twoFA: !prev.security.twoFA },
    }));
  };

  // Language change
  const changeLanguage = (lang) =>
    setSettings((s) => ({ ...s, preferences: { ...s.preferences, language: lang } }));

  // Profile save (displayName + email)
  const handleProfileSave = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const displayName = form.get("displayName");
    const email = form.get("email");
    setSettings((s) => ({ ...s, profile: { ...s.profile, displayName, email } }));
    flash("Profile saved");
  };

  // Sidebar button helper
  const sectionBtn = (key, label, Icon) => (
    <button
      onClick={() => setActiveSection(key)}
      style={{
        ...styles.sideBtn,
        ...(activeSection === key ? styles.sideBtnActive : {}),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Icon size={18} />
        <div style={{ textAlign: "left" }}>
          <div style={{ fontWeight: 700 }}>{label}</div>
          <div style={{ fontSize: 12, color: "#617988" }}>
            {key === "profile" && "Edit profile & avatar"}
            {key === "preferences" && "Notifications, language & theme"}
            {key === "security" && "Password, 2FA & login history"}
            {key === "backup" && "Export / import settings"}
            {key === "integrations" && "Third-party toggles"}
            {key === "sysinfo" && "Version & support"}
          </div>
        </div>
      </div>
      <div style={{ opacity: 0.6, fontSize: 12 }}>{activeSection === key ? "Active" : ""}</div>
    </button>
  );



  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <aside style={styles.sidebar}>
          <div style={{ marginBottom: 14 }}>
            <div style={styles.logo}>CollaXion</div>
            <div style={{ color: "#6B8794", fontSize: 13 }}>System Settings</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sectionBtn("profile", "Profile", User)}
            {sectionBtn("preferences", "Preferences", Bell)}
            {sectionBtn("security", "Security", ShieldCheck)}
            {sectionBtn("backup", "Backup & Restore", CloudUpload)}
            {sectionBtn("integrations", "Integrations", Zap)}
            {sectionBtn("sysinfo", "System Info", Database)}
          </div>

          <div style={{ marginTop: "auto", fontSize: 13, color: "#6B8794" }}>
            <div>Logged in as</div>
            <div style={{ fontWeight: 800, marginTop: 6 }}>{HARDCODED_ADMIN.username}</div>
          </div>
        </aside>

        <main style={styles.main}>
          <header style={styles.header}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0D3B66" }}>Settings</div>
              <div style={{ color: "#647D8A", marginTop: 6 }}>Customize application behavior and security</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                style={styles.headerBtn}
                onClick={() => {
                  // quick save all (mock) -> just flash
                  flash("All settings saved");
                }}
              >
                <Save size={14} /> Save all
              </button>
            </div>
          </header>

          <div style={{ marginTop: 18 }}>
            {/* message toast */}
            {message && <div style={styles.toast}>{message}</div>}

            {/* Content area */}
            <motion.div layout>
              {/* PROFILE */}
              {activeSection === "profile" && (
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <User size={22} color="#0D3B66" />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 16 }}>Profile</div>
                        <div style={{ fontSize: 13, color: "#617988" }}>Admin profile & avatar</div>
                      </div>
                    </div>
                    <div style={{ color: "#617988", fontSize: 13 }}>Manage account identity</div>
                  </div>

                  <form onSubmit={handleProfileSave} style={{ display: "flex", gap: 24 }}>
                    <div style={{ flex: 1 }}>
                      <label style={styles.label}>Username</label>
                      <input value={HARDCODED_ADMIN.username} readOnly style={styles.input} />
                      <label style={styles.label}>Display name</label>
                      <input name="displayName" defaultValue={settings.profile.displayName} style={styles.input} />
                      <label style={styles.label}>Email</label>
                      <input name="email" defaultValue={settings.profile.email} style={styles.input} />
                      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                        <button style={styles.primaryBtn} type="submit">Save profile</button>
                        <button
                          type="button"
                          style={styles.ghostBtn}
                          onClick={() => {
                            setSettings(initialSettings);
                            setProfileImagePreview(initialSettings.profile.avatar);
                            flash("Reverted profile");
                          }}
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    <div style={{ width: 260, display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={styles.avatarWrap}>
                          {profileImagePreview ? (
                            <img src={profileImagePreview} alt="avatar" style={styles.avatar} />
                          ) : (
                            <div style={styles.avatarPlaceholder}><User size={36} /></div>
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{settings.profile.displayName}</div>
                          <div style={{ fontSize: 13, color: "#617988" }}>{settings.profile.email}</div>
                        </div>
                      </div>

                      <div>
                        <label style={styles.labelSmall}>Upload profile image</label>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={onProfileImage} style={{ display: "block" }} />
                      </div>

                      <div style={{ marginTop: 6 }}>
                        <label style={styles.labelSmall}>Change password</label>
                        <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <input placeholder="Current password" type="password" value={passwordForm.current} onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))} style={styles.input} />
                          <input placeholder="New password" type="password" value={passwordForm.newPass} onChange={(e) => setPasswordForm((p) => ({ ...p, newPass: e.target.value }))} style={styles.input} />
                          <input placeholder="Confirm new password" type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))} style={styles.input} />
                          <div style={{ display: "flex", gap: 8 }}>
                            <button type="submit" style={styles.primaryBtnSmall}>Change password</button>
                            <button type="button" style={styles.ghostBtnSmall} onClick={() => setPasswordForm({ current: "", newPass: "", confirm: "" })}>Clear</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </form>
                </motion.section>
              )}

              {/* PREFERENCES */}
              {activeSection === "preferences" && (
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <Bell size={22} color="#0D3B66" />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 16 }}>App Preferences</div>
                        <div style={{ fontSize: 13, color: "#617988" }}>Theme, notifications and language</div>
                      </div>
                    </div>
                    <div style={{ color: "#617988", fontSize: 13 }}>Customize user experience</div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 18 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={styles.prefRow}>
                        <div>
                          <div style={{ fontWeight: 700 }}>Dark mode</div>
                          <div style={{ fontSize: 13, color: "#617988" }}>Toggle the UI theme</div>
                        </div>
                        <label style={styles.switch}>
                          <input type="checkbox" checked={settings.preferences.theme === "dark"} onChange={() => updateSettings("preferences.theme", settings.preferences.theme === "dark" ? "light" : "dark")} />
                          <span style={styles.slider}></span>
                        </label>
                      </div>

                      <div style={styles.prefRow}>
                        <div>
                          <div style={{ fontWeight: 700 }}>Notifications</div>
                          <div style={{ fontSize: 13, color: "#617988" }}>Email & system notifications</div>
                        </div>
                        <label style={styles.switch}>
                          <input type="checkbox" checked={settings.preferences.notifications} onChange={() => { togglePref("notifications"); flash("Notifications updated"); }} />
                          <span style={styles.slider}></span>
                        </label>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                        <div>
                          <div style={{ fontWeight: 700 }}>Language</div>
                          <div style={{ fontSize: 13, color: "#617988" }}>UI language</div>
                        </div>
                        <select value={settings.preferences.language} onChange={(e) => changeLanguage(e.target.value)} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #E6F0F8" }}>
                          <option>English</option>
                          <option>Urdu</option>
                          <option>Arabic</option>
                          <option>Chinese</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ padding: 12, background: "#FAFDFF", borderRadius: 10 }}>
                      <div style={{ fontWeight: 800, marginBottom: 8 }}>Preview</div>
                      <div style={{ fontSize: 13, color: "#617988" }}>How the app appearance looks with current preferences</div>
                      <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
                        <div style={{ width: 56, height: 56, borderRadius: 8, background: settings.preferences.theme === "dark" ? "#1F2937" : "#EAF4FB" }} />
                        <div>
                          <div style={{ fontWeight: 700 }}>{settings.profile.displayName}</div>
                          <div style={{ fontSize: 13, color: "#617988" }}>{settings.profile.email}</div>
                        </div>
                      </div>
                      <div style={{ marginTop: 12 }}>
                        <button style={styles.primaryBtnSmall} onClick={() => flash("Preferences saved")}>Save Preferences</button>
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}

              {/* SECURITY */}
              {activeSection === "security" && (
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <ShieldCheck size={22} color="#0D3B66" />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 16 }}>Security</div>
                        <div style={{ fontSize: 13, color: "#617988" }}>Password & two-factor authentication</div>
                      </div>
                    </div>
                    <div style={{ color: "#617988", fontSize: 13 }}>Protect your account</div>
                  </div>

                  <div style={{ display: "flex", gap: 18 }}>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={styles.prefRow}>
                        <div>
                          <div style={{ fontWeight: 700 }}>Two-Factor Authentication (2FA)</div>
                          <div style={{ fontSize: 13, color: "#617988" }}>Add an extra layer of security to login</div>
                        </div>
                        <label style={styles.switch}>
                          <input type="checkbox" checked={settings.security.twoFA} onChange={toggle2FA} />
                          <span style={styles.slider}></span>
                        </label>
                      </div>

                      <div style={{ marginTop: 8 }}>
                        <div style={{ fontWeight: 700, marginBottom: 8 }}>Recent login activity</div>
                        <div style={{ display: "grid", gap: 8 }}>
                          {settings.security.loginHistory.map((h) => (
                            <div key={h.id} style={{ display: "flex", justifyContent: "space-between", background: "#FAFDFF", padding: 10, borderRadius: 8 }}>
                              <div style={{ fontSize: 13 }}>
                                <div style={{ fontWeight: 700 }}>{h.device}</div>
                                <div style={{ color: "#617988", fontSize: 12 }}>{h.ip}</div>
                              </div>
                              <div style={{ color: "#617988", fontSize: 12 }}>{h.when}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ width: 320 }}>
                      <div style={{ background: "#FAFDFF", padding: 12, borderRadius: 10 }}>
                        <div style={{ fontWeight: 800 }}>Password Management</div>
                        <div style={{ fontSize: 13, color: "#617988", marginTop: 8 }}>Change your password (admin)</div>
                        <div style={{ marginTop: 10 }}>
                          <div style={{ fontSize: 13, color: "#334155", marginBottom: 8 }}>Current Admin Password: <strong style={{ marginLeft: 6 }}>{adminPassword ? "******" : "not set"}</strong></div>
                          <button style={styles.ghostBtn} onClick={() => { navigator.clipboard?.writeText(adminPassword); flash("Password copied"); }}>Copy Password</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}

              {/* BACKUP */}
              {activeSection === "backup" && (
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <CloudUpload size={22} color="#0D3B66" />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 16 }}>Backup & Restore</div>
                        <div style={{ fontSize: 13, color: "#617988" }}>Export and import settings</div>
                      </div>
                    </div>
                    <div style={{ color: "#617988", fontSize: 13 }}>Create or restore backups</div>
                  </div>

                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <button style={styles.primaryBtn} onClick={handleExport}><Save size={14} /> Export settings</button>
                    <label style={styles.uploadLabel}>
                      <input type="file" accept="application/json" onChange={handleImport} style={{ display: "none" }} />
                      <CloudUpload size={14} /> Import settings
                    </label>
                    <div style={{ color: "#617988", fontSize: 13 }}>Current settings snapshot will be exported.</div>
                  </div>
                </motion.section>
              )}

              {/* INTEGRATIONS */}
              {activeSection === "integrations" && (
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <Zap size={22} color="#0D3B66" />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 16 }}>Integrations</div>
                        <div style={{ fontSize: 13, color: "#617988" }}>Third party tools</div>
                      </div>
                    </div>
                    <div style={{ color: "#617988", fontSize: 13 }}>Enable or disable integrations</div>
                  </div>

                  <div style={{ display: "grid", gap: 12 }}>
                    <div style={styles.prefRow}>
                      <div>
                        <div style={{ fontWeight: 700 }}>Slack</div>
                        <div style={{ fontSize: 13, color: "#617988" }}>Send notifications to Slack channels</div>
                      </div>
                      <label style={styles.switch}>
                        <input type="checkbox" checked={settings.integrations.slack} onChange={() => toggleIntegration("slack")} />
                        <span style={styles.slider}></span>
                      </label>
                    </div>

                    <div style={styles.prefRow}>
                      <div>
                        <div style={{ fontWeight: 700 }}>GitHub</div>
                        <div style={{ fontSize: 13, color: "#617988" }}>Enable repo integrations</div>
                      </div>
                      <label style={styles.switch}>
                        <input type="checkbox" checked={settings.integrations.github} onChange={() => toggleIntegration("github")} />
                        <span style={styles.slider}></span>
                      </label>
                    </div>

                    <div style={styles.prefRow}>
                      <div>
                        <div style={{ fontWeight: 700 }}>Google Drive</div>
                        <div style={{ fontSize: 13, color: "#617988" }}>Backup to Google Drive (mock)</div>
                      </div>
                      <label style={styles.switch}>
                        <input type="checkbox" checked={settings.integrations.googleDrive} onChange={() => toggleIntegration("googleDrive")} />
                        <span style={styles.slider}></span>
                      </label>
                    </div>
                  </div>
                </motion.section>
              )}

              {/* SYSTEM INFO */}
              {activeSection === "sysinfo" && (
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <Database size={22} color="#0D3B66" />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 16 }}>System Info</div>
                        <div style={{ fontSize: 13, color: "#617988" }}>Version and support info</div>
                      </div>
                    </div>
                    <div style={{ color: "#617988", fontSize: 13 }}>Application metadata</div>
                  </div>

                  <div style={{ display: "grid", gap: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>App Version</div>
                        <div style={{ fontSize: 13, color: "#617988" }}>1.4.2</div>
                      </div>
                      <div style={{ fontSize: 13, color: "#617988" }}>Build 2025-10-30</div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>Developer</div>
                        <div style={{ fontSize: 13, color: "#617988" }}>CollaXion Team</div>
                      </div>
                      <div style={{ fontSize: 13, color: "#617988" }}>support@collaxion.app</div>
                    </div>

                    <div style={{ marginTop: 8 }}>
                      <button style={styles.primaryBtn} onClick={() => flash("System info copied")}>Copy system info</button>
                    </div>
                  </div>
                </motion.section>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SystemSettings;

/* ===== Inline styles ===== */
const styles = {
  page: {
    fontFamily: "'Poppins', sans-serif",
    background: "#F7FBFD",
    minHeight: "100vh",
    padding: 28,
    color: "#0B2B3A",
  },
  container: {
  display: "flex",
  gap: 24,
  width: "100%",
  height: "100%",
  margin: 0,
},

  sidebar: {
    width: 320,
    background: "#FFFFFF",
    borderRadius: 12,
    padding: 18,
    boxShadow: "0 8px 30px rgba(11,59,102,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  logo: { fontWeight: 900, fontSize: 20, color: "#0D3B66" },
  sideBtn: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 12px",
    borderRadius: 10,
    cursor: "pointer",
    background: "transparent",
    border: "none",
    boxShadow: "none",
    transition: "all .18s",
    color: "#113A56",
  },
  sideBtnActive: {
    background: "linear-gradient(180deg,#193648,#0E2B3A)",
    color: "#fff",
    boxShadow: "0 8px 18px rgba(25,54,72,0.12)",
  },
  main: { flex: 1 },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerBtn: {
    background: "#0D3B66",
    color: "#fff",
    borderRadius: 10,
    padding: "8px 12px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontWeight: 800,
  },
  toast: {
    background: "#0D3B66",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: 8,
    display: "inline-block",
    marginBottom: 12,
    fontWeight: 700,
  },

  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 18,
    boxShadow: "0 10px 30px rgba(11,59,102,0.06)",
    marginBottom: 18,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  label: { fontSize: 13, color: "#3E5F6E", fontWeight: 700, marginTop: 8, marginBottom: 6 },
  labelSmall: { fontSize: 12, color: "#617988", marginBottom: 6 },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #E6F0F8",
    outline: "none",
  },
  avatarWrap: {
    width: 86,
    height: 86,
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid #E6F0F8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#FAFDFF",
  },
  avatarPlaceholder: { width: 86, height: 86, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12, background: "#EDF7FA", color: "#0D3B66" },
  avatar: { width: "100%", height: "100%", objectFit: "cover" },

  primaryBtn: {
    background: "#00A3A3",
    color: "#fff",
    borderRadius: 10,
    padding: "10px 14px",
    border: "none",
    cursor: "pointer",
    fontWeight: 800,
  },
  primaryBtnSmall: {
    background: "#0D3B66",
    color: "#fff",
    borderRadius: 8,
    padding: "8px 10px",
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
  },
  ghostBtn: {
    background: "transparent",
    color: "#0D3B66",
    borderRadius: 8,
    padding: "8px 10px",
    border: "1px solid #E6F0F8",
    cursor: "pointer",
  },

  ghostBtnSmall: {
    background: "transparent",
    color: "#334155",
    borderRadius: 8,
    padding: "8px 10px",
    border: "1px solid #E6F0F8",
    cursor: "pointer",
  },

  prefRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, background: "#FAFDFF", borderRadius: 8 },

  switch: { position: "relative", display: "inline-block", width: 46, height: 26 },
  slider: {
    position: "absolute",
    cursor: "pointer",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "#E6EEF2",
    borderRadius: 26,
    transition: ".2s",
  },

  uploadLabel: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 8,
    cursor: "pointer",
    background: "#F5FBFB",
    border: "1px dashed #D4E9E9",
    color: "#0B5F6A",
    fontWeight: 700,
  },
  previewImg: { width: 140, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #E6F0F8" },
  noPreview: { color: "#6B7C8A", fontSize: 13 },

  modal: {
    width: 760,
    maxWidth: "94%",
    background: "#fff",
    borderRadius: 14,
    padding: 20,
    boxShadow: "0 18px 50px rgba(11,59,102,0.26)",
  },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  formRow: { display: "flex", gap: 12 },
};
