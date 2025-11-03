// 高一-單元一-主題一：對數運算（示例 3 題 + 生成）
export function getProblems(mode='5') {
  const base = [
    {
      stemHtml: '計算：\\( \\log_2 8 + \\log_2 4 \\)',
      answer: '5',
      validator: 'numeric',
      solutionMode: 'key-final',
      keySteps: ['\\log_2 8 = 3', '\\log_2 4 = 2', '3 + 2 = 5'],
      finalLatex: '5'
    },
    {
      stemHtml: '化簡：\\( \\log_3 9 - \\log_3 3 \\)',
      answer: '1',
      validator: 'numeric',
      solutionMode: 'key-final',
      keySteps: ['\\log_3 9 = 2', '\\log_3 3 = 1'],
      finalLatex: '1'
    },
    {
      stemHtml: '計算：\\( \\log_{10} 100 + \\log_{10} 0.01 \\)',
      answer: '0',
      validator: 'numeric',
      solutionMode: 'key-final',
      keySteps: ['\\log_{10} 100 = 2', '\\log_{10} 0.01 = -2'],
      finalLatex: '0'
    }
  ];

  // Simple generator for random a^k and a^m
  function randInt(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
  function makeRand() {
    const base = [2,3,5,10][randInt(0,3)];
    const k = randInt(1,4);
    const m = randInt(1,4);
    const stemHtml = `計算：\\( \\log_{${base}} ${base**k} + \\log_{${base}} ${base**m} \\)`;
    const answer = String(k + m);
    return {
      stemHtml, answer, validator:'numeric', solutionMode:'key-final',
      keySteps:[`\\log_{${base}} ${base**k} = ${k}`, `\\log_{${base}} ${base**m} = ${m}`],
      finalLatex: `${k+m}`
    };
  }

  const want = mode === '10' ? 10 : 5;
  while (base.length < want) base.push(makeRand());
  return base.slice(0, want);
}
