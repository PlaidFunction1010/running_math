// 高一-單元一-主題二：對數方程（示例）
export function getProblems(mode='5') {
  const problems = [
    {
      stemHtml: '求解：若 \\( \\log_2 x = 3 \\)，則 \\( x = ? \\)',
      answer: '8',
      validator: 'numeric',
      solutionMode: 'key-final',
      keySteps: ['\\log_2 x = 3 \\Rightarrow x = 2^3'],
      finalLatex: '8'
    },
    {
      stemHtml: '求解：\\( \\log_3 x = 1 \\Rightarrow x = ? \\)',
      answer: '3',
      validator: 'numeric',
      solutionMode: 'key-final',
      keySteps: ['\\log_3 x = 1 \\Rightarrow x = 3^1'],
      finalLatex: '3'
    }
  ];

  // Generate additional
  function randInt(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
  function makeRand(){
    const base = [2,3,5,10][randInt(0,3)];
    const k = randInt(1,5);
    const stemHtml = `求解：\\( \\log_{${base}} x = ${k} \\Rightarrow x = ? \\)`;
    const answer = String(base**k);
    return {
      stemHtml, answer, validator:'numeric', solutionMode:'key-final',
      keySteps:[`\\log_{${base}} x = ${k} \\Rightarrow x = ${base}^{${k}}`],
      finalLatex: `${base**k}`
    };
  }

  const want = mode === '10' ? 10 : 5;
  while (problems.length < want) problems.push(makeRand());
  return problems.slice(0, want);
}
