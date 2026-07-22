// src/components/Cards/RecommendationCard.js
// Version améliorée — design épuré, accessible, sans dépendances externes

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";

// ─────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────
const BACKEND_URL = "http://localhost:5000";

const DOMAIN_IMAGES = {
  "développement web":    "https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&q=80",
  "data science":         "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
  "intelligence artificielle": "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
  "cybersécurité":        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80",
  "design ux/ui":         "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
  "marketing digital":    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
  "cloud computing":      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80",
  "mobile development":   "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80",
};

function buildImageUrl(path) {
  if (!path || path === "default-formation.png") return null;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${BACKEND_URL}${path}`;
}

function getDomainImage(domain) {
  const key = (domain || "").toLowerCase();
  for (const [k, url] of Object.entries(DOMAIN_IMAGES)) {
    if (key.includes(k.split(" ")[0])) return url;
  }
  return "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80";
}

// ─────────────────────────────────────────────────────────────
// SCORE CONFIG
// ─────────────────────────────────────────────────────────────
function getScoreConfig(score) {
  if (score >= 85) return {
    color: "#1D9E75",
    chipBg: "#EAF3DE",
    chipColor: "#3B6D11",
    chipBorder: "#C0DD97",
    label: "Excellent match",
    icon: "fas fa-star",
  };
  if (score >= 70) return {
    color: "#185FA5",
    chipBg: "#E6F1FB",
    chipColor: "#185FA5",
    chipBorder: "#B5D4F4",
    label: "Très bonne correspondance",
    icon: "fas fa-thumbs-up",
  };
  if (score >= 55) return {
    color: "#BA7517",
    chipBg: "#FAEEDA",
    chipColor: "#854F0B",
    chipBorder: "#FAC775",
    label: "Correspondance correcte",
    icon: "fas fa-chart-line",
  };
  return {
    color: "#5F5E5A",
    chipBg: "#F1EFE8",
    chipColor: "#444441",
    chipBorder: "#D3D1C7",
    label: "À considérer",
    icon: "fas fa-info-circle",
  };
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT: ScoreCircle
// ─────────────────────────────────────────────────────────────
function ScoreCircle({ score }) {
  const [animated, setAnimated] = useState(false);
  const validScore = Math.min(100, Math.max(0, typeof score === "number" ? score : 75));
  const { color, label } = getScoreConfig(validScore);

  const SIZE = 56;
  const R = 22;
  const CIRC = 2 * Math.PI * R;
  const offset = CIRC - (validScore / 100) * CIRC;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, flexShrink: 0 }}
      title={`Score IA : ${validScore}% — ${label}`}
    >
      <div style={{ position: "relative", width: SIZE, height: SIZE }}>
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ transform: "rotate(-90deg)" }}
          aria-hidden="true"
        >
          <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="#E2E8F0" strokeWidth="4" />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${CIRC} ${CIRC}`}
            strokeDashoffset={animated ? offset : CIRC}
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)" }}
          />
        </svg>
        <span
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 600,
            color,
          }}
        >
          {validScore}
        </span>
      </div>
      <span style={{ fontSize: 10, fontWeight: 600, color: "#888780", letterSpacing: "0.06em", textTransform: "uppercase" }}>
        Match
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT: PriceBadge
// ─────────────────────────────────────────────────────────────
function PriceBadge({ price }) {
  const isFree = price === 0 || price === "0" || price === null || price === undefined;
  const isPromo = !isFree && Number(price) > 0 && Number(price) < 100;

  const styles = isFree
    ? { bg: "#1D9E75", icon: "fas fa-gift", label: "Gratuit" }
    : isPromo
    ? { bg: "#BA7517", icon: "fas fa-tag", label: `${price} DT` }
    : { bg: "#2C2C2A", icon: "fas fa-tag", label: `${price} DT` };

  return (
    <span
      style={{
        background: styles.bg,
        color: "#fff",
        borderRadius: 20,
        padding: "3px 10px",
        fontSize: 11,
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
      }}
    >
      <i className={styles.icon} aria-hidden="true" />
      {styles.label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT: LevelBadge
// ─────────────────────────────────────────────────────────────
function LevelBadge({ level }) {
  const dotColor =
    level === "Débutant" ? "#1D9E75"
    : level === "Intermédiaire" ? "#EF9F27"
    : "#E24B4A";

  return (
    <span
      style={{
        background: "rgba(255,255,255,0.93)",
        borderRadius: 20,
        padding: "3px 10px",
        fontSize: 11,
        fontWeight: 600,
        color: "#2C2C2A",
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: dotColor, flexShrink: 0 }} />
      {level}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT: MatchChip
// ─────────────────────────────────────────────────────────────
function MatchChip({ score }) {
  const { chipBg, chipColor, chipBorder, label, icon } = getScoreConfig(score);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: chipBg,
        color: chipColor,
        border: `1px solid ${chipBorder}`,
        borderRadius: 20,
        padding: "4px 11px",
        fontSize: 12,
        fontWeight: 600,
        marginBottom: 12,
      }}
    >
      <i className={icon} style={{ fontSize: 11 }} aria-hidden="true" />
      {label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT: AIInsight
// ─────────────────────────────────────────────────────────────
function AIInsight({ explanation, score }) {
  const [expanded, setExpanded] = useState(false);
  if (!explanation) return null;

  const isLong = explanation.length > 90;
  const displayed = !expanded && isLong ? explanation.slice(0, 90) + "…" : explanation;

  return (
    <div
      style={{
        background: "#F8FAFC",
        border: "0.5px solid #E2E8F0",
        borderRadius: 10,
        padding: "10px 12px",
        marginBottom: 12,
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "#E6F1FB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <i className="fas fa-robot" style={{ fontSize: 12, color: "#185FA5" }} aria-hidden="true" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#185FA5", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.04em" }}>
          Analyse IA
        </div>
        <p style={{ fontSize: 12, color: "#444441", lineHeight: 1.6, margin: 0 }}>
          {displayed}
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                marginLeft: 4,
                background: "none",
                border: "none",
                color: "#185FA5",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                padding: 0,
              }}
            >
              {expanded ? "Voir moins" : "Lire la suite"}
            </button>
          )}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT: CriteriaBars
// ─────────────────────────────────────────────────────────────
function CriteriaBar({ label, icon, percentage }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ marginBottom: 7 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#5F5E5A", marginBottom: 3 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <i className={icon} style={{ fontSize: 11 }} aria-hidden="true" />
          {label}
        </span>
        <span style={{ fontWeight: 600, color: "#2C2C2A" }}>{percentage}%</span>
      </div>
      <div style={{ height: 4, background: "#E2E8F0", borderRadius: 2, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: visible ? `${percentage}%` : 0,
            background: "#378ADD",
            borderRadius: 2,
            transition: "width 1s cubic-bezier(.4,0,.2,1)",
          }}
        />
      </div>
    </div>
  );
}

function MatchDetails({ formation, prefs }) {
  const criteria = useMemo(() => {
    const list = [];
    if (formation.domain && prefs?.domaine) {
      const match = formation.domain.toLowerCase().includes(prefs.domaine.toLowerCase());
      list.push({ label: "Domaine", icon: "fas fa-laptop-code", percentage: match ? 95 : 60 });
    }
    if (formation.price !== undefined && prefs?.budget !== undefined) {
      const pct = formation.price === 0 ? 100 : formation.price <= 300 ? 85 : 50;
      list.push({ label: "Budget", icon: "fas fa-coins", percentage: pct });
    }
    if (formation.level && prefs?.niveauExperience) {
      const match = formation.level.toLowerCase() === prefs.niveauExperience.toLowerCase();
      list.push({ label: "Niveau", icon: "fas fa-signal", percentage: match ? 90 : 65 });
    }
    return list.slice(0, 3);
  }, [formation, prefs]);

  if (criteria.length === 0) return null;

  return (
    <div
      style={{
        background: "#F8FAFC",
        border: "0.5px solid #E2E8F0",
        borderRadius: 10,
        padding: "10px 12px",
        marginBottom: 12,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: "#5F5E5A", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>
        Correspondance
      </div>
      {criteria.map((c, i) => <CriteriaBar key={i} {...c} />)}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT: SkillsCloud
// ─────────────────────────────────────────────────────────────
function SkillsCloud({ skills, maxDisplay = 4 }) {
  const [expanded, setExpanded] = useState(false);
  if (!skills || skills.length === 0) return null;

  const shown = expanded ? skills : skills.slice(0, maxDisplay);
  const extra = skills.length - maxDisplay;

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#888780", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
        Compétences
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {shown.map((skill, i) => (
          <span
            key={i}
            style={{
              fontSize: 11,
              padding: "3px 10px",
              background: "#F1EFE8",
              border: "0.5px solid #D3D1C7",
              borderRadius: 20,
              color: "#444441",
              fontWeight: 500,
            }}
          >
            {skill}
          </span>
        ))}
        {!expanded && extra > 0 && (
          <button
            onClick={() => setExpanded(true)}
            style={{
              fontSize: 11,
              padding: "3px 10px",
              background: "#E6F1FB",
              border: "0.5px solid #B5D4F4",
              borderRadius: 20,
              color: "#185FA5",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            +{extra}
          </button>
        )}
        {expanded && extra > 0 && (
          <button
            onClick={() => setExpanded(false)}
            style={{
              fontSize: 11,
              padding: "3px 10px",
              background: "#F1EFE8",
              border: "0.5px solid #D3D1C7",
              borderRadius: 20,
              color: "#5F5E5A",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Voir moins
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL: RecommendationCard
// ─────────────────────────────────────────────────────────────
export default function RecommendationCard({
  formation,
  onRegister,
  isRegistering,
  userPreferences,
  index = 0,
  isTopPick = false,
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  const score = formation.scoreIA || formation.score || 75;
  const validScore = Math.min(100, Math.max(0, score));
  const image = (!imgError && buildImageUrl(formation.image)) || getDomainImage(formation.domain);
  const explanation = formation.explicationIA || formation.explanation || formation.raisonIA;

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), index * 80);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
        position: "relative",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* TOP PICK BANNER */}
      {isTopPick && (
        <div
          style={{
            background: "#FAEEDA",
            color: "#854F0B",
            border: "1px solid #FAC775",
            borderBottom: "none",
            borderRadius: "12px 12px 0 0",
            padding: "5px 14px",
            fontSize: 11,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <i className="fas fa-trophy" aria-hidden="true" />
          Top pick
        </div>
      )}

      {/* CARD */}
      <div
        style={{
          background: "#fff",
          borderRadius: isTopPick ? "0 0 12px 12px" : 12,
          border: isTopPick ? "1px solid #FAC775" : "0.5px solid #E2E8F0",
          borderTop: isTopPick ? "none" : undefined,
          overflow: "hidden",
          transition: "box-shadow 0.25s ease, transform 0.25s ease, border-color 0.25s ease",
          boxShadow: hovered ? "0 8px 28px rgba(0,0,0,0.09)" : "0 1px 4px rgba(0,0,0,0.04)",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          position: "relative",
        }}
      >
        {/* ── IMAGE ── */}
        <div style={{ position: "relative", height: 168, background: "#E2E8F0", overflow: "hidden" }}>
          {/* Skeleton */}
          {!imgLoaded && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.4s infinite",
              }}
            />
          )}

          <img
            src={image}
            alt={formation.name}
            onLoad={() => setImgLoaded(true)}
            onError={() => { setImgError(true); setImgLoaded(true); }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              opacity: imgLoaded ? 1 : 0,
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.5s ease, opacity 0.3s ease",
            }}
          />

          {/* Overlay gradient */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)" }} />

          {/* AI badge — top left */}
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              background: "rgba(255,255,255,0.93)",
              borderRadius: 20,
              padding: "3px 10px",
              fontSize: 11,
              fontWeight: 600,
              color: "#185FA5",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#378ADD",
                animation: "pulse 2s infinite",
              }}
            />
            IA v2.0
          </div>

          {/* Rank badge — top right */}
          {index < 3 && (
            <div
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "rgba(0,0,0,0.65)",
                backdropFilter: "blur(4px)",
                borderRadius: "50%",
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
              }}
              aria-label={`Classement #${index + 1}`}
            >
              #{index + 1}
            </div>
          )}

          {/* Level + Price — bottom */}
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: 10,
              right: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {formation.level && <LevelBadge level={formation.level} />}
            <PriceBadge price={formation.price} />
          </div>
        </div>

        {/* ── BODY ── */}
        <div style={{ padding: "16px 16px 14px" }}>

          {/* Header: title + score */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Link
                to={`/formation/${formation._id}`}
                style={{ textDecoration: "none" }}
              >
                <h4
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: hovered ? "#185FA5" : "#1a202c",
                    lineHeight: 1.4,
                    marginBottom: 5,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    transition: "color 0.2s",
                  }}
                >
                  {formation.name}
                </h4>
              </Link>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", fontSize: 12, color: "#5F5E5A" }}>
                {formation.centre && (
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <i className="fas fa-building" style={{ fontSize: 11, color: "#888780" }} aria-hidden="true" />
                    {formation.centre}
                  </span>
                )}
                {formation.location && (
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <i className="fas fa-map-marker-alt" style={{ fontSize: 11, color: "#888780" }} aria-hidden="true" />
                    {formation.location}
                  </span>
                )}
              </div>
            </div>
            <ScoreCircle score={validScore} />
          </div>

          {/* Match chip */}
          <MatchChip score={validScore} />

          {/* AI Insight */}
          <AIInsight explanation={explanation} score={validScore} />

          {/* Criteria bars */}
          <MatchDetails formation={formation} prefs={userPreferences} />

          {/* Skills */}
          <SkillsCloud skills={formation.skills} maxDisplay={4} />

          {/* Actions */}
          <div
            style={{
              display: "flex",
              gap: 8,
              paddingTop: 12,
              borderTop: "0.5px solid #E2E8F0",
            }}
          >
            <Link
              to={`/formation/${formation._id}`}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "9px 0",
                background: "#F8FAFC",
                border: "0.5px solid #CBD5E1",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                color: "#2C2C2A",
                textDecoration: "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F1EFE8")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#F8FAFC")}
            >
              <i className="fas fa-eye" style={{ fontSize: 12, color: "#378ADD" }} aria-hidden="true" />
              Détails
            </Link>

            {onRegister && (
              <button
                onClick={() => onRegister(formation._id)}
                disabled={isRegistering}
                style={{
                  flex: 1.6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "9px 0",
                  background: isRegistering ? "#5F5E5A" : "#185FA5",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#fff",
                  cursor: isRegistering ? "not-allowed" : "pointer",
                  opacity: isRegistering ? 0.7 : 1,
                  transition: "background 0.15s, transform 0.1s",
                }}
                onMouseEnter={(e) => { if (!isRegistering) e.currentTarget.style.background = "#0C447C"; }}
                onMouseLeave={(e) => { if (!isRegistering) e.currentTarget.style.background = "#185FA5"; }}
                onMouseDown={(e) => { if (!isRegistering) e.currentTarget.style.transform = "scale(0.98)"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                {isRegistering ? (
                  <>
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        border: "2px solid rgba(255,255,255,0.4)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                        flexShrink: 0,
                      }}
                    />
                    Inscription…
                  </>
                ) : (
                  <>
                    <i className="fas fa-pen-alt" style={{ fontSize: 11 }} aria-hidden="true" />
                    S'inscrire
                    <i
                      className="fas fa-arrow-right"
                      style={{
                        fontSize: 11,
                        transform: hovered ? "translateX(3px)" : "translateX(0)",
                        transition: "transform 0.2s",
                      }}
                      aria-hidden="true"
                    />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            height: 3,
            background: "#378ADD",
            transform: hovered ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left",
            transition: "transform 0.35s ease",
          }}
        />
      </div>

      {/* Global keyframes */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}