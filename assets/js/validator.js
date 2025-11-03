export const Validator = {
  exact: (user, answer) => (user || '').trim() === (answer || '').trim(),
  numeric: (user, answer, tol=1e-6) => {
    try {
      const u = parseFloat(String(user).replace(/\s+/g,''));
      const a = parseFloat(String(answer).replace(/\s+/g,''));
      if (!Number.isFinite(u) || !Number.isFinite(a)) return false;
      return Math.abs(u - a) <= tol;
    } catch(e){ return false; }
  },
  algebraicLog: (u,a,t=1e-9)=>{ try{const U=parseFloat(u); const A=parseFloat(a); return Math.abs(U-A)<=t;}catch(e){return false;} }
};
export function pickValidator(kind){ switch(kind){ case 'numeric': return Validator.numeric; case 'algebraic': return Validator.algebraicLog; default: return Validator.exact; } }
