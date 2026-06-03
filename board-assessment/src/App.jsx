import { useState, useEffect, useRef } from "react";

const SUPABASE_URL = "https://mrltmcdzybsotwdlyfhl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ybHRtY2R6eWJzb3R3ZGx5ZmhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MTQ5MjEsImV4cCI6MjA5NjA5MDkyMX0.HIdpFEa82NbCCgVEABViGkueRhug2l-FIsDubaMPePg";

const TEAL = "#1A7A6E";
const TEAL_LIGHT = "#2BA897";
const TEAL_DARK = "#0F5A50";
const CREAM = "#F9F6F0";
const CHARCOAL = "#1C1C1C";
const MUTED = "#6B7280";

const SECTIONS = [
  {
    id: "vision",
    label: "Vision, Mission, Values & Purpose",
    icon: "🎯",
    questions: [
      { id: "v1", text: "I can clearly articulate our organization's mission in my own words." },
      { id: "v2", text: "Our board regularly revisits and affirms the organization's vision for the future." },
      { id: "v3", text: "The values of this organization are clearly defined and actively lived out." },
      { id: "v4", text: "Board decisions are consistently filtered through our mission and purpose." },
      { id: "v5", text: "I understand why this organization exists and who we ultimately serve." },
    ],
  },
  {
    id: "governance",
    label: "Board Governance & Structure",
    icon: "⚖️",
    questions: [
      { id: "g1", text: "I understand my role as a board member." },
      { id: "g2", text: "Board members understand the difference between governance and operations." },
      { id: "g3", text: "Our bylaws and governing policies are current and actively referenced." },
      { id: "g4", text: "The board has a clear process for recruiting and orienting new members." },
      { id: "g5", text: "Board size and composition reflect the needs of our organization." },
    ],
  },
  {
    id: "meetings",
    label: "Meeting Effectiveness",
    icon: "🗓️",
    questions: [
      { id: "m1", text: "Board meetings are well-organized, focused, and productive." },
      { id: "m2", text: "Agendas are distributed in advance with supporting materials." },
      { id: "m3", text: "Board members come prepared and actively participate in discussion." },
      { id: "m4", text: "Decisions made in meetings are followed up on and tracked." },
      { id: "m5", text: "Meeting time is used strategically rather than consumed by irrelevant activity." },
    ],
  },
  {
    id: "fundraising",
    label: "Fundraising & Financial Oversight",
    icon: "💰",
    questions: [
      { id: "f1", text: "The board understands and approves the annual budget." },
      { id: "f2", text: "Board members actively participate in fundraising efforts (not necessarily events)." },
      { id: "f3", text: "Financial reports are presented clearly and reviewed at each meeting." },
      { id: "f4", text: "The board ensures appropriate internal financial controls are in place." },
      { id: "f5", text: "I have made a personal financial gift to the organization this year." },
    ],
  },
  {
    id: "strategy",
    label: "Strategic Planning",
    icon: "🧭",
    questions: [
      { id: "s1", text: "Our organization has a current and relevant strategic plan." },
      { id: "s2", text: "The board regularly reviews progress toward strategic goals." },
      { id: "s3", text: "The board actively participates in shaping long-term organizational direction." },
      { id: "s4", text: "Strategic priorities drive board agenda items and committee work." },
      { id: "s5", text: "The board anticipates future challenges and opportunities proactively." },
    ],
  },
  {
    id: "engagement",
    label: "Board Member Engagement & Culture",
    icon: "🤝",
    questions: [
      { id: "e1", text: "Board members are passionate about the mission of this organization." },
      { id: "e2", text: "There is a culture of healthy dialogue, candor, and mutual respect." },
      { id: "e3", text: "Board members use their networks and influence on behalf of the organization." },
      { id: "e4", text: "All board members are actively engaged, not just a core few." },
      { id: "e5", text: "The board celebrates wins and acknowledges the impact of its work." },
    ],
  },
  {
    id: "ed",
    label: "Executive Director Relationship",
    icon: "🔗",
    questions: [
      { id: "r1", text: "The board provides clear direction and support to the Executive Director." },
      { id: "r2", text: "The ED is evaluated regularly using a clear and fair process." },
      { id: "r3", text: "The boundary between board governance and staff management is respected." },
      { id: "r4", text: "The board and ED have a relationship built on trust and transparency." },
      { id: "r5", text: "The board is proactively prepared for leadership transition if needed." },
    ],
  },
  {
    id: "satisfaction",
    label: "Satisfaction of Service",
    icon: "⭐",
    questions: [
      { id: "sat1", text: "I feel my time as a board member is well spent." },
      { id: "sat2", text: "I feel equipped and informed to fulfill my board responsibilities." },
      { id: "sat3", text: "I would recommend serving on this board to a colleague." },
      { id: "sat4", text: "My unique skills and expertise are utilized by this board." },
      { id: "sat5", text: "Overall, I am satisfied with my experience as a board member." },
    ],
  },
];

const OPEN_ENDED = [
  { id: "oe1", text: "What is the greatest strength of this board?" },
  { id: "oe2", text: "What is the most significant area this board needs to improve?" },
  { id: "oe3", text: "What would make your experience as a board member more meaningful or effective?" },
];

async function supabaseInsert(payload) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Prefer": "return=minimal",
    },
    body: JSON.stringify({
      org: payload.org,
      ratings: payload.ratings,
      comments: payload.comments,
      open_ended: payload.openEnded,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
}

async function supabaseFetch(orgFilter) {
  let url = `${SUPABASE_URL}/rest/v1/submissions?select=*`;
  if (orgFilter) {
    url += `&org=ilike.${encodeURIComponent(orgFilter)}`;
  }
  const res = await fetch(url, {
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function supabaseFetchAll() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/submissions?select=*`, {
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function getOrgFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("org") || "";
}

function getViewFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("view") || "assessment";
}

function avg(arr) {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function ScoreBar({ value, max = 5, color = TEAL }) {
  const pct = (value / max) * 100;
  return (
    <div style={{ background: "#E5E7EB", borderRadius: 999, height: 8, width: "100%", overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 999, transition: "width 1s cubic-bezier(0.4,0,0.2,1)" }} />
    </div>
  );
}

function RatingInput({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          style={{
            width: 44, height: 44, borderRadius: 10,
            border: value === n ? `2px solid ${TEAL}` : "2px solid #D1D5DB",
            background: value === n ? TEAL : "white",
            color: value === n ? "white" : CHARCOAL,
            fontWeight: 700, fontSize: 16, cursor: "pointer",
            transition: "all 0.15s", fontFamily: "inherit", flexShrink: 0,
          }}
        >{n}</button>
      ))}
      <span style={{ fontSize: 11, color: MUTED, marginLeft: 4 }}>
        1 = Strongly Disagree · 5 = Strongly Agree
      </span>
    </div>
  );
}

function AssessmentView({ orgName }) {
  const [currentSection, setCurrentSection] = useState(0);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [openEnded, setOpenEnded] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const topRef = useRef(null);

  const isOpenEnded = currentSection === SECTIONS.length;
  const section = !isOpenEnded ? SECTIONS[currentSection] : null;
  const isLast = currentSection === SECTIONS.length - 1;
  const sectionComplete = section ? section.questions.every((q) => ratings[q.id] !== undefined) : true;
  const progress = (currentSection / (SECTIONS.length + 1)) * 100;

  function scrollTop() { topRef.current?.scrollIntoView({ behavior: "smooth" }); }
  function next() { scrollTop(); setCurrentSection((s) => s + 1); }
  function back() { scrollTop(); setCurrentSection((s) => s - 1); }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    try {
      await supabaseInsert({ org: orgName, ratings, comments, openEnded });
      setSubmitted(true);
    } catch (e) {
      setError("Something went wrong saving your response. Please try again.");
    }
    setSubmitting(false);
  }

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: CREAM, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 520, textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: TEAL_DARK, marginBottom: 12 }}>Thank You!</h2>
          <p style={{ color: CHARCOAL, fontSize: 16, lineHeight: 1.7 }}>
            Your assessment for <strong>{orgName}</strong> has been submitted. Your input helps build a healthier, more effective board.
          </p>
          <p style={{ color: MUTED, fontSize: 14, marginTop: 16 }}>
            A board report will be available to your organization's administrator once all responses are collected.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: CREAM, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: TEAL_DARK, padding: "20px 32px", display: "flex", alignItems: "center", gap: 16 }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", color: "white", fontSize: 20, fontWeight: 700 }}>Stroman & Associates</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>Board Health Assessment</div>
        </div>
        {orgName && (
          <div style={{ marginLeft: "auto", background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "6px 14px", color: "white", fontSize: 13 }}>
            {orgName}
          </div>
        )}
      </div>

      <div style={{ background: "white", borderBottom: "1px solid #E5E7EB", padding: "12px 32px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: MUTED }}>Section {Math.min(currentSection + 1, SECTIONS.length + 1)} of {SECTIONS.length + 1}</span>
            <span style={{ fontSize: 13, color: TEAL, fontWeight: 600 }}>{Math.round(progress)}% complete</span>
          </div>
          <ScoreBar value={progress} max={100} color={TEAL} />
        </div>
      </div>

      <div ref={topRef} style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
        {!isOpenEnded && section && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 32 }}>{section.icon}</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: TEAL_DARK, margin: 0 }}>{section.label}</h2>
            </div>
            <p style={{ color: MUTED, fontSize: 14, marginBottom: 32 }}>
              Rate each statement from 1 (Strongly Disagree) to 5 (Strongly Agree). Add a comment if you'd like to elaborate.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {section.questions.map((q, i) => (
                <div key={q.id} style={{ background: "white", borderRadius: 14, padding: 24, border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <p style={{ fontWeight: 600, fontSize: 15, color: CHARCOAL, marginBottom: 16, lineHeight: 1.5 }}>
                    <span style={{ color: TEAL, marginRight: 8 }}>{i + 1}.</span>{q.text}
                  </p>
                  <RatingInput value={ratings[q.id]} onChange={(v) => setRatings((r) => ({ ...r, [q.id]: v }))} />
                  <textarea
                    value={comments[q.id] || ""}
                    onChange={(e) => setComments((c) => ({ ...c, [q.id]: e.target.value }))}
                    placeholder="Optional comment..."
                    rows={2}
                    style={{
                      width: "100%", marginTop: 14, borderRadius: 8,
                      border: "1px solid #E5E7EB", padding: "10px 14px",
                      fontSize: 13, fontFamily: "inherit", resize: "vertical",
                      outline: "none", color: CHARCOAL, background: CREAM, boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {isOpenEnded && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 32 }}>💬</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: TEAL_DARK, margin: 0 }}>Open-Ended Reflection</h2>
            </div>
            <p style={{ color: MUTED, fontSize: 14, marginBottom: 32 }}>These questions are optional but incredibly valuable. Be candid.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {OPEN_ENDED.map((q, i) => (
                <div key={q.id} style={{ background: "white", borderRadius: 14, padding: 24, border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <p style={{ fontWeight: 600, fontSize: 15, color: CHARCOAL, marginBottom: 12, lineHeight: 1.5 }}>
                    <span style={{ color: TEAL, marginRight: 8 }}>{i + 1}.</span>{q.text}
                  </p>
                  <textarea
                    value={openEnded[q.id] || ""}
                    onChange={(e) => setOpenEnded((o) => ({ ...o, [q.id]: e.target.value }))}
                    placeholder="Your answer..."
                    rows={4}
                    style={{
                      width: "100%", borderRadius: 8, border: "1px solid #D1D5DB",
                      padding: "10px 14px", fontSize: 14, fontFamily: "inherit",
                      resize: "vertical", outline: "none", color: CHARCOAL, boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}
            </div>
            {error && <p style={{ color: "red", marginTop: 16 }}>{error}</p>}
          </>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}>
          <button
            onClick={back}
            style={{
              padding: "12px 28px", borderRadius: 10, border: `2px solid ${TEAL}`,
              background: "white", color: TEAL, fontWeight: 700, fontSize: 15,
              cursor: "pointer", fontFamily: "inherit",
              opacity: currentSection === 0 ? 0.3 : 1,
              pointerEvents: currentSection === 0 ? "none" : "auto",
            }}
          >← Back</button>
          {!isOpenEnded ? (
            <button
              onClick={next}
              disabled={!sectionComplete}
              style={{
                padding: "12px 28px", borderRadius: 10, border: "none",
                background: sectionComplete ? TEAL : "#D1D5DB", color: "white",
                fontWeight: 700, fontSize: 15,
                cursor: sectionComplete ? "pointer" : "not-allowed",
                fontFamily: "inherit", transition: "background 0.2s",
              }}
            >{isLast ? "Continue →" : "Next →"}</button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                padding: "12px 32px", borderRadius: 10, border: "none",
                background: TEAL, color: "white", fontWeight: 700,
                fontSize: 15, cursor: "pointer", fontFamily: "inherit",
              }}
            >{submitting ? "Submitting..." : "Submit Assessment ✓"}</button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReportView({ orgFilter }) {
  const [orgData, setOrgData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [orgRows, allRows] = await Promise.all([
          orgFilter ? supabaseFetch(orgFilter) : Promise.resolve([]),
          supabaseFetchAll(),
        ]);
        setOrgData(orgRows);
        setAllData(allRows);
      } catch (e) {
        setError("Failed to load report data.");
      }
      setLoading(false);
    }
    load();
  }, [orgFilter]);

  if (loading) return <div style={{ padding: 48, textAlign: "center", color: MUTED, fontFamily: "'DM Sans', sans-serif" }}>Loading report data...</div>;
  if (error) return <div style={{ padding: 48, textAlign: "center", color: "red", fontFamily: "'DM Sans', sans-serif" }}>{error}</div>;

  const orgSubmissions = orgData;
  const benchmarkSubmissions = allData;

  function sectionAvgFor(submissions, sectionId) {
    const sec = SECTIONS.find((s) => s.id === sectionId);
    if (!sec || submissions.length === 0) return 0;
    const vals = submissions.flatMap((s) => sec.questions.map((q) => s.ratings?.[q.id]).filter(Boolean));
    return avg(vals);
  }

  function overallAvgFor(submissions) {
    if (submissions.length === 0) return 0;
    const vals = submissions.flatMap((s) => Object.values(s.ratings || {}).filter(Boolean));
    return avg(vals);
  }

  function questionCommentsFor(submissions, qId) {
    return submissions.map((s) => s.comments?.[qId]).filter(Boolean);
  }

  const scoreColor = (score) => {
    if (score >= 4) return "#16A34A";
    if (score >= 3) return TEAL;
    if (score >= 2) return "#D97706";
    return "#DC2626";
  };

  const orgOverall = overallAvgFor(orgSubmissions);
  const benchmarkOverall = overallAvgFor(benchmarkSubmissions);

  return (
    <div style={{ minHeight: "100vh", background: CREAM, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: TEAL_DARK, padding: "24px 32px" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", color: "white", fontSize: 22, fontWeight: 700 }}>Stroman & Associates</div>
        <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, marginTop: 2 }}>Board Health Assessment Report</div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 36 }}>
          <div style={{ flex: 1, minWidth: 200, background: "white", borderRadius: 14, padding: 24, border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 13, color: MUTED, marginBottom: 4 }}>Organization</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: TEAL_DARK, fontWeight: 700 }}>{orgFilter || "All Organizations"}</div>
            <div style={{ fontSize: 13, color: MUTED, marginTop: 6 }}>{orgSubmissions.length} response{orgSubmissions.length !== 1 ? "s" : ""} collected</div>
          </div>
          <div style={{ flex: 1, minWidth: 200, background: "white", borderRadius: 14, padding: 24, border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 13, color: MUTED, marginBottom: 4 }}>Overall Score</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: scoreColor(orgOverall), fontWeight: 700 }}>
              {orgOverall.toFixed(1)}<span style={{ fontSize: 18, color: MUTED }}>/5</span>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 200, background: "white", borderRadius: 14, padding: 24, border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 13, color: MUTED, marginBottom: 4 }}>Sector Benchmark</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: scoreColor(benchmarkOverall), fontWeight: 700 }}>
              {benchmarkOverall.toFixed(1)}<span style={{ fontSize: 18, color: MUTED }}>/5</span>
            </div>
            <div style={{ fontSize: 13, color: MUTED, marginTop: 6 }}>{benchmarkSubmissions.length} total responses</div>
          </div>
        </div>

        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: TEAL_DARK, marginBottom: 20 }}>Section Breakdown</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {SECTIONS.map((sec) => {
            const orgScore = sectionAvgFor(orgSubmissions, sec.id);
            const benchScore = sectionAvgFor(benchmarkSubmissions, sec.id);
            return (
              <div key={sec.id} style={{ background: "white", borderRadius: 14, padding: 24, border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 22 }}>{sec.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: 15, color: CHARCOAL }}>{sec.label}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: MUTED }}>Org</div>
                      <div style={{ fontWeight: 700, color: scoreColor(orgScore), fontSize: 16 }}>{orgScore.toFixed(1)}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: MUTED }}>Sector</div>
                      <div style={{ fontWeight: 700, color: scoreColor(benchScore), fontSize: 16 }}>{benchScore.toFixed(1)}</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 60, fontSize: 11, color: TEAL, fontWeight: 600 }}>This org</span>
                    <div style={{ flex: 1 }}><ScoreBar value={orgScore} color={TEAL} /></div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 60, fontSize: 11, color: MUTED }}>Sector</span>
                    <div style={{ flex: 1 }}><ScoreBar value={benchScore} color="#D1D5DB" /></div>
                  </div>
                </div>
                <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
                  {sec.questions.map((q, i) => {
                    const qRatings = orgSubmissions.map((s) => s.ratings?.[q.id]).filter(Boolean);
                    const qAvg = avg(qRatings);
                    const qComments = questionCommentsFor(orgSubmissions, q.id);
                    return (
                      <div key={q.id}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 4 }}>
                          <span style={{ fontSize: 13, color: CHARCOAL, lineHeight: 1.5, flex: 1 }}>
                            <span style={{ color: TEAL, fontWeight: 600, marginRight: 6 }}>{i + 1}.</span>{q.text}
                          </span>
                          <span style={{ fontWeight: 700, color: scoreColor(qAvg), fontSize: 14, flexShrink: 0 }}>
                            {qRatings.length > 0 ? qAvg.toFixed(1) : "—"}
                          </span>
                        </div>
                        {qComments.length > 0 && (
                          <div style={{ marginLeft: 18, display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
                            {qComments.map((c, ci) => (
                              <div key={ci} style={{ background: CREAM, borderRadius: 6, padding: "8px 12px", fontSize: 12, color: MUTED, lineHeight: 1.6, borderLeft: `2px solid ${TEAL_LIGHT}` }}>
                                {c}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {orgSubmissions.length > 0 && (
          <>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: TEAL_DARK, margin: "40px 0 20px" }}>Open-Ended Responses</h3>
            {OPEN_ENDED.map((q) => {
              const responses = orgSubmissions.map((s) => s.open_ended?.[q.id]).filter(Boolean);
              return (
                <div key={q.id} style={{ background: "white", borderRadius: 14, padding: 24, border: "1px solid #E5E7EB", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <p style={{ fontWeight: 700, fontSize: 15, color: CHARCOAL, marginBottom: 16 }}>{q.text}</p>
                  {responses.length === 0 ? (
                    <p style={{ color: MUTED, fontSize: 14 }}>No responses yet.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {responses.map((r, i) => (
                        <div key={i} style={{ background: CREAM, borderRadius: 8, padding: "12px 16px", fontSize: 14, color: CHARCOAL, lineHeight: 1.6, borderLeft: `3px solid ${TEAL}` }}>
                          {r}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {orgSubmissions.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 24px", color: MUTED }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
            <p>No submissions yet for <strong>{orgFilter || "this organization"}</strong>.</p>
            <p style={{ fontSize: 13 }}>Share the assessment link and responses will appear here automatically.</p>
          </div>
        )}

        <div style={{ marginTop: 48, padding: "20px 24px", background: "white", borderRadius: 14, border: "1px solid #E5E7EB", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: MUTED }}>
            Report generated by <strong style={{ color: TEAL_DARK }}>Stroman & Associates</strong> · stromanconsulting.com
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const view = getViewFromURL();
  const org = getOrgFromURL();

  if (view === "report") return <ReportView orgFilter={org} />;

  if (!org) {
    return (
      <div style={{ minHeight: "100vh", background: CREAM, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: TEAL_DARK, marginBottom: 12 }}>Stroman & Associates</div>
          <p style={{ color: MUTED, marginBottom: 24 }}>Board Health Assessment</p>
          <div style={{ background: "white", borderRadius: 14, padding: 28, border: "1px solid #E5E7EB" }}>
            <p style={{ color: CHARCOAL, fontSize: 15, lineHeight: 1.7 }}>
              This assessment link requires an organization name. Please use the link provided by your consultant.
            </p>
            <p style={{ marginTop: 16, fontSize: 15, color: TEAL_DARK, fontWeight: 600 }}>
              Your organization name
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <AssessmentView orgName={org} />;
}
