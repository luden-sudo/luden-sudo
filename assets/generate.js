// Generates the profile SVG assets in light and dark variants.
// Usage: node assets/generate.js assets
const fs = require("fs");
const path = require("path");
const out = process.argv[2];
fs.mkdirSync(out, { recursive: true });

const THEMES = {
  dark: {
    bg: "#0d1117", panel: "#161b22", bar: "#1c2330", border: "#30363d",
    text: "#e6edf3", muted: "#8b949e", prompt: "#14f1a5", accent: "#a78bfa", path: "#58a6ff",
  },
  light: {
    bg: "#ffffff", panel: "#f6f8fa", bar: "#eaeef2", border: "#d0d7de",
    text: "#1f2328", muted: "#57606a", prompt: "#0a8f63", accent: "#7c3aed", path: "#0969da",
  },
};

const MONO = "ui-monospace, SFMono-Regular, 'Cascadia Code', Consolas, 'Liberation Mono', Menlo, monospace";
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif";
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function terminal(t) {
  const W = 860;
  const lines = [
    { kind: "cmd", text: "whoami" },
    { kind: "out", parts: [["Luden", "text", true], [" · developer from Spain · ES / EN", "muted"]] },
    { kind: "cmd", text: "ls ~/projects" },
    { kind: "out", parts: [["luden.work   ClaimSolana   MinecraftServerBuilder   MultaRoleplay   DiscordStatus", "path"]] },
    { kind: "cmd", text: "cat now.txt" },
    { kind: "out", parts: [["Building web apps and exploring ", "text"], ["on-chain gaming on Solana", "accent", true]] },
  ];
  let y = 92;
  const rows = lines.map((l, i) => {
    const delay = (0.35 + i * 0.55).toFixed(2);
    let content;
    if (l.kind === "cmd") {
      content =
        `<tspan fill="${t.prompt}" font-weight="700">luden@spain</tspan>` +
        `<tspan fill="${t.muted}">:</tspan><tspan fill="${t.path}" font-weight="700">~</tspan>` +
        `<tspan fill="${t.muted}">$ </tspan><tspan fill="${t.text}">${esc(l.text)}</tspan>`;
    } else {
      content = l.parts
        .map(([s, c, b]) => `<tspan fill="${t[c]}"${b ? ' font-weight="700"' : ""}>${esc(s)}</tspan>`)
        .join("");
    }
    const row = `<text xml:space="preserve" class="r" style="animation-delay:${delay}s" x="32" y="${y}">${content}</text>`;
    y += l.kind === "cmd" ? 28 : 38;
    return row;
  });
  const cursorDelay = (0.35 + lines.length * 0.55).toFixed(2);
  const cursorY = y - 2;
  const H = cursorY + 26;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Terminal: Luden, developer from Spain">
<style>
  .r { opacity: 0; animation: in .45s ease-out forwards; }
  .c { opacity: 0; animation: in .2s forwards ${cursorDelay}s, blink 1.1s steps(1) infinite ${cursorDelay}s; }
  @keyframes in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
  @keyframes blink { 50% { opacity: 0; } }
  text { font-family: ${MONO}; font-size: 16px; }
  @media (prefers-reduced-motion: reduce) { .r, .c { animation: none; opacity: 1; } }
</style>
<defs>
  <linearGradient id="edge" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="${t.prompt}"/><stop offset="1" stop-color="${t.accent}"/>
  </linearGradient>
</defs>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="14" fill="${t.panel}" stroke="${t.border}"/>
<path d="M15 1h${W - 30}a14 14 0 0 1 14 14v29H1V15A14 14 0 0 1 15 1z" fill="${t.bar}"/>
<rect x="1" y="44" width="${W - 2}" height="2" fill="url(#edge)"/>
<circle cx="26" cy="23" r="6.5" fill="#ff5f57"/><circle cx="48" cy="23" r="6.5" fill="#febc2e"/><circle cx="70" cy="23" r="6.5" fill="#28c840"/>
<text x="${W / 2}" y="28" text-anchor="middle" fill="${t.muted}" style="font-size:13px">luden@spain: ~</text>
${rows.join("\n")}
<text class="c" x="32" y="${cursorY}"><tspan fill="${t.prompt}" font-weight="700">luden@spain</tspan><tspan fill="${t.muted}">:</tspan><tspan fill="${t.path}" font-weight="700">~</tspan><tspan fill="${t.muted}">$ </tspan><tspan fill="${t.prompt}">▋</tspan></text>
</svg>
`;
}

// Simple 24px line icons
const ICONS = {
  web: '<rect x="2" y="4" width="20" height="16" rx="2.5"/><path d="M2 9h20"/><circle cx="5.5" cy="6.5" r=".6"/><circle cx="8" cy="6.5" r=".6"/><path d="M9 14l-2 2 2 2M15 14l2 2-2 2"/>',
  desktop: '<rect x="2" y="3" width="20" height="13" rx="2"/><path d="M8 21h8M12 16v5"/><path d="M6 9l2.5 2L6 13M11 13h4"/>',
  block: '<path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/>',
  chain: '<path d="M10 13.5a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.2 1.2"/><path d="M14 10.5a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.2-1.2"/>',
};

function areas(t) {
  const W = 860, H = 178, gap = 14;
  const cw = (W - gap * 3) / 4;
  const cards = [
    ["web", "Web apps", "Apps web", "Next.js · Supabase"],
    ["desktop", "Desktop tools", "Herramientas", "Python · Tkinter"],
    ["block", "Minecraft", "Plugins", "Java · Spigot · Paper"],
    ["chain", "On-chain", "Solana", "TypeScript · Rust"],
  ];
  const body = cards
    .map(([icon, en, es, stack], i) => {
      const x = i * (cw + gap);
      const d = (0.15 + i * 0.18).toFixed(2);
      return `<g class="k" style="animation-delay:${d}s">
  <rect x="${x + 0.5}" y="0.5" width="${cw - 1}" height="${H - 1}" rx="14" fill="${t.panel}" stroke="${t.border}"/>
  <rect x="${x + 18}" y="0.5" width="${cw - 36}" height="3" rx="1.5" fill="url(#g)"/>
  <g transform="translate(${x + 20} 24) scale(1.25)" fill="none" stroke="${i % 2 ? t.accent : t.prompt}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICONS[icon]}</g>
  <text x="${x + 20}" y="96" fill="${t.text}" style="font:700 18px ${SANS}">${esc(en)}</text>
  <text x="${x + 20}" y="119" fill="${t.muted}" style="font:500 14px ${SANS}">${esc(es)}</text>
  <text x="${x + 20}" y="152" fill="${t.path}" style="font:500 12.5px ${MONO}">${esc(stack)}</text>
</g>`;
    })
    .join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="What I build: web apps, desktop tools, Minecraft plugins and Solana projects">
<style>
  .k { opacity: 0; animation: up .5s ease-out forwards; }
  @keyframes up { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  @media (prefers-reduced-motion: reduce) { .k { animation: none; opacity: 1; } }
</style>
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${t.prompt}"/><stop offset="1" stop-color="${t.accent}"/></linearGradient></defs>
${body}
</svg>
`;
}

for (const [name, t] of Object.entries(THEMES)) {
  fs.writeFileSync(path.join(out, `terminal-${name}.svg`), terminal(t));
  fs.writeFileSync(path.join(out, `areas-${name}.svg`), areas(t));
}
console.log("written");
