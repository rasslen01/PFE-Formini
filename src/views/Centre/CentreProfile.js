// ═══════════════════════════════════════════════
// 📁 src/views/centre/CentreProfile.js
// ═══════════════════════════════════════════════

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const BACKEND_URL = "http://localhost:5000";

export default function CentreProfile() {
  const history = useHistory();
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState({ formationsCount: 0, totalStudents: 0, rating: 0 });

  const logoInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    latitude: "",
    longitude: "",
    website: "",
    description: "",
    foundedYear: "",
    logo: "",
    coverImage: "",
    openingHours: {
      monday: { open: "09:00", close: "17:00", closed: false },
      tuesday: { open: "09:00", close: "17:00", closed: false },
      wednesday: { open: "09:00", close: "17:00", closed: false },
      thursday: { open: "09:00", close: "17:00", closed: false },
      friday: { open: "09:00", close: "17:00", closed: false },
      saturday: { open: "09:00", close: "13:00", closed: false },
      sunday: { open: "09:00", close: "13:00", closed: true }
    },
    socialMedia: {
      facebook: "",
      linkedin: "",
      instagram: "",
      twitter: ""
    }
  });

  const [originalProfile, setOriginalProfile] = useState({});
  const [previewLogo, setPreviewLogo] = useState("");
  const [previewCover, setPreviewCover] = useState("");

  const tunisianCities = [
    "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan",
    "Bizerte", "Béja", "Jendouba", "Le Kef", "Siliana", "Sousse",
    "Monastir", "Mahdia", "Sfax", "Kairouan", "Kasserine", "Sidi Bouzid",
    "Gabès", "Médenine", "Tataouine", "Gafsa", "Tozeur", "Kébili"
  ];

  useEffect(() => {
    fetchCentreProfile();
  }, []);

  const fetchCentreProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) { history.push("/auth/login"); return; }

      const response = await axios.get(`${BACKEND_URL}/centres/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const centreData = response.data.centre;

      const mapped = {
        name: centreData.name || "",
        email: centreData.email || "",
        phone: centreData.phone || "",
        address: centreData.address || "",
        city: centreData.city || "",
        zipCode: centreData.zipCode || "",
        latitude: centreData.latitude || "",
        longitude: centreData.longitude || "",
        website: centreData.website || "",
        description: centreData.description || "",
        foundedYear: centreData.foundedYear || "",
        // ✅ Fix: construire l'URL correctement
        logo: centreData.logo && centreData.logo !== "default-centre.png"
          ? `${BACKEND_URL}/uploads/centres/${centreData.logo}`
          : "",
        coverImage: centreData.coverImage
          ? `${BACKEND_URL}/uploads/centres/${centreData.coverImage}`
          : "",
        openingHours: centreData.openingHours || profile.openingHours,
        socialMedia: centreData.socialMedia || profile.socialMedia
      };

      setProfile(mapped);
      setOriginalProfile(mapped);
      setPreviewLogo(mapped.logo);
      setPreviewCover(mapped.coverImage);
      await fetchCentreFormations(token);
    } catch (err) {
      if (err.response?.status === 401) { localStorage.removeItem("token"); history.push("/auth/login"); }
      else setError(err.response?.data?.error || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const fetchCentreFormations = async (token) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/centres/me/formations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats({
        formationsCount: response.data.count || 0,
        totalStudents: response.data.totalStudents || 0,
        rating: response.data.rating || 4.5
      });
    } catch (err) { console.error("Erreur stats:", err); }
  };

  const handleChange = (field, value) => setProfile({ ...profile, [field]: value });

  const handleNestedChange = (category, field, value) =>
    setProfile({ ...profile, [category]: { ...profile[category], [field]: value } });

  const handleHoursChange = (day, field, value) =>
    setProfile({ ...profile, openingHours: { ...profile.openingHours, [day]: { ...profile.openingHours[day], [field]: value } } });

  // ✅ Fix complet handleImageUpload
  const handleImageUpload = async (file, type) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", type); // 'logo' ou 'coverImage'
    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(`${BACKEND_URL}/centres/me/upload`, formData, {
        headers: { Authorization: `Bearer ${token}` }
        // ✅ Pas de Content-Type manuel — le navigateur gère le boundary
      });

      // ✅ Fix: utiliser filename retourné par le backend
      const imageUrl = `${BACKEND_URL}/uploads/centres/${response.data.filename}`;

      if (type === "logo") {
        setProfile(prev => ({ ...prev, logo: imageUrl }));
        setPreviewLogo(imageUrl);
      } else {
        setProfile(prev => ({ ...prev, coverImage: imageUrl }));
        setPreviewCover(imageUrl);
      }
    } catch (err) {
      setError("Erreur lors de l'upload de l'image");
      setTimeout(() => setError(""), 3000);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      // ✅ Envoyer seulement le filename, pas l'URL complète
      const saveData = {
        ...profile,
        logo: profile.logo.replace(`${BACKEND_URL}/uploads/centres/`, ""),
        coverImage: profile.coverImage.replace(`${BACKEND_URL}/uploads/centres/`, "")
      };
      await axios.put(`${BACKEND_URL}/centres/me`, saveData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOriginalProfile({ ...profile });
      setIsEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfile({ ...originalProfile });
    setPreviewLogo(originalProfile.logo);
    setPreviewCover(originalProfile.coverImage);
    setIsEditing(false);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setProfile({ ...profile, latitude: position.coords.latitude.toString(), longitude: position.coords.longitude.toString() }),
        () => setError("Impossible d'obtenir votre position")
      );
    } else setError("Géolocalisation non supportée");
  };

  const dayLabels = { monday: "Lundi", tuesday: "Mardi", wednesday: "Mercredi", thursday: "Jeudi", friday: "Vendredi", saturday: "Samedi", sunday: "Dimanche" };

  if (loading && !profile.name) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.spinnerRing}></div>
        <p style={styles.loadingText}>Chargement du profil…</p>
        <style>{spinnerCSS}</style>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <style>{globalCSS}</style>

      {/* Toast notifications */}
      {saved && (
        <div style={styles.toastSuccess} className="cp-toast">
          <span style={styles.toastIcon}>✓</span>
          Profil mis à jour avec succès
        </div>
      )}
      {error && (
        <div style={styles.toastError} className="cp-toast">
          <span>⚠ {error}</span>
          <button onClick={() => setError("")} style={styles.toastClose}>✕</button>
        </div>
      )}

      {/* ── COVER ── */}
      <div style={styles.coverWrap} className="cp-cover-wrap">
        {previewCover
          ? <img src={previewCover} alt="Cover" style={styles.coverImg} />
          : <div style={styles.coverPlaceholder}>
              <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
        }
        <div style={styles.coverOverlay} />
        {isEditing && (
          <button onClick={() => coverInputRef.current?.click()} style={styles.coverEditBtn} className="cp-cover-btn" disabled={uploading}>
            <CameraIcon />
            {uploading ? "Chargement…" : "Modifier la couverture"}
          </button>
        )}
        {/* ✅ Fix: "coverImage" au lieu de "cover" */}
        <input ref={coverInputRef} type="file" accept="image/*" style={{ display: "none" }}
          onChange={(e) => handleImageUpload(e.target.files[0], "coverImage")} />
      </div>

      {/* ── HERO ROW ── */}
      <div style={styles.heroRow}>
        {/* Logo */}
        <div style={styles.logoWrap}>
          <div style={styles.logoBorder}>
            {previewLogo
              ? <img src={previewLogo} alt="Logo" style={styles.logoImg} />
              : <div style={styles.logoPlaceholder}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5">
                    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
                  </svg>
                </div>
            }
          </div>
          {isEditing && (
            <button onClick={() => logoInputRef.current?.click()} style={styles.logoEditBtn} className="cp-icon-btn">
              <CameraIcon size={14} />
            </button>
          )}
          {/* ✅ "logo" correct */}
          <input ref={logoInputRef} type="file" accept="image/*" style={{ display: "none" }}
            onChange={(e) => handleImageUpload(e.target.files[0], "logo")} />
        </div>

        {/* Title + Stats */}
        <div style={styles.heroMeta}>
          <h1 style={styles.centreName}>{profile.name || "Nom du centre"}</h1>
          {profile.city && <p style={styles.centreCity}><PinIcon /> {profile.city}</p>}
          <div style={styles.statsRow}>
            <StatBadge icon={<StarIcon />} value={stats.rating} label="Note" color="#f59e0b" />
            <StatBadge icon={<BookIcon />} value={stats.formationsCount} label="Formations" color="#6366f1" />
            <StatBadge icon={<UsersIcon />} value={stats.totalStudents} label="Étudiants" color="#10b981" />
          </div>
        </div>

        {/* Action buttons */}
        <div style={styles.actionRow}>
          {isEditing ? (
            <>
              <button onClick={handleCancel} style={styles.btnCancel} className="cp-btn">
                Annuler
              </button>
              <button onClick={handleSave} disabled={loading} style={styles.btnSave} className="cp-btn cp-btn-save">
                {loading ? "Sauvegarde…" : "💾 Sauvegarder"}
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} style={styles.btnEdit} className="cp-btn cp-btn-edit">
              ✏ Modifier le profil
            </button>
          )}
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div style={styles.mainGrid}>

        {/* ─── LEFT COLUMN ─── */}
        <div style={styles.leftCol}>

          {/* Contact */}
          <Card title="Coordonnées" icon={<EnvelopeIcon />} accent="#6366f1">
            <InfoRow icon={<EnvelopeIcon size={15} />} label="Email" value={profile.email} />
            <InfoRow icon={<PhoneIcon />} label="Téléphone"
              value={isEditing
                ? <FieldInput type="tel" value={profile.phone} onChange={v => handleChange("phone", v)} placeholder="+216 XX XXX XXX" />
                : profile.phone || "Non renseigné"
              }
            />
            <InfoRow icon={<GlobeIcon />} label="Site web"
              value={isEditing
                ? <FieldInput type="url" value={profile.website} onChange={v => handleChange("website", v)} placeholder="https://" />
                : profile.website
                  ? <a href={profile.website} target="_blank" rel="noopener noreferrer" style={styles.link}>{profile.website}</a>
                  : "Non renseigné"
              }
            />
          </Card>

          {/* Location */}
          <Card title="Localisation" icon={<PinIcon />} accent="#ef4444">
            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>Ville</label>
              {isEditing
                ? <select value={profile.city} onChange={e => handleChange("city", e.target.value)} style={styles.select} className="cp-select">
                    <option value="">Sélectionnez une ville</option>
                    {tunisianCities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                : <p style={styles.fieldValue}>{profile.city || "Non renseigné"}</p>
              }
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>Adresse</label>
              {isEditing
                ? <textarea value={profile.address} onChange={e => handleChange("address", e.target.value)} rows={2} style={styles.textarea} className="cp-input" placeholder="Adresse complète" />
                : <p style={styles.fieldValue}>{profile.address || "Non renseigné"}</p>
              }
            </div>
            {isEditing && (
              <button onClick={getCurrentLocation} style={styles.geoBtn} className="cp-geo-btn">
                <PinIcon size={14} /> Utiliser ma position actuelle
              </button>
            )}
            {(profile.latitude || profile.longitude) && (
              <p style={styles.gpsNote}><span style={{ opacity: 0.5 }}>◎</span> Coordonnées GPS disponibles</p>
            )}
          </Card>

          {/* Social */}
          <Card title="Réseaux sociaux" icon={<ShareIcon />} accent="#3b82f6">
            {[
              { key: "facebook", label: "Facebook", icon: "f", color: "#1877f2" },
              { key: "linkedin", label: "LinkedIn", icon: "in", color: "#0077b5" },
              { key: "instagram", label: "Instagram", icon: "◈", color: "#e1306c" },
            ].map(({ key, label, icon, color }) => (
              <div key={key} style={styles.socialRow}>
                <span style={{ ...styles.socialBadge, background: color + "18", color }}>{icon}</span>
                {isEditing
                  ? <FieldInput type="url" value={profile.socialMedia[key]} onChange={v => handleNestedChange("socialMedia", key, v)} placeholder={`URL ${label}`} />
                  : profile.socialMedia[key]
                    ? <a href={profile.socialMedia[key]} target="_blank" rel="noopener noreferrer" style={styles.link}>{label}</a>
                    : <span style={styles.empty}>Non renseigné</span>
                }
              </div>
            ))}
          </Card>
        </div>

        {/* ─── RIGHT COLUMN ─── */}
        <div style={styles.rightCol}>

          {/* About */}
          <Card title="À propos du centre" icon={<InfoIcon />} accent="#10b981">
            {isEditing
              ? <textarea value={profile.description} onChange={e => handleChange("description", e.target.value)}
                  rows={6} style={styles.textarea} className="cp-input"
                  placeholder="Présentez votre centre, vos valeurs, votre équipe…" />
              : <p style={styles.descText}>{profile.description || "Aucune description pour le moment."}</p>
            }
            <div style={styles.divider} />
            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>Année de création</label>
              {isEditing
                ? <FieldInput value={profile.foundedYear} onChange={v => handleChange("foundedYear", v)} placeholder="Ex: 2018" />
                : <p style={styles.foundedValue}>{profile.foundedYear || "Non renseigné"}</p>
              }
            </div>
          </Card>

          {/* Opening Hours */}
          <Card title="Horaires d'ouverture" icon={<ClockIcon />} accent="#f59e0b">
            <div style={styles.hoursTable}>
              {Object.entries(profile.openingHours).map(([day, hours], idx) => (
                <div key={day} style={{ ...styles.hoursRow, background: idx % 2 === 0 ? "rgba(99,102,241,0.03)" : "transparent" }}>
                  <span style={styles.dayLabel}>{dayLabels[day]}</span>
                  {isEditing ? (
                    <div style={styles.hoursEditing}>
                      <label style={styles.checkLabel}>
                        <input type="checkbox" checked={hours.closed} onChange={e => handleHoursChange(day, "closed", e.target.checked)} style={styles.checkbox} />
                        <span style={{ color: hours.closed ? "#ef4444" : "#94a3b8", fontSize: 12 }}>Fermé</span>
                      </label>
                      {!hours.closed && (
                        <div style={styles.timePickers}>
                          <input type="time" value={hours.open} onChange={e => handleHoursChange(day, "open", e.target.value)} style={styles.timePicker} className="cp-input" />
                          <span style={styles.timeSep}>–</span>
                          <input type="time" value={hours.close} onChange={e => handleHoursChange(day, "close", e.target.value)} style={styles.timePicker} className="cp-input" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <span style={hours.closed ? styles.hoursClosed : styles.hoursOpen}>
                      {hours.closed ? "Fermé" : `${hours.open} – ${hours.close}`}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function Card({ title, icon, accent, children }) {
  return (
    <div style={styles.card} className="cp-card">
      <div style={{ ...styles.cardHeader, borderLeftColor: accent }}>
        <span style={{ color: accent }}>{icon}</span>
        <h3 style={styles.cardTitle}>{title}</h3>
      </div>
      <div style={styles.cardBody}>{children}</div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div style={styles.infoRow}>
      <span style={styles.infoIcon}>{icon}</span>
      <div style={{ flex: 1 }}>
        <p style={styles.infoLabel}>{label}</p>
        <div style={styles.infoValue}>{value}</div>
      </div>
    </div>
  );
}

function StatBadge({ icon, value, label, color }) {
  return (
    <div style={{ ...styles.statBadge, borderColor: color + "30", background: color + "0a" }}>
      <span style={{ color }}>{icon}</span>
      <span style={{ ...styles.statValue, color }}>{value}</span>
      <span style={styles.statLabel}>{label}</span>
    </div>
  );
}

function FieldInput({ type = "text", value, onChange, placeholder }) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} style={styles.input} className="cp-input" />
  );
}

/* ── SVG Icons ── */
const CameraIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);
const EnvelopeIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);
const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.64A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.09-1.09a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7a2 2 0 011.72 2.03z"/>
  </svg>
);
const GlobeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
  </svg>
);
const PinIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);
const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const BookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
  </svg>
);
const UsersIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);

/* ── Styles ── */
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8faff 0%, #f0f4ff 50%, #faf8ff 100%)",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    paddingBottom: 64,
  },
  loadingWrap: {
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    height: "100vh", gap: 20, background: "#f8faff",
  },
  spinnerRing: {
    width: 52, height: 52, borderRadius: "50%",
    border: "3px solid #e0e7ff",
    borderTopColor: "#6366f1",
    animation: "cp-spin 0.9s linear infinite",
  },
  loadingText: { color: "#64748b", fontSize: 15, fontWeight: 500, letterSpacing: "0.01em" },
  toastSuccess: {
    position: "fixed", top: 24, right: 24, zIndex: 9999,
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "#fff", padding: "14px 22px", borderRadius: 14,
    display: "flex", alignItems: "center", gap: 10,
    fontWeight: 600, fontSize: 14, boxShadow: "0 8px 32px rgba(16,185,129,0.35)",
    animation: "cp-slideDown 0.35s cubic-bezier(0.34,1.56,0.64,1)",
  },
  toastError: {
    position: "fixed", top: 24, right: 24, zIndex: 9999,
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "#fff", padding: "14px 22px", borderRadius: 14,
    display: "flex", alignItems: "center", gap: 12,
    fontWeight: 500, fontSize: 14, boxShadow: "0 8px 32px rgba(239,68,68,0.3)",
    animation: "cp-slideDown 0.35s cubic-bezier(0.34,1.56,0.64,1)",
  },
  toastIcon: { fontSize: 18, fontWeight: 700 },
  toastClose: { background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 16, marginLeft: 8, opacity: 0.8 },
  coverWrap: { position: "relative", height: 280, overflow: "hidden", borderRadius: "0 0 32px 32px" },
  coverImg: { width: "100%", height: "100%", objectFit: "cover" },
  coverPlaceholder: {
    width: "100%", height: "100%",
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  coverOverlay: {
    position: "absolute", inset: 0,
    background: "linear-gradient(to top, rgba(15,23,42,0.6) 0%, transparent 60%)",
  },
  coverEditBtn: {
    position: "absolute", bottom: 24, right: 24,
    background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.3)", color: "#fff",
    padding: "10px 20px", borderRadius: 12, cursor: "pointer",
    fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8,
    transition: "all 0.2s",
  },
  heroRow: {
    maxWidth: 1200, margin: "0 auto",
    padding: "0 24px", marginTop: -56,
    display: "flex", alignItems: "flex-end", gap: 24, flexWrap: "wrap",
    position: "relative", zIndex: 10,
  },
  logoWrap: { position: "relative", flexShrink: 0 },
  logoBorder: {
    width: 120, height: 120, borderRadius: 24,
    border: "4px solid #fff",
    boxShadow: "0 8px 32px rgba(99,102,241,0.25), 0 2px 8px rgba(0,0,0,0.1)",
    overflow: "hidden", background: "#fff",
  },
  logoImg: { width: "100%", height: "100%", objectFit: "cover" },
  logoPlaceholder: {
    width: "100%", height: "100%",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  logoEditBtn: {
    position: "absolute", bottom: -6, right: -6,
    width: 32, height: 32, borderRadius: "50%",
    background: "#6366f1", color: "#fff", border: "2px solid #fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", boxShadow: "0 2px 8px rgba(99,102,241,0.4)",
  },
  heroMeta: { flex: 1, paddingBottom: 8 },
  centreName: {
    fontSize: 28, fontWeight: 800, color: "#fff",
    textShadow: "0 2px 12px rgba(0,0,0,0.4)",
    margin: 0, letterSpacing: "-0.5px",
  },
  centreCity: { color: "rgba(255,255,255,0.8)", fontSize: 14, margin: "6px 0 12px", display: "flex", alignItems: "center", gap: 4 },
  statsRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  statBadge: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "6px 14px", borderRadius: 10,
    border: "1px solid", backdropFilter: "blur(8px)",
    background: "rgba(255,255,255,0.9)",
  },
  statValue: { fontSize: 15, fontWeight: 700 },
  statLabel: { fontSize: 12, color: "#64748b", fontWeight: 500 },
  actionRow: { display: "flex", gap: 10, paddingBottom: 8, flexShrink: 0 },
  btnCancel: {
    padding: "10px 22px", borderRadius: 12,
    background: "rgba(255,255,255,0.9)", border: "1.5px solid #e2e8f0",
    color: "#64748b", fontWeight: 600, fontSize: 14, cursor: "pointer",
    backdropFilter: "blur(8px)",
  },
  btnSave: {
    padding: "10px 22px", borderRadius: 12,
    background: "linear-gradient(135deg, #10b981, #059669)",
    border: "none", color: "#fff", fontWeight: 700, fontSize: 14,
    cursor: "pointer", boxShadow: "0 4px 16px rgba(16,185,129,0.4)",
  },
  btnEdit: {
    padding: "10px 22px", borderRadius: 12,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none", color: "#fff", fontWeight: 700, fontSize: 14,
    cursor: "pointer", boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
  },
  mainGrid: {
    maxWidth: 1200, margin: "32px auto 0", padding: "0 24px",
    display: "grid", gridTemplateColumns: "360px 1fr", gap: 24,
  },
  leftCol: { display: "flex", flexDirection: "column", gap: 20 },
  rightCol: { display: "flex", flexDirection: "column", gap: 20 },
  card: {
    background: "#fff", borderRadius: 20,
    boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 24px rgba(99,102,241,0.06)",
    border: "1px solid rgba(226,232,240,0.8)", overflow: "hidden",
  },
  cardHeader: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "18px 24px 14px", borderLeft: "3px solid",
    borderBottom: "1px solid #f1f5f9",
  },
  cardTitle: { margin: 0, fontSize: 15, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.2px" },
  cardBody: { padding: "16px 24px" },
  infoRow: { display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 },
  infoIcon: { color: "#94a3b8", marginTop: 2, flexShrink: 0 },
  infoLabel: { fontSize: 11, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 3px" },
  infoValue: { fontSize: 14, color: "#374151", fontWeight: 500 },
  fieldGroup: { marginBottom: 14 },
  fieldLabel: { display: "block", fontSize: 11, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 },
  fieldValue: { fontSize: 14, color: "#374151", fontWeight: 500, margin: 0 },
  input: {
    width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 10,
    padding: "9px 12px", fontSize: 14, color: "#1e293b",
    outline: "none", background: "#fafafa", boxSizing: "border-box",
    transition: "border-color 0.2s", fontFamily: "inherit",
  },
  textarea: {
    width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 10,
    padding: "10px 12px", fontSize: 14, color: "#1e293b",
    outline: "none", background: "#fafafa", resize: "none",
    boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.2s",
  },
  select: {
    width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 10,
    padding: "9px 12px", fontSize: 14, color: "#1e293b",
    outline: "none", background: "#fafafa", cursor: "pointer",
    boxSizing: "border-box", fontFamily: "inherit",
  },
  geoBtn: {
    width: "100%", background: "#f1f5f9", border: "1.5px dashed #cbd5e1",
    color: "#475569", padding: "10px", borderRadius: 10,
    cursor: "pointer", fontSize: 13, fontWeight: 600,
    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
    transition: "all 0.2s", fontFamily: "inherit",
  },
  gpsNote: { fontSize: 12, color: "#94a3b8", margin: "8px 0 0", display: "flex", gap: 5, alignItems: "center" },
  socialRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 12 },
  socialBadge: {
    width: 34, height: 34, borderRadius: 8,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontWeight: 800, flexShrink: 0,
  },
  descText: { fontSize: 14, color: "#475569", lineHeight: 1.75, margin: 0 },
  divider: { height: 1, background: "#f1f5f9", margin: "16px 0" },
  foundedValue: { fontSize: 20, fontWeight: 800, color: "#6366f1", margin: 0 },
  hoursTable: { display: "flex", flexDirection: "column" },
  hoursRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "10px 12px", borderRadius: 10, gap: 12,
  },
  dayLabel: { fontSize: 13, fontWeight: 600, color: "#374151", width: 90, flexShrink: 0 },
  hoursOpen: { fontSize: 13, color: "#6366f1", fontWeight: 600, fontVariantNumeric: "tabular-nums" },
  hoursClosed: { fontSize: 12, color: "#fff", fontWeight: 700, background: "#ef4444", padding: "2px 10px", borderRadius: 6 },
  hoursEditing: { display: "flex", alignItems: "center", gap: 12, flex: 1, justifyContent: "flex-end" },
  checkLabel: { display: "flex", alignItems: "center", gap: 6, cursor: "pointer" },
  checkbox: { accentColor: "#6366f1", width: 14, height: 14, cursor: "pointer" },
  timePickers: { display: "flex", alignItems: "center", gap: 6 },
  timePicker: {
    border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "5px 8px",
    fontSize: 13, color: "#1e293b", outline: "none", background: "#fafafa", fontFamily: "inherit",
  },
  timeSep: { color: "#94a3b8", fontWeight: 700 },
  link: { color: "#6366f1", textDecoration: "none", fontSize: 14, fontWeight: 500 },
  empty: { color: "#cbd5e1", fontSize: 14 },
};

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
  @keyframes cp-spin { to { transform: rotate(360deg); } }
  @keyframes cp-slideDown {
    from { opacity: 0; transform: translateY(-16px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .cp-input:focus, .cp-select:focus {
    border-color: #6366f1 !important;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important;
    background: #fff !important;
  }
  .cp-btn { transition: all 0.18s ease !important; }
  .cp-btn:hover { transform: translateY(-1px); filter: brightness(1.05); }
  .cp-btn:active { transform: translateY(0); }
  .cp-btn-save:hover { box-shadow: 0 8px 24px rgba(16,185,129,0.45) !important; }
  .cp-btn-edit:hover { box-shadow: 0 8px 24px rgba(99,102,241,0.45) !important; }
  .cp-card { transition: box-shadow 0.2s; }
  .cp-card:hover { box-shadow: 0 4px 32px rgba(99,102,241,0.1) !important; }
  .cp-cover-btn:hover { background: rgba(255,255,255,0.25) !important; transform: translateY(-1px); }
  .cp-icon-btn:hover { transform: scale(1.1); }
  .cp-geo-btn:hover { background: #e8f0fe !important; border-color: #6366f1 !important; color: #6366f1 !important; }
  @media (max-width: 900px) {
    .cp-main-grid { grid-template-columns: 1fr !important; }
  }
`;

const spinnerCSS = `
  @keyframes cp-spin { to { transform: rotate(360deg); } }
`;