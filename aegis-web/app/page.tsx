
import { Shield, ArrowUpRight, Activity, LockKeyhole } from "lucide-react";

export default function Home() {
  return (
    <main style={{
      background: "#080808",
      color: "#f5f5f5",
      minHeight: "100vh",
      padding: "40px",
      fontFamily: "Arial, sans-serif"
    }}>
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #333",
        paddingBottom: "24px"
      }}>
        <h2 style={{ letterSpacing: "4px" }}>AEGIS<span style={{ color: "#888" }}> AI</span></h2>
        <span style={{ color: "#aaa", fontSize: "12px" }}>SECURITY INTELLIGENCE / 2026</span>
      </nav>

      <section style={{ marginTop: "100px", maxWidth: "900px" }}>
        <p style={{ color: "#999", letterSpacing: "3px", fontSize: "12px" }}>
          INTELLIGENCE WITHOUT UNRESTRICTED ACCESS
        </p>

        <h1 style={{
          fontSize: "clamp(52px, 8vw, 110px)",
          letterSpacing: "-5px",
          lineHeight: 1.05,
          fontWeight: 500,
          marginTop: "24px"
        }}>
          Security,
          <br />
          redefined<span style={{ color: "#888" }}>.</span>
        </h1>

        <p style={{ color: "#aaa", maxWidth: "520px", lineHeight: 1.8, marginTop: "32px" }}>
          Detect adversarial prompts. Protect sensitive actions.
          Build AI systems where intelligence never compromises control.
        </p>
      </section>

      <section style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "16px",
        marginTop: "100px"
      }}>
        {[
          { icon: <Shield />, title: "Threat Detection", desc: "Multilingual AI prompt classification" },
          { icon: <Activity />, title: "Security Analytics", desc: "Real-time threat intelligence" },
          { icon: <LockKeyhole />, title: "Protected Actions", desc: "Authorization powered by TideCloak" }
        ].map((item) => (
          <div key={item.title} style={{
            border: "1px solid #333",
            padding: "32px",
            borderRadius: "8px",
            background: "#111"
          }}>
            <div style={{ marginBottom: "32px", color: "#bbb" }}>{item.icon}</div>
            <h3 style={{ fontSize: "20px", marginBottom: "12px" }}>{item.title}</h3>
            <p style={{ color: "#888", fontSize: "14px" }}>{item.desc}</p>
            <ArrowUpRight size={18} style={{ marginTop: "32px", color: "#777" }} />
          </div>
        ))}
      </section>

      <footer style={{
        marginTop: "120px",
        borderTop: "1px solid #333",
        paddingTop: "24px",
        color: "#666",
        fontSize: "12px"
      }}>
        © 2026 AEGIS AI — RMIT HACKATHON
      </footer>
    </main>
  );
}
