import { useState } from "react";
import "./index.css";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <header className="header">
        <div className="logo">⬡ REACT APP</div>
        <nav className="nav">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </nav>
      </header>

      <main className="main">
        <section className="hero">
          <div className="hero-tag">PRODUCTION READY</div>
          <h1 className="hero-title">
            Build something<br />
            <span className="accent">remarkable.</span>
          </h1>
          <p className="hero-sub">
            A minimal, opinionated React boilerplate with clean structure,
            modern tooling, and room to grow.
          </p>
          <div className="cta-row">
            <button className="btn-primary" onClick={() => setCount(c => c + 1)}>
              Clicked {count} {count === 1 ? "time" : "times"}
            </button>
            <button className="btn-ghost">Learn More →</button>
          </div>
        </section>

        <section className="features">
          {[
            { icon: "⚡", title: "Vite Powered", desc: "Lightning-fast HMR and build times out of the box." },
            { icon: "⚛", title: "React 18", desc: "Concurrent features, hooks, and modern React patterns." },
            { icon: "🎨", title: "Clean Styles", desc: "CSS variables, a minimal reset, and a ready-to-customize design system." },
            { icon: "📦", title: "Zero Bloat", desc: "Only what you need. No heavy dependencies baked in." },
          ].map(({ icon, title, desc }) => (
            <div className="card" key={title}>
              <div className="card-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="footer">
        <span>Built with React + Vite</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
