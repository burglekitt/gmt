import {
  createChartRuntime,
  renderChartSvg,
  defineChart,
  barX,
  barY,
} from "@tanstack/charts";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";

export function renderTestExecutionChart(): string {
  const data = [
    { library: "GMT", executions: 334020, highlight: true },
    { library: "@intl/date", executions: 386, highlight: false },
    { library: "Luxon", executions: 4888, highlight: false },
    { library: "date-fns", executions: 3213, highlight: false },
    { library: "Moment.js", executions: 11703, highlight: false },
  ];

  const definition = defineChart({
    marks: [
      barX(data, {
        y: "library",
        x: "executions",
        yScale: "y",
        xScale: "x",
        fill: (d) => (d as { highlight?: boolean }).highlight
          ? "var(--gmt-spring)"
          : "var(--gmt-teal)",
        fillOpacity: 0.35,
        stroke: "var(--gmt-border-strong)",
        strokeWidth: 1,
        radius: 2,
        inset: 2,
      }),
    ],
    scales: {
      x: { scale: scaleLinear, nice: true, grid: true },
      y: { scale: scaleBand, padding: 0.2 },
    },
  });

  const runtime = createChartRuntime();
  const scene = runtime.render(definition, { width: 640, height: 320 });
  const svg = renderChartSvg(scene, {
    ariaLabel: "CI test execution volume comparison",
    idPrefix: "test-executions",
  });
  runtime.destroy();
  return svg;
}

export function renderNamespaceChart(): string {
  const data = [
    { namespace: "plain", count: 223 },
    { namespace: "zoned", count: 119 },
    { namespace: "unix", count: 75 },
    { namespace: "utc", count: 75 },
    { namespace: "duration", count: 12 },
    { namespace: "regex", count: 22 },
  ];

  const definition = defineChart({
    marks: [
      barY(data, {
        x: "namespace",
        y: "count",
        xScale: "x",
        yScale: "y",
        fill: "var(--gmt-cyan)",
        fillOpacity: 0.35,
        stroke: "var(--gmt-border-strong)",
        strokeWidth: 1,
        radius: 2,
        inset: 2,
      }),
    ],
    scales: {
      x: { scale: scaleBand, padding: 0.15 },
      y: { scale: scaleLinear, nice: true, grid: true },
    },
  });

  const runtime = createChartRuntime();
  const scene = runtime.render(definition, { width: 640, height: 320 });
  const svg = renderChartSvg(scene, {
    ariaLabel: "API surface by namespace",
    idPrefix: "namespace-distribution",
  });
  runtime.destroy();
  return svg;
}

export const testExecutionSvg = renderTestExecutionChart();
export const namespaceDistributionSvg = renderNamespaceChart();
