import { useState, useEffect, useCallback, useRef } from "react";
import { Calendar, Plus, Edit2, Trash2, X, Check, ChevronDown, Copy, Music, Plane, Home, Star, Navigation, Sun, Cloud, CloudRain, Thermometer, Train, Footprints, Car } from "lucide-react";

const STORAGE_KEY = "belgium-trip-v3";
const DAYS = [
  { id: "friday-24", label: "Fredag 24. april", date: "2026-04-24", subtitle: "Ankomstdag", emoji: "✈️", icon: Plane },
  { id: "saturday-25", label: "Lørdag 25. april", date: "2026-04-25", subtitle: "Utforsk Belgia", emoji: "🌟", icon: Star },
  { id: "sunday-26", label: "Søndag 26. april", date: "2026-04-26", subtitle: "Konsertkveld", emoji: "🎵", icon: Music },
  { id: "monday-27", label: "Mandag 27. april", date: "2026-04-27", subtitle: "Hjemreise", emoji: "🏠", icon: Home },
];

const HOME_ADDRESS = "Turnhoutsebaan 124, Antwerp, Vlaams Gewest 2140";
const TRIP_START = new Date("2026-04-24T00:00:00");

const DEFAULT_ACTIVITIES = [
  {
    id: "clapton-1",
    day: "sunday-26",
    date: "2026-04-26",
    time: "20:30",
    name: "Eric Clapton konsert",
    description: "Live konsert – en uforglemmelig kveld!",
    location: "AFAS Dome, Antwerp",
    type: "activity",
  },
];

const WEATHER_DATA = [
  { id: "friday-24", high: 15, low: 8, icon: "partly", desc: "Delvis skyet", rain: 20, wind: 14 },
  { id: "saturday-25", high: 16, low: 9, icon: "sunny", desc: "Mest sol", rain: 10, wind: 11 },
  { id: "sunday-26", high: 14, low: 7, icon: "cloudy", desc: "Overskyet", rain: 40, wind: 16 },
  { id: "monday-27", high: 13, low: 7, icon: "rainy", desc: "Lett regn", rain: 65, wind: 18 },
];

function useStorage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setData(JSON.parse(stored));
    } catch {}
    setLoading(false);
  }, []);

  const save = useCallback((newData) => {
    setData(newData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch {}
  }, []);

  return { data, save, loading };
}

function CountdownTimer({ isDark }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const diff = TRIP_START - now;
  if (diff <= 0) return null;
  const d = Math.floor(diff / 864e5), h = Math.floor((diff % 864e5) / 36e5), m = Math.floor((diff % 36e5) / 6e4), s = Math.floor((diff % 6e4) / 1e3);

  const Unit = ({ val, label }) => (
    <div className="flex flex-col items-center">
      <div className={`text-2xl font-bold w-14 h-14 flex items-center justify-center rounded-2xl ${isDark ? "bg-white/10 text-white" : "bg-gray-900/5 text-gray-900"}`} style={{ fontVariantNumeric: "tabular-nums" }}>
        {String(val).padStart(2, "0")}
      </div>
      <span className={`text-xs mt-1.5 font-medium ${isDark ? "text-white/40" : "text-gray-400"}`}>{label}</span>
    </div>
  );
  const Sep = () => <span className={`text-xl font-light mt-[-8px] ${isDark ? "text-white/20" : "text-gray-300"}`}>:</span>;
  return (
    <div className="flex items-start justify-center gap-2 mt-4">
      <Unit val={d} label="dager" /><Sep /><Unit val={h} label="timer" /><Sep /><Unit val={m} label="min" /><Sep /><Unit val={s} label="sek" />
    </div>
  );
}

function WeatherBadge({ weather, isDark }) {
  const icons = { sunny: <Sun className="w-4 h-4 text-amber-400" />, partly: <Cloud className="w-4 h-4 text-amber-300" />, cloudy: <Cloud className="w-4 h-4 text-gray-400" />, rainy: <CloudRain className="w-4 h-4 text-blue-400" /> };
  return (
    <div className={`flex items-center gap-2 px-2.5 py-1 rounded-lg ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
      {icons[weather.icon]}
      <span className={`text-xs font-semibold ${isDark ? "text-white/70" : "text-gray-600"}`}>{weather.high}°</span>
      <span className={`text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>{weather.low}°</span>
    </div>
  );
}

function WeatherCard({ isDark }) {
  return (
    <div className={`rounded-2xl p-4 transition-all duration-300 ${isDark ? "bg-white/[0.03] border border-white/10" : "bg-white border border-gray-200/80 shadow-sm"}`}>
      <div className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${isDark ? "text-white/40" : "text-gray-400"}`}>
        <Thermometer className="w-3.5 h-3.5" /> Vær i Antwerpen · historisk gjennomsnitt for april
      </div>
      <div className="grid grid-cols-4 gap-2">
        {WEATHER_DATA.map((w, i) => {
          const icons = { sunny: <Sun className="w-6 h-6 text-amber-400" />, partly: <Cloud className="w-6 h-6 text-amber-300" />, cloudy: <Cloud className="w-6 h-6 text-gray-400" />, rainy: <CloudRain className="w-6 h-6 text-blue-400" /> };
          const dayLabel = ["Fre", "Lør", "Søn", "Man"][i];
          return (
            <div key={w.id} className={`flex flex-col items-center py-3 rounded-xl ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
              <div className={`text-xs font-semibold mb-2 ${isDark ? "text-white/50" : "text-gray-500"}`}>{dayLabel}</div>
              {icons[w.icon]}
              <div className="flex gap-1 mt-2">
                <span className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{w.high}°</span>
                <span className={`text-sm ${isDark ? "text-white/30" : "text-gray-400"}`}>{w.low}°</span>
              </div>
              <div className={`text-xs mt-1 flex items-center gap-0.5 ${isDark ? "text-blue-400/60" : "text-blue-400"}`}>
                <CloudRain className="w-3 h-3" />{w.rain}%
              </div>
            </div>
          );
        })}
      </div>
      <div className={`text-xs mt-3 text-center ${isDark ? "text-white/20" : "text-gray-300"}`}>
        Oppdateres med sanntidsdata 7 dager før avreise
      </div>
    </div>
  );
}

function TransportBar({ activity, isDark }) {
  const dest = activity.location || activity.name;
  const enc = encodeURIComponent(dest);
  const homeEnc = encodeURIComponent(HOME_ADDRESS);
  const modes = [
    { icon: <Footprints className="w-3.5 h-3.5" />, label: "Gå", mode: "walking" },
    { icon: <Train className="w-3.5 h-3.5" />, label: "Kollektiv", mode: "transit" },
    { icon: <Car className="w-3.5 h-3.5" />, label: "Taxi", mode: "driving" },
  ];
  return (
    <div className="flex gap-1.5 mt-2.5 flex-wrap">
      {modes.map((m) => (
        <button
          key={m.mode}
          onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&origin=${homeEnc}&destination=${enc}&travelmode=${m.mode}`, "_blank")}
          className={`text-xs font-semibold flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all active:scale-95 ${isDark ? "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70" : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"}`}
        >
          {m.icon}{m.label}
        </button>
      ))}
    </div>
  );
}

function ActivityCard({ activity, isDark, onEdit, onDelete }) {
  const [confirm, setConfirm] = useState(false);
  const openMap = () => {
    const loc = activity.location;
    window.open(loc?.includes("http") ? loc : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc)}`, "_blank");
  };
  return (
    <div className={`rounded-2xl p-4 transition-all duration-300 ${isDark ? "bg-white/5 border border-white/10" : "bg-white border border-gray-200/80 shadow-sm"}`}>
      <div className="flex gap-3">
        {activity.time && (
          <div className="flex flex-col items-center pt-0.5">
            <div className={`text-xs font-bold px-2.5 py-1 rounded-lg ${isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-50 text-blue-600"}`}>{activity.time}</div>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className={`font-semibold text-base ${isDark ? "text-white" : "text-gray-900"}`}>{activity.name}</div>
          {activity.description && <div className={`text-sm mt-0.5 ${isDark ? "text-white/50" : "text-gray-500"}`}>{activity.description}</div>}
          {activity.location && (
            <div className="flex gap-1.5 mt-2.5 flex-wrap">
              <button onClick={openMap} className={`text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all active:scale-95 ${isDark ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}>
                <Navigation className="w-3 h-3" />Åpne i kart
              </button>
            </div>
          )}
          {activity.location && <TransportBar activity={activity} isDark={isDark} />}
        </div>
        <div className="flex flex-col gap-1">
          <button onClick={onEdit} className={`p-2 rounded-xl transition-all active:scale-90 ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
            <Edit2 className={`w-4 h-4 ${isDark ? "text-white/40" : "text-gray-400"}`} />
          </button>
          {!confirm ? (
            <button onClick={() => setConfirm(true)} className={`p-2 rounded-xl transition-all active:scale-90 ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
              <Trash2 className={`w-4 h-4 ${isDark ? "text-red-400/60" : "text-red-300"}`} />
            </button>
          ) : (
            <div className="flex flex-col gap-1">
              <button onClick={() => { onDelete(); setConfirm(false); }} className="p-2 rounded-xl bg-red-500/20 active:scale-90"><Check className="w-4 h-4 text-red-500" /></button>
              <button onClick={() => setConfirm(false)} className={`p-2 rounded-xl active:scale-90 ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}><X className={`w-4 h-4 ${isDark ? "text-white/40" : "text-gray-400"}`} /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DaySection({ day, activities, isDark, onEdit, onDelete, defaultExpanded }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const sorted = [...activities].sort((a, b) => (a.time || "99").localeCompare(b.time || "99"));
  const weather = WEATHER_DATA.find((w) => w.id === day.id);
  return (
    <div className={`rounded-2xl overflow-hidden transition-all duration-300 ${isDark ? "bg-white/[0.03] border border-white/10" : "bg-white border border-gray-200/80 shadow-sm"}`}>
      <button onClick={() => setExpanded(!expanded)} className={`w-full px-4 py-4 flex items-center gap-3 transition-all active:scale-[0.995] ${isDark ? "hover:bg-white/5" : "hover:bg-gray-50"}`}>
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg ${isDark ? "bg-white/10" : "bg-gray-100"}`}>{day.emoji}</div>
        <div className="flex-1 text-left">
          <div className={`font-semibold text-base ${isDark ? "text-white" : "text-gray-900"}`}>{day.label}</div>
          <div className={`text-xs font-medium ${isDark ? "text-white/40" : "text-gray-400"}`}>{day.subtitle}</div>
        </div>
        <div className="flex items-center gap-2">
          {weather && <WeatherBadge weather={weather} isDark={isDark} />}
          {sorted.length > 0 && <span className="bg-blue-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">{sorted.length}</span>}
          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${expanded ? "rotate-180" : ""} ${isDark ? "text-white/30" : "text-gray-300"}`} />
        </div>
      </button>
      {expanded && (
        <div className={`px-4 pb-4 space-y-2 pt-3 ${isDark ? "border-t border-white/5" : "border-t border-gray-100"}`}>
          {sorted.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-3xl mb-2 opacity-40">📝</div>
              <div className={`text-sm font-medium ${isDark ? "text-white/30" : "text-gray-400"}`}>Ingen planer ennå</div>
              <div className={`text-xs mt-1 ${isDark ? "text-white/20" : "text-gray-300"}`}>Trykk + for å legge til</div>
            </div>
          ) : sorted.map((a) => <ActivityCard key={a.id} activity={a} isDark={isDark} onEdit={() => onEdit(a)} onDelete={() => onDelete(a.id)} />)}
        </div>
      )}
    </div>
  );
}

function Modal({ isDark, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div onClick={(e) => e.stopPropagation()} className={`relative w-full sm:max-w-md sm:mx-4 rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto ${isDark ? "bg-zinc-900" : "bg-white"}`}
        style={{ animation: "slideUp 0.3s ease" }}>
        {children}
      </div>
      <style>{`@keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
}

function ActivityForm({ activity, onSave, onCancel, isDark }) {
  const [form, setForm] = useState({ day: activity?.day || "", time: activity?.time || "", name: activity?.name || "", description: activity?.description || "", location: activity?.location || "" });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const isEdit = !!activity?.id;
  const submit = () => {
    if (!form.day || !form.name.trim()) return;
    const d = DAYS.find((d) => d.id === form.day);
    onSave({ ...form, date: d?.date || "", type: "activity" });
  };
  const inputCls = `w-full px-4 py-3 rounded-xl border text-base outline-none transition-all focus:ring-2 focus:ring-blue-500 ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"}`;
  const labelCls = `block text-sm font-semibold mb-1.5 ${isDark ? "text-white/60" : "text-gray-500"}`;

  return (
    <Modal isDark={isDark} onClose={onCancel}>
      <div className="flex items-center justify-between mb-5">
        <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{isEdit ? "Rediger aktivitet" : "Ny aktivitet"}</h3>
        <button onClick={onCancel} className={`p-2 rounded-xl ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}><X className={`w-5 h-5 ${isDark ? "text-white/50" : "text-gray-400"}`} /></button>
      </div>
      <div className="space-y-4">
        <div>
          <label className={labelCls}>Dag *</label>
          <div className="grid grid-cols-2 gap-2">
            {DAYS.map((d) => (
              <button key={d.id} onClick={() => set("day", d.id)}
                className={`py-3 px-3 rounded-xl text-sm font-semibold transition-all active:scale-95 ${form.day === d.id ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25" : isDark ? "bg-white/5 text-white/70 hover:bg-white/10" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                {d.emoji} {d.label.split(" ")[0]} {d.label.split(" ")[1]}
              </button>
            ))}
          </div>
        </div>
        <div><label className={labelCls}>Tidspunkt</label><input type="time" value={form.time} onChange={(e) => set("time", e.target.value)} className={inputCls} /></div>
        <div><label className={labelCls}>Navn *</label><input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Hva skal dere gjøre?" className={inputCls} /></div>
        <div><label className={labelCls}>Beskrivelse</label><input value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Valgfri beskrivelse" className={inputCls} /></div>
        <div><label className={labelCls}>Sted / Google Maps-lenke</label><input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Adresse eller lim inn lenke" className={inputCls} /></div>
        <button onClick={submit} disabled={!form.day || !form.name.trim()}
          className={`w-full py-3.5 rounded-xl font-bold text-base transition-all active:scale-[0.98] ${form.day && form.name.trim() ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25" : isDark ? "bg-white/5 text-white/20" : "bg-gray-100 text-gray-300"}`}>
          {isEdit ? "Lagre endringer" : "Legg til"}
        </button>
      </div>
    </Modal>
  );
}

function CopiedToast({ show }) {
  return (
    <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-full shadow-xl transition-all duration-300 ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
      ✓ Kopiert!
    </div>
  );
}

function App() {
  const { data: stored, save, loading } = useStorage();
  const [isDark, setIsDark] = useState(false);
  const [activities, setActivities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [copied, setCopied] = useState(false);
  const init = useRef(false);

  useEffect(() => {
    if (loading || init.current) return;
    init.current = true;
    if (stored?.activities) setActivities(stored.activities);
    else setActivities(DEFAULT_ACTIVITIES);
    if (stored?.isDark !== undefined) setIsDark(stored.isDark);
  }, [loading, stored]);

  useEffect(() => { if (init.current) save({ activities, isDark }); }, [activities, isDark, save]);

  const addActivity = (a) => { setActivities((p) => [...p, { ...a, id: `a-${Date.now()}-${Math.random().toString(36).slice(2)}` }]); setShowForm(false); };
  const updateActivity = (id, u) => { setActivities((p) => p.map((a) => (a.id === id ? { ...a, ...u } : a))); setEditing(null); };
  const deleteActivity = (id) => setActivities((p) => p.filter((a) => a.id !== id));
  const copyAddr = () => { navigator.clipboard.writeText(HOME_ADDRESS); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center"><div className="text-4xl mb-3">🇧🇪</div><div className="text-gray-400 font-medium">Laster reiseplan...</div></div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-black" : "bg-gray-50"}`}>
      <CopiedToast show={copied} />
      <div className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-all duration-500 ${isDark ? "bg-black/80 border-white/10" : "bg-white/80 border-gray-200"}`}>
        <div className="max-w-lg mx-auto px-5 py-4">
          <div className="flex flex-col items-center mb-1">
            <h1 className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>Tur til Belgia</h1>
            <div className={`text-xs font-medium flex items-center gap-1.5 mt-0.5 ${isDark ? "text-white/40" : "text-gray-400"}`}>
              <Calendar className="w-3 h-3" /> 24.–27. april 2026
            </div>
          </div>
          <CountdownTimer isDark={isDark} />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-5 space-y-4 pb-28">
        <button onClick={copyAddr} className={`w-full rounded-2xl p-4 text-left transition-all duration-300 active:scale-[0.98] ${isDark ? "bg-white/[0.03] border border-white/10" : "bg-white border border-gray-200/80 shadow-sm"}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-blue-500/20" : "bg-blue-50"}`}>
              <Home className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-500"}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-xs font-semibold mb-0.5 ${isDark ? "text-white/40" : "text-gray-400"}`}>🏡 Vi bor her</div>
              <div className={`text-sm font-medium truncate ${isDark ? "text-white" : "text-gray-900"}`}>{HOME_ADDRESS}</div>
            </div>
            <Copy className={`w-4 h-4 flex-shrink-0 ${isDark ? "text-white/20" : "text-gray-300"}`} />
          </div>
        </button>

        <WeatherCard isDark={isDark} />

        {DAYS.map((day) => (
          <DaySection key={day.id} day={day} activities={activities.filter((a) => a.day === day.id)} isDark={isDark}
            onEdit={(a) => setEditing(a)} onDelete={deleteActivity} defaultExpanded={day.id === "friday-24"} />
        ))}

        <div className={`rounded-2xl p-4 transition-all ${isDark ? "bg-white/[0.03] border border-white/10" : "bg-white border border-gray-200/80 shadow-sm"}`}>
          <div className={`text-xs font-semibold mb-2 ${isDark ? "text-white/40" : "text-gray-400"}`}>💡 Tips</div>
          <div className={`text-sm leading-relaxed ${isDark ? "text-white/60" : "text-gray-500"}`}>
            Trykk <span className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>+</span> for å legge til aktiviteter. Lim inn Google Maps-lenker i sted-feltet for enkel navigering. Bruk transport-knappene for veibeskrivelse fra leiligheten.
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 left-6 z-40">
        <button onClick={() => setIsDark(!isDark)} className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all active:scale-90 ${isDark ? "bg-zinc-800 border border-white/10" : "bg-gray-100 border border-gray-300"}`}>
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <span className="text-sm">🌙</span>}
        </button>
      </div>
      <div className="fixed bottom-6 right-6 z-40">
        <button onClick={() => setShowForm(true)} className="w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-xl shadow-blue-500/30 flex items-center justify-center transition-all active:scale-90">
          <Plus className="w-6 h-6" strokeWidth={2.5} />
        </button>
      </div>

      {showForm && <ActivityForm isDark={isDark} onSave={addActivity} onCancel={() => setShowForm(false)} />}
      {editing && <ActivityForm activity={editing} isDark={isDark} onSave={(d) => updateActivity(editing.id, d)} onCancel={() => setEditing(null)} />}
    </div>
  );
}

export default App;