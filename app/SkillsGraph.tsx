"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

/* ══════════════════════════════════════════════════════════════════
   SKILL GRAPH

   The stack as a graph rather than a list, because the interesting
   claim is not which tools are known but which ones are used
   together — Go with gRPC and Kafka, Docker with Kubernetes with GCP,
   Prometheus with Grafana. A list flattens that; edges carry it.

   ── Colour ──
   The previous version gave each of the seven categories its own
   hex and hovering lit a node in it. That is eight colours in a
   palette that permits one. Structure is now carried entirely by
   position and edge weight, and the single accent is reserved for the
   hovered node and its immediate neighbours — so the accent answers a
   question ("what connects to this?") instead of decorating.

   ── Tone ──
   Every colour is written as `rgb(var(--ink-rgb) / a)` rather than a
   literal, so the graph inverts with whatever tone block it sits in.
   D3 writes these straight into attributes; they resolve at paint.
══════════════════════════════════════════════════════════════════ */

const INK = (a: number) => `rgb(var(--ink-rgb) / ${a})`;
const ACCENT = "var(--mark)";

const CATEGORIES = [
  { id: "lang", label: "Languages" },
  { id: "be", label: "Backend" },
  { id: "db", label: "Data" },
  { id: "infra", label: "Infra" },
  { id: "msg", label: "Messaging" },
  { id: "obs", label: "Observability" },
  { id: "ai", label: "AI & retrieval" },
  { id: "fe", label: "Frontend" },
] as const;

type CatId = (typeof CATEGORIES)[number]["id"];

const SKILLS: { id: string; label: string; cat: CatId }[] = [
  { id: "golang", label: "Go", cat: "lang" },
  { id: "cpp", label: "C++", cat: "lang" },
  { id: "ts", label: "TypeScript", cat: "lang" },
  { id: "java", label: "Java", cat: "lang" },
  { id: "python", label: "Python", cat: "lang" },
  { id: "nodejs", label: "Node.js", cat: "be" },
  { id: "spring", label: "Spring Boot", cat: "be" },
  { id: "grpc", label: "gRPC", cat: "be" },
  { id: "postgres", label: "PostgreSQL", cat: "db" },
  { id: "mongo", label: "MongoDB", cat: "db" },
  { id: "redis", label: "Redis", cat: "db" },
  { id: "docker", label: "Docker", cat: "infra" },
  { id: "k8s", label: "Kubernetes", cat: "infra" },
  { id: "gcp", label: "GCP", cat: "infra" },
  { id: "kafka", label: "Kafka", cat: "msg" },
  { id: "nats", label: "NATS JetStream", cat: "msg" },
  { id: "prometheus", label: "Prometheus", cat: "obs" },
  { id: "grafana", label: "Grafana", cat: "obs" },
  { id: "otel", label: "OpenTelemetry", cat: "obs" },
  { id: "pgvector", label: "pgvector", cat: "ai" },
  { id: "qdrant", label: "Qdrant", cat: "ai" },
  { id: "langchain", label: "LangChain", cat: "ai" },
  { id: "openai", label: "OpenAI API", cat: "ai" },
  { id: "rag", label: "RAG", cat: "ai" },
  { id: "react", label: "React", cat: "fe" },
  { id: "nextjs", label: "Next.js", cat: "fe" },
  { id: "tailwind", label: "Tailwind", cat: "fe" },
];

/* Edges that cross category boundaries — the ones that actually say
   something about how the work is put together. */
const CROSS_LINKS: [string, string][] = [
  ["golang", "grpc"],
  ["golang", "kafka"],
  ["golang", "nats"],
  ["golang", "prometheus"],
  ["golang", "redis"],
  ["ts", "react"],
  ["ts", "nextjs"],
  ["ts", "nodejs"],
  ["nodejs", "postgres"],
  ["nodejs", "mongo"],
  ["kafka", "nats"],
  ["docker", "k8s"],
  ["gcp", "k8s"],
  ["postgres", "redis"],
  ["grafana", "prometheus"],
  ["otel", "prometheus"],
  ["java", "spring"],
  ["nextjs", "tailwind"],
  ["cpp", "redis"],
  /* Retrieval sits across the existing stack rather than beside it,
     which is the point worth showing: the vector store is Postgres,
     the orchestration is Python, and RAG is the thing the other three
     add up to. */
  ["postgres", "pgvector"],
  ["python", "langchain"],
  ["langchain", "openai"],
  ["langchain", "qdrant"],
  ["rag", "langchain"],
  ["rag", "pgvector"],
  ["rag", "openai"],
];

type GNode = d3.SimulationNodeDatum & {
  id: string;
  label: string;
  isHub: boolean;
  r: number;
};
type GLink = d3.SimulationLinkDatum<GNode> & { cross: boolean };

export default function SkillsGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current!);
    const wrap = wrapRef.current!;

    const nodes: GNode[] = [
      ...CATEGORIES.map((c) => ({
        id: c.id,
        label: c.label,
        isHub: true,
        r: 5,
      })),
      ...SKILLS.map((s) => ({
        id: s.id,
        label: s.label,
        isHub: false,
        r: 3.5,
      })),
    ];

    const links: GLink[] = [
      ...SKILLS.map((s) => ({ source: s.cat, target: s.id, cross: false })),
      ...CROSS_LINKS.map(([a, b]) => ({ source: a, target: b, cross: true })),
    ];

    /* Adjacency, built once — recomputing it inside the hover handler
       would walk every edge on each mouse move. */
    const neighbours = new Map<string, Set<string>>();
    nodes.forEach((n) => neighbours.set(n.id, new Set()));
    [...SKILLS.map((s) => [s.cat, s.id] as const), ...CROSS_LINKS].forEach(
      ([a, b]) => {
        neighbours.get(a)?.add(b);
        neighbours.get(b)?.add(a);
      },
    );

    let sim: d3.Simulation<GNode, GLink> | null = null;

    const draw = () => {
      const width = wrap.clientWidth;
      const height = wrap.clientHeight;
      if (!width || !height) return;

      svg.selectAll("*").remove();
      svg.attr("viewBox", `0 0 ${width} ${height}`);

      const g = svg.append("g");

      const linkEl = g
        .append("g")
        .selectAll<SVGLineElement, GLink>("line")
        .data(links)
        .join("line")
        .attr("stroke", (l) => INK(l.cross ? 0.18 : 0.1))
        .attr("stroke-width", 1);

      const nodeEl = g
        .append("g")
        .selectAll<SVGGElement, GNode>("g")
        .data(nodes)
        .join("g")
        .attr("cursor", "pointer")
        .on("mouseenter", (_, d) => setHovered(d.id))
        .on("mouseleave", () => setHovered(null));

      nodeEl
        .append("circle")
        .attr("r", (d) => d.r)
        .attr("fill", (d) => INK(d.isHub ? 1 : 0.7));

      nodeEl
        .append("text")
        .text((d) => d.label)
        .attr("x", (d) => d.r + 7)
        .attr("y", 3.5)
        .attr("fill", (d) => INK(d.isHub ? 0.9 : 0.5))
        .attr("font-family", "var(--font-mono), monospace")
        .attr("font-size", (d) => (d.isHub ? 11 : 10))
        .attr("letter-spacing", "0.08em")
        .attr("text-transform", "uppercase");

      sim = d3
        .forceSimulation<GNode>(nodes)
        .force(
          "link",
          d3
            .forceLink<GNode, GLink>(links)
            .id((d) => d.id)
            // Cross-category edges are given more slack so the seven
            // clusters stay visually separate instead of collapsing
            // into one ball.
            .distance((l) => (l.cross ? 90 : 46))
            .strength((l) => (l.cross ? 0.12 : 0.7)),
        )
        .force("charge", d3.forceManyBody().strength(-230))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide<GNode>().radius(34))
        .on("tick", () => {
          linkEl
            .attr("x1", (l) => (l.source as GNode).x!)
            .attr("y1", (l) => (l.source as GNode).y!)
            .attr("x2", (l) => (l.target as GNode).x!)
            .attr("y2", (l) => (l.target as GNode).y!);
          nodeEl.attr("transform", (d) => `translate(${d.x},${d.y})`);
        });

      // Expose for the hover effect below without re-running the sim.
      svg.property("__linkEl", linkEl).property("__nodeEl", nodeEl);
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(wrap);

    return () => {
      sim?.stop();
      ro.disconnect();
    };
  }, []);

  /* Highlighting is a separate pass so hovering never restarts the
     simulation — the layout would jump on every mouse move. */
  useEffect(() => {
    const svg = d3.select(svgRef.current!);
    const linkEl = svg.property("__linkEl") as d3.Selection<
      SVGLineElement,
      GLink,
      SVGGElement,
      unknown
    > | null;
    const nodeEl = svg.property("__nodeEl") as d3.Selection<
      SVGGElement,
      GNode,
      SVGGElement,
      unknown
    > | null;
    if (!linkEl || !nodeEl) return;

    const isLinked = (l: GLink) => {
      const s = (l.source as GNode).id ?? (l.source as unknown as string);
      const t = (l.target as GNode).id ?? (l.target as unknown as string);
      return s === hovered || t === hovered;
    };

    linkEl
      .attr("stroke", (l) =>
        hovered && isLinked(l) ? ACCENT : INK(l.cross ? 0.18 : 0.1),
      )
      .attr("stroke-width", (l) => (hovered && isLinked(l) ? 1.6 : 1))
      .attr("opacity", (l) => (hovered && !isLinked(l) ? 0.35 : 1));

    nodeEl
      .select("circle")
      .attr("fill", (d) =>
        hovered === d.id ? ACCENT : INK(d.isHub ? 1 : 0.7),
      );

    nodeEl
      .select("text")
      .attr("fill", (d) =>
        hovered === d.id ? ACCENT : INK(d.isHub ? 0.9 : 0.5),
      )
      .attr("opacity", (d) =>
        hovered && hovered !== d.id && !isNeighbour(d.id) ? 0.3 : 1,
      );

    function isNeighbour(id: string) {
      if (!hovered) return false;
      const edges = [
        ...SKILLS.map((s) => [s.cat, s.id] as [string, string]),
        ...CROSS_LINKS,
      ];
      return edges.some(
        ([a, b]) => (a === hovered && b === id) || (b === hovered && a === id),
      );
    }
  }, [hovered]);

  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <span className="micro">Tools, and what they sit beside</span>
        <span className="micro num">
          {SKILLS.length} nodes · {SKILLS.length + CROSS_LINKS.length} edges
        </span>
      </div>

      <div
        ref={wrapRef}
        className="relative h-[460px] w-full border border-rule md:h-[580px]"
      >
        <svg ref={svgRef} className="h-full w-full select-none" />
      </div>

      <p className="copy mt-4 text-sm">
        Hover a node to trace what it connects to.
      </p>
    </div>
  );
}
