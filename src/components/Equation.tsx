import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface EquationProps {
  tex: string;
  /** Display (block) mode when true, inline when false */
  block?: boolean;
  className?: string;
}

/**
 * Normalises shorthand notation used in the catalog (x_max, θ_max, σ_θ)
 * into valid LaTeX (x_{max}, θ_{max}, σ_{θ}).
 */
const normalizeTex = (tex: string): string =>
  tex
    .replace(/_([A-Za-z0-9]+)/g, '_{$1}')
    .replace(/\\text\{([^}]*)\}/g, '\\text{$1}');

/**
 * Renders a LaTeX string with KaTeX. Falls back to the raw source
 * as plain mono text if rendering fails, so data typos never blank the page.
 */
export const Equation: React.FC<EquationProps> = ({ tex, block = true, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(normalizeTex(tex), {
        throwOnError: true,
        displayMode: block,
        trust: false,
        strict: false,
      });
    } catch {
      return null;
    }
  }, [tex, block]);

  if (html === null) {
    return <code className={`font-mono text-[13px] text-ink-2 ${className}`}>{tex}</code>;
  }

  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
};
