// Basic validators: exact, numeric. Algebraic (log rules) minimal support.
export const Validator = {
  exact: (user, answer) => (user || '').trim() === (answer || '').trim(),

  numeric: (user, answer, tol=1e-9) => {
    try {
      const u = evalNumeric(user);
      const a = evalNumeric(answer);
      return Math.abs(u - a) <= tol;
    } catch(e) { return false; }
  },

  algebraicLog: (user, answer, tol=1e-9) => {
    // Try numeric compare first
    if (Validator.numeric(user, answer, tol)) return true;
    // Minimal transforms: log_a b + log_a c -> log_a (b*c)
    const norm = (s) => s.replace(/\s+/g,'')
      .replace(/\\cdot/g,'*')
      .replace(/\\times/g,'*');
    const u = norm(user);
    const a = norm(answer);
    if (u === a) return true;
    // Could expand here with more rewrite rules...
    try {
      const U = evalNumeric(u);
      const A = evalNumeric(a);
      return Math.abs(U - A) <= tol;
    } catch(e) { return false; }
  }
};

// Very small numeric evaluator for common math/LaTeX tokens
function evalNumeric(expr) {
  if (expr == null) throw new Error('empty');
  let s = String(expr);
  s = s.replace(/\s+/g,'')
       .replace(/\\log_?\{?([0-9\.]+)\}?\s*([0-9\.]+)/g, (_,base,arg)=>`(Math.log(${arg})/Math.log(${base}))`)
       .replace(/\\ln\s*([0-9\.]+)/g, (_,arg)=>`(Math.log(${arg}))`)
       .replace(/\\sqrt\s*\{([^}]+)\}/g, (_,inside)=>`Math.sqrt(${inside})`)
       .replace(/\\pi/g, 'Math.PI')
       .replace(/\^/g,'**')
       .replace(/\\times/g,'*')
       .replace(/\\cdot/g,'*')
       .replace(/\{/g,'(').replace(/\}/g,')');
  // strip LaTeX inline math $...$
  s = s.replace(/\$+/g,'');
  // Basic safety: only allow [0-9 +-*\/.() Math letters]
  if (/[^0-9+\-*/()., A-Za-z_]/.test(s)) {
    // Fallback: try parseFloat if it's just a number-like
    const v = parseFloat(s);
    if (!Number.isFinite(v)) throw new Error('unsupported');
    return v;
  }
  // eslint-disable-next-line no-new-func
  const fn = new Function(`return (${s})`);
  const v = fn();
  if (!Number.isFinite(v)) throw new Error('NaN');
  return v;
}

export function pickValidator(kind) {
  switch (kind) {
    case 'exact': return Validator.exact;
    case 'numeric': return Validator.numeric;
    case 'algebraic': return Validator.algebraicLog;
    default: return Validator.exact;
  }
}
