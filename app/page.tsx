"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Adoption = {
  id: number | string;
  adopter_name: string;
  plant_name: string;
  plant_type: string;
  created_at: string;
};

type Answers = {
  light: "low" | "medium" | "high";
  water: "forgetful" | "weekly" | "attentive";
  pets: "yes" | "no";
  experience: "new" | "some" | "expert";
};

const plants = {
  sansevieria: { name: "Sansevieria", icon: "🌱", traits: "Resistente · Serena · Independiente" },
  peperomia: { name: "Peperomia", icon: "🪴", traits: "Amable · Compacta · Pet friendly" },
  monstera: { name: "Monstera", icon: "🌿", traits: "Curiosa · Creativa · Expansiva" },
  pothos: { name: "Pothos", icon: "🍃", traits: "Flexible · Vigoroso · Agradecido" },
} as const;

const seedAdoptions: Adoption[] = [
  { id: "seed-1", adopter_name: "Luna", plant_name: "Menta", plant_type: "Peperomia", created_at: new Date(Date.now() - 18 * 60000).toISOString() },
  { id: "seed-2", adopter_name: "Andrés", plant_name: "Cosmo", plant_type: "Sansevieria", created_at: new Date(Date.now() - 65 * 60000).toISOString() },
  { id: "seed-3", adopter_name: "Sofía", plant_name: "Pilea", plant_type: "Monstera", created_at: new Date(Date.now() - 3 * 3600000).toISOString() },
];

function plantMatch(a: Answers) {
  if (a.pets === "yes") return plants.peperomia;
  if (a.light === "low" || a.water === "forgetful") return plants.sansevieria;
  if (a.light === "high" && a.experience !== "new") return plants.monstera;
  return plants.pothos;
}

function timeAgo(value: string) {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 1) return "Ahora mismo";
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} ${hours === 1 ? "hora" : "horas"}`;
  const days = Math.floor(hours / 24);
  return `Hace ${days} ${days === 1 ? "día" : "días"}`;
}

function localDateTime(value: string) {
  const date = new Date(value);
  const today = new Date();
  const sameDay = date.toDateString() === today.toDateString();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const dayLabel = sameDay
    ? "Hoy"
    : date.toDateString() === yesterday.toDateString()
      ? "Ayer"
      : new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short" }).format(date);
  const hour = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(date);
  return `${dayLabel}, ${hour}`;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function supabaseRequest(path: string, init?: RequestInit) {
  if (!supabaseUrl || !supabaseKey) throw new Error("Supabase no está configurado");
  return fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
}

export default function Home() {
  const [adoptions, setAdoptions] = useState<Adoption[]>(seedAdoptions);
  const [answers, setAnswers] = useState<Answers>({ light: "medium", water: "weekly", pets: "no", experience: "new" });
  const [adopterName, setAdopterName] = useState("");
  const [plantName, setPlantName] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const match = useMemo(() => plantMatch(answers), [answers]);

  useEffect(() => {
    if (!supabaseUrl || !supabaseKey) return;
    supabaseRequest("adoptions?select=id,adopter_name,plant_name,plant_type,created_at&order=created_at.desc&limit=8")
      .then(async (response) => {
        if (!response.ok) throw new Error();
        const rows = (await response.json()) as Adoption[];
        if (rows.length) setAdoptions(rows);
      })
      .catch(() => undefined);
  }, []);

  async function submitAdoption(event: FormEvent) {
    event.preventDefault();
    if (!adopterName.trim() || !plantName.trim()) return;
    setStatus("sending");
    const payload = {
      adopter_name: adopterName.trim(),
      plant_name: plantName.trim(),
      plant_type: match.name,
      light_level: answers.light,
      watering_habit: answers.water,
      has_pets: answers.pets === "yes",
      experience_level: answers.experience,
    };

    try {
      const response = await supabaseRequest("adoptions", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error();
      const [created] = (await response.json()) as Adoption[];
      setAdoptions((current) => [created, ...current].slice(0, 8));
      setStatus("success");
      setAdopterName("");
      setPlantName("");
      document.querySelector("#comunidad")?.scrollIntoView({ behavior: "smooth" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="PlantMatch, inicio"><span>🌱</span> PlantMatch</a>
        <nav aria-label="Navegación principal">
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#test">Plantas</a>
          <a href="#comunidad">Comunidad</a>
        </nav>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">Adopción botánica digital</p>
          <h1>Una planta para cada personalidad</h1>
          <p className="hero-text">Haz un test rápido, encuentra tu planta ideal y adóptala digitalmente.</p>
          <a className="primary-button" href="#test"><span>🌿</span> Encontrar mi planta <b>→</b></a>
        </div>
        <div className="plant-poster" aria-label="Tu match: Monstera">
          <span className="match-sticker">TU MATCH<br/>♥</span>
          <span className="easy-sticker">FÁCIL<br/>DE CUIDAR</span>
          <div className="hero-plant">🌿</div>
          <div className="poster-caption"><strong>MONSTERA</strong><span>Curiosa · Creativa · Independiente</span></div>
          <span className="adopt-stamp">ADOPTA<br/>DIGITALMENTE</span>
        </div>
      </section>

      <section className="how" id="como-funciona">
        <p>01 · Cuéntanos de tu espacio</p><p>02 · Descubre tu match</p><p>03 · Nómbrala y adopta</p>
      </section>

      <section className="test-section" id="test">
        <div className="section-heading"><span>TEST RÁPIDO</span><h2>¿Quién crecería bien contigo?</h2><p>Cuatro respuestas. Una nueva compañera verde.</p></div>
        <form className="match-form" onSubmit={submitAdoption}>
          <fieldset><legend>¿Cuánta luz recibe tu espacio?</legend><div className="option-row">
            {[['low','Poca'],['medium','Media'],['high','Mucha']].map(([v,l]) => <label key={v}><input type="radio" name="light" checked={answers.light===v} onChange={() => setAnswers({...answers, light:v as Answers['light']})}/><span>{l}</span></label>)}
          </div></fieldset>
          <fieldset><legend>¿Cómo te va con el riego?</legend><div className="option-row">
            {[['forgetful','Se me olvida'],['weekly','Una vez por semana'],['attentive','Soy muy pendiente']].map(([v,l]) => <label key={v}><input type="radio" name="water" checked={answers.water===v} onChange={() => setAnswers({...answers, water:v as Answers['water']})}/><span>{l}</span></label>)}
          </div></fieldset>
          <div className="two-fields">
            <label className="select-label">¿Tienes mascotas?<select value={answers.pets} onChange={(e)=>setAnswers({...answers,pets:e.target.value as Answers['pets']})}><option value="no">No</option><option value="yes">Sí</option></select></label>
            <label className="select-label">Tu experiencia<select value={answers.experience} onChange={(e)=>setAnswers({...answers,experience:e.target.value as Answers['experience']})}><option value="new">Soy principiante</option><option value="some">Ya he tenido plantas</option><option value="expert">Tengo mano verde</option></select></label>
          </div>
          <div className="result-card"><span className="result-icon">{match.icon}</span><div><small>TU MATCH ES</small><h3>{match.name}</h3><p>{match.traits}</p></div></div>
          <div className="name-fields">
            <label>Tu apodo público<input maxLength={24} value={adopterName} onChange={(e)=>setAdopterName(e.target.value)} placeholder="Ej. Luna" required/></label>
            <label>Nombre de tu planta<input maxLength={24} value={plantName} onChange={(e)=>setPlantName(e.target.value)} placeholder="Ej. Menta" required/></label>
          </div>
          <label className="honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off"/></label>
          <button className="submit-button" disabled={status === "sending"}>{status === "sending" ? "Guardando adopción…" : `Adoptar mi ${match.name} →`}</button>
          <p className={`form-message ${status}`}>{status === "success" && "¡Adopción registrada! Ya forma parte de la comunidad."}{status === "error" && "No pudimos guardar la adopción. Revisa la conexión con Supabase e inténtalo de nuevo."}</p>
        </form>
      </section>

      <section className="community" id="comunidad">
        <div className="community-title"><div><span>EN VIVO</span><h2>Adopciones recientes</h2></div><p>Una pequeña comunidad que no deja de crecer.</p></div>
        <div className="timeline">
          {adoptions.map((item, index) => <article className="adoption" key={item.id}><div className="plant-avatar" aria-hidden="true">{item.plant_type === "Sansevieria" ? "🌱" : item.plant_type === "Peperomia" ? "🪴" : "🌿"}</div><div><strong>{item.adopter_name} adoptó a {item.plant_name}</strong><span>{item.plant_type}</span><time dateTime={item.created_at}>{timeAgo(item.created_at)} · {localDateTime(item.created_at)} (hora local)</time></div><b className="timeline-number">{String(index + 1).padStart(2,"0")}</b></article>)}
        </div>
      </section>
      <footer><strong>PlantMatch</strong><span>Un proyecto ficticio sobre plantas reales.</span></footer>
    </main>
  );
}
