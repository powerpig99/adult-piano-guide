# The Adult Piano Companion: A Definitive Guide & Tool Matrix
*成人钢琴自学研习指南与工具全景 • A Self-Directed Musical Journey*

A minimal, elegant, bilingual digital companion (**English** | **中文**) for adult self-directed piano learners. Grounded in first-person agency, deliberate practice architectures, and the living philosophy of [Not a ToE](https://powerpig99.github.io/not-a-toe/) (*The Unobservable Driver of Learning*).

---

## 🌐 Bilingual Interactive Web Application

The companion runs as a zero-dependency, ultra-fast client-side SPA deployable on **GitHub Pages**, **Cloudflare Pages**, or **Vercel**.

- **Web Entrypoint**: [`index.html`](index.html)
- **Styling**: [`styles.css`](styles.css) (Ivory/Ebony minimal editorial aesthetics)
- **Application Controller**: [`app.js`](app.js) (Reactive filtering, routing, modal drawers & view transitions)

### Language Features
- **Clean Segmented Switcher**: Simple, minimal options: **Dual** (side-by-side comparative reading by default), **English**, or **中文**.
- **No Redundant Language Badges**: The language speaks for itself — zero clutter, no country flags, and no `EN` / `ZH` label tags.

---

## 📚 Companion Handbooks & Guides

> 🌐 **Live Web Version**: Read this complete companion online at [**powerpig99.github.io/adult-piano-guide**](https://powerpig99.github.io/adult-piano-guide/) or browse the [**Full Overview Webpage**](overview.html).

| Section | Document Webpage | Raw Source | Key Themes Covered |
| :--- | :--- | :--- | :--- |
| **01** | [**Philosophy & Agency**](https://powerpig99.github.io/adult-piano-guide/docs/01_philosophy_and_agency.html) ([Local HTML](docs/01_philosophy_and_agency.html)) | [.md](docs/01_philosophy_and_agency.md) | Dismantling the childhood prodigy dogma, the author's journey (from accompanying kids to solo mastery of *Passacaglia*), the internal causal lever (`+1` physical friction), and why tools are scaffolding, not the engine. |
| **02** | [**Tool Ecosystem Guide**](https://powerpig99.github.io/adult-piano-guide/docs/02_tool_ecosystem_guide.html) ([Local HTML](docs/02_tool_ecosystem_guide.html)) | [.md](docs/02_tool_ecosystem_guide.md) | Deep analysis of 30+ curated tools across 6 layers: Interactive Apps, Sheet Music Readers, Ear Training/Theory, YouTube Masterclasses, Method Books, and Hardware/Ergonomics. |
| **03** | [**Deliberate Practice Framework**](https://powerpig99.github.io/adult-piano-guide/docs/03_deliberate_practice_framework.html) ([Local HTML](docs/03_deliberate_practice_framework.html)) | [.md](docs/03_deliberate_practice_framework.md) | Adult neuroplasticity & myelin sheath formation, the 4-Stage Practice Cycle, Hands-Separate (HS) micro-chunking, Taubman biomechanics, arm weight, and sleep consolidation (PPI). |
| **04** | [**Adult Repertoire Ladder**](https://powerpig99.github.io/adult-piano-guide/docs/04_adult_repertoire_ladder.html) ([Local HTML](docs/04_adult_repertoire_ladder.html)) | [.md](docs/04_adult_repertoire_ladder.md) | 5 progressive levels featuring pieces adults love: Bach *Minuets*, Satie *Gymnopédie No. 1*, *Chengdu (成都)*, *Game of Thrones*, *Forrest Gump*, and Handel-Halvorsen *Passacaglia*. |

---

## 🚀 Quick Start Local Testing

Run a lightweight HTTP server inside the project folder:

```bash
cd /Users/jingliang/.gemini/antigravity/scratch/adult-piano-guide
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080) in your web browser.
