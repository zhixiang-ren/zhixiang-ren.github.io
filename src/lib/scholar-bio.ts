interface ScholarMetrics {
  total_citations: number
  h_index: number
}

const numberFormat = new Intl.NumberFormat("en-US")

export const fillScholarBio = (template: string, metrics: ScholarMetrics) =>
  template
    .replaceAll("{{citations}}", numberFormat.format(metrics.total_citations))
    .replaceAll("{{hIndex}}", numberFormat.format(metrics.h_index))
