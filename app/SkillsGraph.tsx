"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const CATEGORIES = [
  { id: "lang",  label: "Languages",     color: "#22c55e" },
  { id: "fe",    label: "Frontend",      color: "#34d399" },
  { id: "be",    label: "Backend",       color: "#14b8a6" },
  { id: "db",    label: "Databases",     color: "#10b981" },
  { id: "infra", label: "Infra",         color: "#a855f7" },
  { id: "msg",   label: "Messaging",     color: "#ec4899" },
  { id: "obs",   label: "Observability", color: "#f59e0b" },
] as const;

type CatId = typeof CATEGORIES[number]["id"];

const SKILLS: { id: string; label: string; cat: CatId }[] = [
  { id: "golang",     label: "Golang",         cat: "lang"  },
  { id: "cpp",        label: "C++",            cat: "lang"  },
  { id: "ts",         label: "TypeScript",     cat: "lang"  },
  { id: "java",       label: "Java",           cat: "lang"  },
  { id: "python",     label: "Python",         cat: "lang"  },
  { id: "react",      label: "React.js",       cat: "fe"    },
  { id: "nextjs",     label: "Next.js",        cat: "fe"    },
  { id: "tailwind",   label: "Tailwind",       cat: "fe"    },
  { id: "nodejs",     label: "Node.js",        cat: "be"    },
  { id: "express",    label: "Express",        cat: "be"    },
  { id: "fiber",      label: "Fiber",          cat: "be"    },
  { id: "spring",     label: "Spring Boot",    cat: "be"    },
  { id: "grpc",       label: "gRPC",           cat: "be"    },
  { id: "postgres",   label: "PostgreSQL",     cat: "db"    },
  { id: "mongo",      label: "MongoDB",        cat: "db"    },
  { id: "redis",      label: "Redis",          cat: "db"    },
  { id: "elastic",    label: "Elasticsearch",  cat: "db"    },
  { id: "docker",     label: "Docker",         cat: "infra" },
  { id: "k8s",        label: "Kubernetes",     cat: "infra" },
  { id: "gcp",        label: "GCP",            cat: "infra" },
  { id: "kafka",      label: "Kafka",          cat: "msg"   },
  { id: "nats",       label: "NATS JetStream", cat: "msg"   },
  { id: "prometheus", label: "Prometheus",     cat: "obs"   },
  { id: "grafana",    label: "Grafana",        cat: "obs"   },
  { id: "otel",       label: "OpenTelemetry",  cat: "obs"   },
];

const CROSS_LINKS: [string, string][] = [
  ["golang",   "grpc"],
  ["golang",   "kafka"],
  ["golang",   "prometheus"],
  ["ts",       "react"],
  ["ts",       "nextjs"],
  ["ts",       "nodejs"],
  ["nodejs",   "postgres"],
  ["nodejs",   "mongo"],
  ["kafka",    "nats"],
  ["docker",   "k8s"],
  ["gcp",      "k8s"],
  ["postgres", "redis"],
  ["grafana",  "prometheus"],
  ["java",     "spring"],
  ["nextjs",   "tailwind"],
];

type GNode = d3.SimulationNodeDatum & {
  id: string;
  label: string;
  cat: string;
  isHub: boolean;
  r: number;
  color: string;
};

type GLink = d3.SimulationLinkDatum<GNode> & {
  type: "hub" | "cross";
};

type Tooltip = {
  x: number;
  y: number;
  label: string;
  cat: string;
  color: string;
  isHub: boolean;
};

export default function SkillsGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current!);
    const container = containerRef.current!;

    const build = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      svg.selectAll("*").remove();
      svg.attr("width", width).attr("height", height);

      const catColorMap = Object.fromEntries(CATEGORIES.map(c => [c.id, c.color]));

      const nodes: GNode[] = [
        ...CATEGORIES.map(c => ({
          id: c.id, label: c.label, cat: c.id,
          isHub: true, r: 22, color: c.color,
        })),
        ...SKILLS.map(s => ({
          id: s.id, label: s.label, cat: s.cat,
          isHub: false, r: 11, color: catColorMap[s.cat],
        })),
      ];

      const links: GLink[] = [
        ...SKILLS.map(s => ({ source: s.cat, target: s.id, type: "hub" as const })),
        ...CROSS_LINKS.map(([a, b]) => ({ source: a, target: b, type: "cross" as const })),
      ];

      // Pre-build adjacency before D3 mutates link objects
      const adjacent = new Set<string>();
      SKILLS.forEach(s => {
        adjacent.add(`${s.cat}|${s.id}`);
        adjacent.add(`${s.id}|${s.cat}`);
      });
      CROSS_LINKS.forEach(([a, b]) => {
        adjacent.add(`${a}|${b}`);
        adjacent.add(`${b}|${a}`);
      });
      const connected = (a: string, b: string) => adjacent.has(`${a}|${b}`) || a === b;

      const g = svg.append("g");

      // Zoom
      svg.call(
        d3.zoom<SVGSVGElement, unknown>()
          .scaleExtent([0.35, 2.8])
          .on("zoom", ev => g.attr("transform", ev.transform))
      );

      // Simulation
      const sim = d3.forceSimulation<GNode>(nodes)
        .force("link", d3.forceLink<GNode, GLink>(links)
          .id(d => d.id)
          .distance(d => d.type === "hub" ? 75 : 110)
          .strength(d => d.type === "hub" ? 0.65 : 0.12))
        .force("charge", d3.forceManyBody<GNode>().strength(d => d.isHub ? -450 : -160))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide<GNode>().radius(d => d.r + 8))
        .alphaDecay(0.022);

      // Links
      const linkEl = g.append("g").selectAll<SVGLineElement, GLink>("line")
        .data(links).join("line")
        .attr("stroke", d => d.type === "hub" ? "rgba(34,197,94,0.14)" : "rgba(255,255,255,0.07)")
        .attr("stroke-width", d => d.type === "hub" ? 1 : 0.75)
        .attr("stroke-dasharray", d => d.type === "cross" ? "3,5" : "none");

      // Nodes
      const nodeEl = g.append("g").selectAll<SVGGElement, GNode>("g")
        .data(nodes).join("g")
        .attr("cursor", "grab");

      // Drag
      nodeEl.call(
        d3.drag<SVGGElement, GNode>()
          .on("start", (ev, d) => {
            if (!ev.active) sim.alphaTarget(0.3).restart();
            d.fx = d.x; d.fy = d.y;
          })
          .on("drag", (ev, d) => { d.fx = ev.x; d.fy = ev.y; })
          .on("end", (ev, d) => {
            if (!ev.active) sim.alphaTarget(0);
            d.fx = null; d.fy = null;
          })
      );

      // Outer ring for hubs
      nodeEl.filter(d => d.isHub).append("circle")
        .attr("r", d => d.r + 6)
        .attr("fill", "none")
        .attr("stroke", d => d.color + "30")
        .attr("stroke-width", 0.75)
        .attr("stroke-dasharray", "2,4");

      // Main circle
      nodeEl.append("circle")
        .attr("r", d => d.r)
        .attr("fill", d => d.color + (d.isHub ? "28" : "18"))
        .attr("stroke", d => d.color)
        .attr("stroke-width", d => d.isHub ? 1.5 : 1)
        .attr("opacity", 0)
        .transition().delay((_, i) => i * 18).duration(550)
        .attr("opacity", 1);

      // Label: inside hub circles, below skill circles
      nodeEl.append("text")
        .text(d => d.label)
        .attr("text-anchor", "middle")
        .attr("dy", d => d.isHub ? "0.35em" : d.r + 13)
        .attr("fill", d => d.isHub ? d.color : "#86efac")
        .attr("font-size", d => d.isHub ? "9.5px" : "8.5px")
        .attr("font-family", "monospace")
        .attr("font-weight", d => d.isHub ? "700" : "400")
        .attr("letter-spacing", "0.03em")
        .attr("pointer-events", "none")
        .attr("opacity", 0)
        .transition().delay((_, i) => i * 18 + 250).duration(400)
        .attr("opacity", 1);

      // Hover
      nodeEl
        .on("mouseover", function (ev, d) {
          nodeEl.transition().duration(120)
            .style("opacity", (o: GNode) => connected(d.id, o.id) ? "1" : "0.12");
          linkEl.transition().duration(120)
            .attr("stroke", (l: GLink) => {
              const s = (l.source as GNode).id ?? l.source as string;
              const t = (l.target as GNode).id ?? l.target as string;
              return (s === d.id || t === d.id) ? d.color : "rgba(34,197,94,0.03)";
            })
            .attr("stroke-width", (l: GLink) => {
              const s = (l.source as GNode).id ?? l.source as string;
              const t = (l.target as GNode).id ?? l.target as string;
              return (s === d.id || t === d.id) ? 2.5 : (l.type === "hub" ? 1 : 0.75);
            });
          const rect = container.getBoundingClientRect();
          setTooltip({
            x: ev.clientX - rect.left,
            y: ev.clientY - rect.top,
            label: d.label, cat: d.cat, color: d.color, isHub: d.isHub,
          });
        })
        .on("mousemove", ev => {
          const rect = container.getBoundingClientRect();
          setTooltip(p => p ? { ...p, x: ev.clientX - rect.left, y: ev.clientY - rect.top } : null);
        })
        .on("mouseout", () => {
          nodeEl.transition().duration(180).style("opacity", "1");
          linkEl.transition().duration(180)
            .attr("stroke", (l: GLink) => l.type === "hub" ? "rgba(34,197,94,0.14)" : "rgba(255,255,255,0.07)")
            .attr("stroke-width", (l: GLink) => l.type === "hub" ? 1 : 0.75);
          setTooltip(null);
        });

      // Tick
      sim.on("tick", () => {
        linkEl
          .attr("x1", d => (d.source as GNode).x ?? 0)
          .attr("y1", d => (d.source as GNode).y ?? 0)
          .attr("x2", d => (d.target as GNode).x ?? 0)
          .attr("y2", d => (d.target as GNode).y ?? 0);
        nodeEl.attr("transform", d => `translate(${d.x ?? 0},${d.y ?? 0})`);
      });

      return sim;
    };

    let sim = build();

    const ro = new ResizeObserver(() => {
      sim.stop();
      sim = build();
    });
    ro.observe(container);

    return () => { sim.stop(); ro.disconnect(); };
  }, []);

  const catLabel = tooltip
    ? CATEGORIES.find(c => c.id === tooltip.cat)?.label ?? ""
    : "";

  return (
    <div className="max-w-5xl mx-auto mt-10 md:mt-20 px-2 md:px-4">
      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-green-400/50 mb-3">
          TECH_ECOSYSTEM
        </span>
        <h2
          className="font-black uppercase text-white text-center"
          style={{
            fontFamily: "var(--font-orbitron, monospace)",
            fontSize: "clamp(1.6rem, 4vw, 3rem)",
            letterSpacing: "-0.02em",
          }}
        >
          Technical Ecosystem
        </h2>
        <p className="mt-2 font-mono text-[10px] text-green-300/40 tracking-wider">
          drag · scroll to zoom · hover to explore
        </p>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
          {CATEGORIES.map(c => (
            <span
              key={c.id}
              className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.25em]"
              style={{ color: c.color + "cc" }}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: c.color }} />
              {c.label}
            </span>
          ))}
        </div>
      </div>

      {/* Graph */}
      <div
        ref={containerRef}
        className="relative w-full h-[480px] md:h-[580px] bg-[#0d130f] border border-green-500/20 rounded-xl overflow-hidden shadow-[0_0_80px_-20px_rgba(34,197,94,0.20),0_0_20px_-5px_rgba(34,197,94,0.07)]"
      >
        <svg ref={svgRef} className="w-full h-full select-none" />

        {/* Tooltip */}
        {tooltip && (
          <div
            className="pointer-events-none absolute z-10 px-3 py-2 rounded-lg bg-[#11160f] border border-green-500/30 shadow-xl backdrop-blur-sm"
            style={{
              left: tooltip.x + 16,
              top: tooltip.y - 12,
              transform:
                tooltip.x > (containerRef.current?.clientWidth ?? 0) - 170
                  ? "translateX(-115%)"
                  : undefined,
            }}
          >
            <div className="font-mono font-semibold text-[11px]" style={{ color: tooltip.color }}>
              {tooltip.label}
            </div>
            {!tooltip.isHub && (
              <div className="font-mono text-[9px] text-green-400/60 mt-0.5">
                {catLabel}
              </div>
            )}
          </div>
        )}

        {/* Corner hint */}
        <div className="absolute bottom-3 right-4 font-mono text-[8px] text-green-500/15 uppercase tracking-widest pointer-events-none">
          25 technologies
        </div>
      </div>
    </div>
  );
}
