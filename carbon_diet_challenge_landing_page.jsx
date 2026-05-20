import { useState, useEffect } from 'react';

export default function CarbonChallengeLandingPage() {
  // 실시간 순위 및 핀볼 데이터 상태
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [stats, setStats] = useState({ totalParticipants: 0, totalActions: 0 });

  // 검색 & 당첨 확률 계산기 상태
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState(null);
  const [showCalcError, setShowCalcError] = useState(false);

  // 탄소 다이어트 등급 테스트(퀴즈) 상태
  const [quizStep, setQuizStep] = useState(0); // 0: 시작, 1~3: 질문, 4: 결과
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);

  // 홍보글 복사 알림 토스트 상태
  const [showToast, setShowToast] = useState(false);

  const products = [
    {
      name: '리뉴 업사이클링 3단 경량우산',
      winner: '1명',
      link: 'https://f-ridge.com/shop-fashion/?idx=353',
      emoji: '☂️',
    },
    {
      name: '감성 일러스트 머그컵',
      winner: '1명',
      link: 'https://f-ridge.com/shop-lifestyle/?idx=314',
      emoji: '☕',
    },
    {
      name: '홈카페 투명 유리컵 420ml',
      winner: '1명',
      link: 'https://f-ridge.com/shop-lifestyle/?idx=319',
      emoji: '🥛',
    },
    {
      name: '데일리 패턴 에코백',
      winner: '1명',
      link: 'https://f-ridge.com/shop-fashion/?idx=248',
      emoji: '👜',
    },
    {
      name: '재생펠트 키링 DIY 키트',
      winner: '3명',
      link: 'https://f-ridge.com/shop-edu/?idx=464',
      emoji: '🧸',
    },
  ];

  const steps = [
    {
      title: '탄소중립 실천',
      desc: '텀블러 사용, 분리배출, 에코백 사용 등 일상 속 쉬운 행동하기',
      number: '01',
      emoji: '🌱'
    },
    {
      title: '인증 사진 촬영',
      desc: '실천 내용과 내 정성이 명확히 보이게 사진 찰칵!',
      number: '02',
      emoji: '📸'
    },
    {
      title: '스토리 업로드',
      desc: '본인 인스타 스토리에 @fp.zero 태그하면 즉시 참여 완료',
      number: '03',
      emoji: '🏷️'
    },
  ];

  const quizQuestions = [
    {
      q: "일주일에 일회용 컵(플라스틱/종이)을 몇 번 사용하시나요?",
      a: [
        { text: "0회 (텀블러는 나의 소울메이트)", score: 10 },
        { text: "1 ~ 3회 (가끔 깜빡하고 두고 와요)", score: 5 },
        { text: "4회 이상 (하루 한 잔 일회용 컵 필수)", score: 1 }
      ]
    },
    {
      q: "배달 음식을 주문할 때 '일회용 수저/포크 안 받기'를 체크하시나요?",
      a: [
        { text: "항상 체크한다 (내 서랍에 쇠수저가 있으니!)", score: 10 },
        { text: "가끔 깜빡하거나 밖에서 먹을 땐 받는다", score: 5 },
        { text: "항상 받는다 (설거지가 세상에서 제일 귀찮음)", score: 1 }
      ]
    },
    {
      q: "마트나 편의점에 갈 때 에코백이나 장바구니를 챙기시나요?",
      a: [
        { text: "항상 챙겨 다닌다 (패션의 완성은 장바구니)", score: 10 },
        { text: "어쩌다 한 번 생각날 때만 챙긴다", score: 5 },
        { text: "그냥 가서 비닐봉투나 종이봉투를 산다", score: 1 }
      ]
    }
  ];

  // 인스타그램 아이디 마스킹 헬퍼 함수
  const maskUsername = (username) => {
    if (!username) return '';
    const hasAt = username.startsWith('@');
    const name = hasAt ? username.slice(1) : username;
    
    if (name.length <= 2) {
      return hasAt ? `@${name[0]}*` : `${name[0]}*`;
    }
    
    if (name.length <= 4) {
      return hasAt ? `@${name[0]}**${name[name.length - 1]}` : `${name[0]}**${name[name.length - 1]}`;
    }
    
    const keep = 2;
    const maskedLength = name.length - (keep * 2);
    const maskedMiddle = '*'.repeat(maskedLength > 0 ? maskedLength : 3);
    const result = name.slice(0, keep) + maskedMiddle + name.slice(-keep);
    
    return hasAt ? `@${result}` : result;
  };

  // 구글 스프레드시트 데이터 불러오기 함수
  const fetchLeaderboardData = async () => {
    setLoading(true);
    setError(false);
    try {
      const sheetUrl = 'https://docs.google.com/spreadsheets/d/18Pdxzr_LVyCUF3ck1KbyjAYsv3CK5yXQCVjbXb2SZGA/export?format=csv&gid=1526392803';
      const response = await fetch(sheetUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const csvText = await response.text();
      const lines = csvText.split(/\r?\n/);
      const parsedData = [];
      let headerFound = false;
      let totalApprovedActions = 0;

      for (const line of lines) {
        const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (!parts || parts.length < 3) continue;

        const col0 = parts[0].replace(/^"|"$/g, '').trim();
        const col1 = parts[1] ? parts[1].replace(/^"|"$/g, '').trim() : '';
        const col2 = parts[2] ? parts[2].replace(/^"|"$/g, '').trim() : '';
        const col3 = parts[3] ? parts[3].replace(/^"|"$/g, '').trim() : '';

        if (col0 === '순위') {
          headerFound = true;
          continue;
        }

        if (headerFound) {
          const rank = parseInt(col0, 10);
          const username = col1;
          const count = parseInt(col2, 10) || 0;
          const date = col3;

          if (isNaN(rank) && !username) continue;
          
          if (username && username.startsWith('@')) {
            parsedData.push({
              rank,
              rawUsername: username,
              username: maskUsername(username),
              count,
              date,
            });
            totalApprovedActions += count;
          }
        }
      }

      setLeaderboard(parsedData);
      setStats({
        totalParticipants: parsedData.length,
        totalActions: totalApprovedActions,
      });

      const now = new Date();
      setLastUpdated(
        `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(
          now.getDate()
        ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes()
        ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
      );
    } catch (err) {
      console.error('Error fetching sheets data:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  // 당첨 확률 계산 핸들러
  const handleCalcProbability = (e) => {
    e.preventDefault();
    setShowCalcError(false);
    setCalcResult(null);

    if (!calcInput.trim()) return;

    // 입력값 포맷팅 (앞에 @가 없으면 추가)
    let searchId = calcInput.trim();
    if (!searchId.startsWith('@')) {
      searchId = `@${searchId}`;
    }

    // 참가자 목록에서 아이디 검색
    const foundUser = leaderboard.find(
      (user) => user.rawUsername.toLowerCase() === searchId.toLowerCase()
    );

    if (!foundUser) {
      setShowCalcError(true);
      return;
    }

    // 당첨 확률 계산 (사용자 핀볼 수 / 전체 핀볼 수)
    // 핀볼 수 = 누적 인정 개수
    const userPinballs = foundUser.count;
    const totalPinballs = stats.totalActions;
    const probability = totalPinballs > 0 ? (userPinballs / totalPinballs) * 100 : 0;

    // 추가 1회 인증 시 예상 확률 계산
    const nextProb = totalPinballs > 0 ? ((userPinballs + 1) / (totalPinballs + 1)) * 100 : 0;

    setCalcResult({
      username: foundUser.rawUsername,
      maskedUsername: foundUser.username,
      rank: foundUser.rank,
      count: foundUser.count,
      probability: probability.toFixed(2),
      nextProb: nextProb.toFixed(2),
      diff: (nextProb - probability).toFixed(2),
    });
  };

  // 퀴즈 응답 처리
  const handleQuizAnswer = (score) => {
    const updatedAnswers = [...quizAnswers, score];
    setQuizAnswers(updatedAnswers);

    if (quizStep < quizQuestions.length) {
      setQuizStep(quizStep + 1);
    }

    // 모든 질문 완료 시 결과 계산
    if (quizStep + 1 > quizQuestions.length) {
      const totalScore = updatedAnswers.reduce((a, b) => a + b, 0);
      let grade = '';
      let desc = '';
      let emoji = '';

      if (totalScore >= 26) {
        grade = 'S';
        emoji = '🏆';
        desc = '대단해요! 이미 완벽한 탄소 절약 트레이너이십니다. 챌린지에 가볍게 동참해서 푸짐한 상품까지 독차지해 보세요!';
      } else if (totalScore >= 18) {
        grade = 'A';
        emoji = '🥑';
        desc = '아주 훌륭한 탄소 다이어터입니다! 조금만 실천을 더하면 탄소 제로에 도달할 수 있어요. 지금 챌린지에 도전해 당첨 확률도 쌓고 완벽한 A+ 등급이 되어볼까요?';
      } else if (totalScore >= 11) {
        grade = 'B';
        emoji = '🥗';
        desc = '일상의 평균 수준인 탄소 유지어터입니다! 우리 생활 속 아주 작은 변화만으로도 지구의 열을 내릴 수 있습니다. 챌린지에 인증샷 한 장 올리고 에코백 받아 가세요!';
      } else {
        grade = 'C';
        emoji = '🚨';
        desc = '주의 요망! 현재 탄소 벌크업 상태입니다. 당신이 배출한 일회용품이 지구의 체지방을 올리고 있어요! 지금 당장 텀블러를 들고 챌린지에 참전하여 탄소 감량을 시작하세요!';
      }

      setQuizResult({ grade, totalScore, desc, emoji });
      setQuizStep(4);
    }
  };

  // 퀴즈 초기화
  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers([]);
    setQuizResult(null);
  };

  // 에브리타임 홍보 글 텍스트 생성 및 복사
  const copyPromoText = () => {
    const activeUrl = window.location.href;
    const text = `🌱 [에타 화제의 챌린지] 커피 한 잔만 텀블러에 받아도 상품 쏟아짐!! 🎁

제 2기 경산시 탄소중립지원센터 퍼스트펭귄 팀이 진행하는 초간단 '탄소 다이어트 챌린지' 들어봤어??
귀찮은 절차 하나 없이 인스타 스토리에 인증샷 올리고 태그하면 참여 끝임 ㅋㅋㅋ

🔥 1등 특혜: 리뉴 업사이클링 우산, 머그컵, 홈카페 유리컵, 에코백 중 상품 1순위 우선 선택!
🎲 핀볼 추첨 방식: 인증 개수가 많을수록 핀볼 개수 늘어나서 당첨 확률 떡상함!
📊 실시간 내 순위랑 당첨 확률 계산해주는 댕꿀잼 계산기도 사이트에 있음!

👉 지금 내 등급 테스트해보고 순위 확인하기:
${activeUrl}

#퍼스트펭귄 #탄소다이어트챌린지 #에코캠퍼스`;

    navigator.clipboard.writeText(text).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }).catch(err => {
      console.error('클립보드 복사 실패:', err);
    });
  };

  const topThree = leaderboard.slice(0, 3);
  const restOfLeaderboard = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white antialiased">
      
      {/* 클립보드 복사 토스트 팝업 */}
      {showToast && (
        <div className="fixed bottom-8 right-8 z-50 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 animate-bounce border border-emerald-400">
          <span>✨ 홍보 문구가 클립보드에 복사되었습니다! 에타나 에브리타임에 붙여넣어 홍보해 보세요!</span>
        </div>
      )}

      {/* 히어로 섹션 */}
      <section className="relative px-6 py-28 md:px-16 text-center overflow-hidden bg-radial-gradient">
        {/* 네온 조명 배경 효과 */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-950/25 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[45%] h-[45%] bg-teal-900/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/50 text-emerald-400 px-5 py-2.5 rounded-full text-xs font-bold tracking-wide uppercase mb-8 shadow-inner">
            🌍 제 2기 경산시 탄소중립지원센터 퍼스트펭귄 팀
          </div>

          <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight leading-none mb-8 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 filter drop-shadow-sm">
            탄소 다이어트
            <br />
            챌린지
          </h1>

          <p className="text-lg md:text-2xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-12">
            일상 속 작은 탄소중립 실천 한 장으로
            <br />
            환경도 지키고, <span className="text-emerald-400 font-bold">감성 넘치는 친환경 상품</span>도 받아가세요!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16">
            <a
              href="https://www.instagram.com/fp.zero/"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-lg font-black tracking-wide shadow-[0_0_30px_rgba(16,185,129,0.3)] transition transform hover:-translate-y-1 active:translate-y-0 text-center"
            >
              📸 1초만에 인증하고 시작하기
            </a>

            <a
              href="#live-leaderboard"
              className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-slate-800/80 border border-slate-700 hover:bg-slate-700 text-slate-200 text-lg font-bold transition shadow-md hover:-translate-y-1 active:translate-y-0 text-center"
            >
              🏆 내 당첨확률 & 순위 조회
            </a>
          </div>

          {/* 핵심 지표 요약 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-16 text-left">
            <div className="bg-slate-800/40 backdrop-blur-md rounded-3xl p-8 border border-slate-700/50 shadow-xl hover:border-emerald-500/30 transition group">
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition">🎁</div>
              <h3 className="text-xl font-bold mb-2 text-slate-100 group-hover:text-emerald-400 transition">총 7명 무조건 선정</h3>
              <p className="text-slate-400 text-sm leading-relaxed">핀볼 추첨과 최다 인증 특혜로 전원 친환경 감성 굿즈 증정!</p>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-md rounded-3xl p-8 border border-slate-700/50 shadow-xl hover:border-emerald-500/30 transition group">
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition">🎲</div>
              <h3 className="text-xl font-bold mb-2 text-slate-100 group-hover:text-emerald-400 transition">공정한 핀볼 확률</h3>
              <p className="text-slate-400 text-sm leading-relaxed">인증 사진 1개당 핀볼 추첨권 +1개 획득! 올리면 올릴수록 확률 업!</p>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-md rounded-3xl p-8 border border-slate-700/50 shadow-xl hover:border-emerald-500/30 transition group">
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition">🔥</div>
              <h3 className="text-xl font-bold mb-2 text-slate-100 group-hover:text-emerald-400 transition">지금 시작해도 역전</h3>
              <p className="text-slate-400 text-sm leading-relaxed">핀볼 시스템이므로 단 1개의 인증만 올려도 추첨 대상이 됩니다!</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🧠 1단계: 탄소 다이어트 등급 테스트 (방문자 흥미 유발 퀴즈) */}
      <section className="px-6 py-24 md:px-16 bg-slate-900 border-y border-slate-800 relative">
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-emerald-950/15 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest block mb-3">Eco Carbon Test</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              내 일상 속 탄소 등급은?
            </h2>
            <p className="text-slate-400">
              초간단 3개 질문으로 지구 온도를 올리는 내 탄소 등급을 확인해 보세요!
            </p>
          </div>

          <div className="bg-gradient-to-b from-slate-800/60 to-slate-900/60 border border-slate-700/60 rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-md">
            
            {/* 퀴즈 대기 화면 */}
            {quizStep === 0 && (
              <div className="text-center py-6">
                <div className="text-6xl mb-6">🥑</div>
                <h3 className="text-2xl font-bold mb-4">탄소 다이어트 체지방 테스트</h3>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                  나는 지구를 구하는 프로 다이어터일까요, 아니면 탄소 축적왕일까요? 지금 바로 검사해 보세요!
                </p>
                <button
                  onClick={() => setQuizStep(1)}
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl transition shadow-lg shadow-emerald-500/20"
                >
                  🚀 테스트 시작하기
                </button>
              </div>
            )}

            {/* 퀴즈 진행 질문 화면 */}
            {quizStep >= 1 && quizStep <= 3 && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <span className="text-xs text-emerald-400 font-bold tracking-widest">QUESTION 0{quizStep}</span>
                  <span className="text-xs text-slate-500 font-bold">{quizStep}/3</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full mb-8 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${(quizStep / 3) * 100}%` }}
                  ></div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-8 text-slate-100">
                  {quizQuestions[quizStep - 1].q}
                </h3>
                <div className="space-y-4">
                  {quizQuestions[quizStep - 1].a.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuizAnswer(option.score)}
                      className="w-full text-left px-6 py-5 rounded-2xl bg-slate-800/50 hover:bg-slate-700/80 border border-slate-700/60 hover:border-emerald-500/40 text-slate-300 hover:text-slate-100 font-semibold transition flex justify-between items-center group"
                    >
                      <span>{option.text}</span>
                      <span className="opacity-0 group-hover:opacity-100 text-emerald-400 transition pl-4">선택 →</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 퀴즈 결과 화면 */}
            {quizStep === 4 && quizResult && (
              <div className="text-center py-4">
                <div className="text-7xl mb-4 animate-bounce">{quizResult.emoji}</div>
                <span className="text-xs text-emerald-400 font-black tracking-widest block mb-2">당신의 탄소 지수 결과</span>
                <h3 className="text-3xl md:text-5xl font-black mb-6 text-slate-100">
                  등급: <span className="text-emerald-400 font-extrabold">{quizResult.grade}</span>
                </h3>
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 mb-8 text-left max-w-xl mx-auto">
                  <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                    {quizResult.desc}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a
                    href="https://www.instagram.com/fp.zero/"
                    target="_blank"
                    rel="noreferrer"
                    className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl transition shadow-lg text-center"
                  >
                    🌱 즉시 챌린지 신청하고 등급 올리기
                  </a>
                  <button
                    onClick={resetQuiz}
                    className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl border border-slate-700 transition"
                  >
                    🔄 다시 테스트하기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 리워드(상품) 섹션 */}
      <section className="px-6 py-24 md:px-16 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest block mb-3">CHALLENGE REWARD</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              가장 탐나는 역대급 친환경 라인업
            </h2>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
              경산시 탄소중립지원센터 퍼스트펭귄 팀이 엄선한, 일상의 감성을 더해줄 하이엔드 업사이클링 및 제로웨이스트 상품들입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <a
                key={index}
                href={product.link}
                target="_blank"
                rel="noreferrer"
                className="group bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-800 hover:border-emerald-500/30 rounded-[32px] p-8 shadow-lg hover:shadow-2xl transition duration-300 hover:-translate-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="text-6xl mb-6 transform group-hover:scale-110 transition duration-300 block origin-left">{product.emoji}</div>
                  <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-bold mb-4 shadow-sm">
                    {product.winner} 당첨
                  </div>
                  <h3 className="text-2xl font-bold leading-tight mb-3 text-slate-100 group-hover:text-emerald-400 transition">
                    {product.name}
                  </h3>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold group-hover:text-emerald-500 transition">자세히 보기</span>
                  <span className="text-emerald-500 transform translate-x-[-10px] group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition duration-300 font-bold">→</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 참여 방법 섹션 (비주얼 강화) */}
      <section className="px-6 py-24 md:px-16 bg-slate-900 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest block mb-3">HOW TO JOIN</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              단 10초 만에 끝나는 참여 프로세스
            </h2>
            <p className="text-slate-400 mt-4">
              별도의 양식이나 가입 없이, 오직 인스타그램 스토리 하나로 참여가 집계됩니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-xl relative hover:border-emerald-500/20 transition group overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 text-8xl font-black text-slate-800/10 pointer-events-none group-hover:text-slate-800/25 transition">
                  {step.number}
                </div>
                <div className="text-5xl mb-6">{step.emoji}</div>
                <h3 className="text-2xl font-bold mb-4 text-slate-100">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm md:text-base">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 2단계: 나의 핀볼 당첨 확률 계산기 & 랭킹 조회 (스프레드시트 실시간 연동) */}
      <section id="live-leaderboard" className="px-6 py-24 md:px-16 bg-slate-950 relative">
        <div className="absolute bottom-[10%] left-[-10%] w-[35%] h-[35%] bg-emerald-950/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold mb-4 uppercase tracking-widest">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              LIVE 실시간 통계 보드
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              참여자 순위 및 당첨 확률 계산기
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              현재 참여 중인 인스타그램 아이디를 입력하여 실시간 내 순위와 **실제 핀볼 당첨 확률**을 1초 만에 확인해 보세요!
            </p>
          </div>

          {/* 실시간 라이브 요약 지표 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-slate-800/40 border border-slate-700/40 rounded-3xl p-6 text-center backdrop-blur-md shadow-lg">
              <span className="text-xs text-slate-500 font-bold block mb-1">총 참가자 수</span>
              <span className="text-4xl font-extrabold text-emerald-400">{loading ? '...' : `${stats.totalParticipants}명`}</span>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/40 rounded-3xl p-6 text-center backdrop-blur-md shadow-lg">
              <span className="text-xs text-slate-500 font-bold block mb-1">총 누적 인정 횟수 (핀볼수)</span>
              <span className="text-4xl font-extrabold text-emerald-400">{loading ? '...' : `${stats.totalActions}개`}</span>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/40 rounded-3xl p-6 text-center backdrop-blur-md shadow-lg col-span-2 md:col-span-1">
              <span className="text-xs text-slate-500 font-bold block mb-1">마지막 자동 업데이트</span>
              <span className="text-sm font-semibold text-emerald-400 block mt-2 break-all">{loading ? '가져오는 중...' : lastUpdated || '기록 없음'}</span>
            </div>
          </div>

          {/* 🔍 실시간 당첨 확률 조회 영역 */}
          <div className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 border border-slate-700/60 rounded-[32px] p-8 md:p-10 shadow-2xl max-w-3xl mx-auto mb-16 backdrop-blur-md">
            <h3 className="text-2xl font-bold mb-6 text-slate-100 text-center flex items-center justify-center gap-2">
              🎯 나의 핀볼 당첨 확률은 몇 %일까?
            </h3>
            
            <form onSubmit={handleCalcProbability} className="flex flex-col sm:flex-row gap-4 mb-6">
              <input
                type="text"
                value={calcInput}
                onChange={(e) => setCalcInput(e.target.value)}
                placeholder="인스타그램 아이디 입력 (예: @fp.zero)"
                className="flex-1 px-6 py-4 rounded-2xl bg-slate-950 border border-slate-700/80 focus:border-emerald-500 text-slate-200 placeholder:text-slate-600 focus:outline-none font-semibold transition"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl transition disabled:opacity-50 tracking-wide"
              >
                {loading ? '데이터 로딩 중...' : '확률 확인하기'}
              </button>
            </form>

            {/* 에러 상태 */}
            {showCalcError && (
              <div className="text-red-400 text-sm font-bold text-center bg-red-950/30 border border-red-900/40 rounded-2xl p-4 animate-shake">
                ⚠️ 입력하신 인스타 아이디를 찾을 수 없습니다. 아이디를 정확히 입력했는지, 혹은 첫 인증 스토리가 확인되었는지 점검해 주세요!
              </div>
            )}

            {/* 확률 계산 결과 화면 */}
            {calcResult && (
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 mt-6 animate-fadeIn">
                <div className="text-center mb-6 pb-6 border-b border-slate-800">
                  <span className="text-xs text-emerald-400 font-bold block mb-1">SEARCH ID: {calcResult.username}</span>
                  <h4 className="text-3xl font-black text-slate-100">
                    현재 순위: <span className="text-emerald-400">{calcResult.rank}위</span>
                  </h4>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm md:text-base">
                    <span className="text-slate-400 font-semibold">내 누적 인증 개수</span>
                    <span className="text-slate-100 font-black">{calcResult.count}개 (핀볼 {calcResult.count}개)</span>
                  </div>

                  <div className="flex justify-between items-center text-sm md:text-base">
                    <span className="text-slate-400 font-semibold">나의 당첨 확률</span>
                    <span className="text-emerald-400 text-2xl font-black">{calcResult.probability}%</span>
                  </div>

                  <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden mt-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full"
                      style={{ width: `${Math.min(parseFloat(calcResult.probability) * 3, 100)}%` }}
                    ></div>
                  </div>

                  <div className="bg-emerald-950/30 border border-emerald-900/40 rounded-xl p-4 mt-4 text-xs md:text-sm text-emerald-300 leading-relaxed text-center font-semibold">
                    💡 인증을 <span className="underline">1개 더 획득하면</span> 내 핀볼 확률이 <span className="text-white text-base font-bold">{calcResult.nextProb}%</span>로 상승하여 약 <span className="text-white text-base font-bold">+{calcResult.diff}%p</span> 증가합니다!
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 에러 상태 표시 */}
          {error && (
            <div className="bg-red-950/20 border border-red-900/40 rounded-3xl p-8 text-center max-w-2xl mx-auto mb-10">
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="text-xl font-bold text-red-400 mb-2">실시간 데이터를 가져오지 못했습니다</h3>
              <p className="text-slate-400 mb-6">
                구글 스프레드시트 업데이트 오류 또는 네트워크 장비 문제로 인해 순위를 표시할 수 없습니다. 원본 보기를 이용하여 데이터를 확인해 주세요.
              </p>
              <button
                onClick={fetchLeaderboardData}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition"
              >
                🔄 다시 불러오기
              </button>
            </div>
          )}

          {/* 테이블 로딩 */}
          {loading && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="grid grid-cols-3 gap-4 h-48 items-end max-w-xl mx-auto mb-10">
                <div className="bg-slate-800/40 animate-pulse rounded-2xl h-36 border border-slate-700/20"></div>
                <div className="bg-slate-800 animate-pulse rounded-2xl h-44 border border-slate-700/20"></div>
                <div className="bg-slate-800/40 animate-pulse rounded-2xl h-32 border border-slate-700/20"></div>
              </div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex justify-between items-center animate-pulse">
                    <div className="h-6 w-12 bg-slate-800 rounded-md"></div>
                    <div className="h-6 w-32 bg-slate-800 rounded-md"></div>
                    <div className="h-6 w-16 bg-slate-800 rounded-md"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 실시간 포디움 및 랭킹 목록 */}
          {!loading && !error && leaderboard.length > 0 && (
            <div className="max-w-4xl mx-auto space-y-12">
              
              {/* TOP 3 포디움 */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-end justify-center gap-6 max-w-2xl mx-auto">
                
                {/* 2등 실버 포디움 */}
                {topThree[1] && (
                  <div className="order-2 sm:order-1 flex-1 bg-gradient-to-b from-slate-800/60 to-slate-900/60 border-2 border-slate-700/60 rounded-3xl p-6 shadow-xl hover:scale-[1.03] transition duration-300 text-center relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                    <div className="absolute top-0 right-0 left-0 bg-slate-700/20 py-1.5 text-[10px] font-black text-slate-300 tracking-widest uppercase">2nd Place</div>
                    <div className="text-4xl mt-6 mb-2">🥈</div>
                    <h4 className="text-xl font-bold truncate text-slate-100">{topThree[1].username}</h4>
                    <div>
                      <span className="text-3xl font-extrabold text-emerald-400">{topThree[1].count}</span>
                      <span className="text-sm text-slate-400"> 개의 인증</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 font-medium">최초인증: {topThree[1].date?.split(' ')[0] || ''}</p>
                  </div>
                )}

                {/* 1등 골드 포디움 */}
                {topThree[0] && (
                  <div className="order-1 sm:order-2 flex-1 bg-gradient-to-b from-emerald-950/40 to-slate-900/80 border-2 border-emerald-500 rounded-[32px] p-8 shadow-2xl hover:scale-[1.05] transition duration-300 text-center relative overflow-hidden flex flex-col justify-between min-h-[270px] ring-8 ring-emerald-500/10">
                    <div className="absolute top-0 right-0 left-0 bg-emerald-500/20 py-1.5 text-xs font-black text-emerald-300 tracking-widest uppercase">LEADER</div>
                    <div className="text-5xl mt-6 mb-2">👑 🥇</div>
                    <h4 className="text-2xl font-black truncate text-slate-100">{topThree[0].username}</h4>
                    <div>
                      <span className="text-4xl font-black text-emerald-400">{topThree[0].count}</span>
                      <span className="text-sm text-emerald-200 font-bold"> 개의 인증</span>
                    </div>
                    <p className="text-[10px] text-emerald-500/70 mt-2 font-semibold">최초인증: {topThree[0].date?.split(' ')[0] || ''}</p>
                  </div>
                )}

                {/* 3등 브론즈 포디움 */}
                {topThree[2] && (
                  <div className="order-3 sm:order-3 flex-1 bg-gradient-to-b from-slate-800/60 to-slate-900/60 border-2 border-slate-700/60 rounded-3xl p-6 shadow-xl hover:scale-[1.03] transition duration-300 text-center relative overflow-hidden flex flex-col justify-between min-h-[200px]">
                    <div className="absolute top-0 right-0 left-0 bg-orange-950/20 py-1.5 text-[10px] font-black text-orange-300 tracking-widest uppercase">3rd Place</div>
                    <div className="text-4xl mt-6 mb-2">🥉</div>
                    <h4 className="text-xl font-bold truncate text-slate-100">{topThree[2].username}</h4>
                    <div>
                      <span className="text-3xl font-extrabold text-emerald-400">{topThree[2].count}</span>
                      <span className="text-sm text-slate-400"> 개의 인증</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 font-medium">최초인증: {topThree[2].date?.split(' ')[0] || ''}</p>
                  </div>
                )}

              </div>

              {/* 4등 이하 순위 리스트 */}
              {restOfLeaderboard.length > 0 && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-xl max-w-3xl mx-auto">
                  <div className="bg-slate-950 px-6 py-4 grid grid-cols-12 text-xs font-black text-slate-500 uppercase tracking-widest text-center border-b border-slate-800">
                    <div className="col-span-2">순위</div>
                    <div className="col-span-6 text-left pl-6">인스타그램 아이디</div>
                    <div className="col-span-4">인정(O) 개수</div>
                  </div>
                  <div className="divide-y divide-slate-800/50">
                    {restOfLeaderboard.map((item, index) => (
                      <div
                        key={index}
                        className="px-6 py-4 grid grid-cols-12 items-center text-center hover:bg-slate-800/20 transition group"
                      >
                        <div className="col-span-2 text-lg font-black text-slate-600 group-hover:text-slate-300 transition">
                          {item.rank}
                        </div>
                        <div className="col-span-6 text-left pl-6 font-bold text-slate-300 truncate">
                          {item.username}
                        </div>
                        <div className="col-span-4 font-black">
                          <span className="px-3.5 py-1.5 bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 rounded-full text-xs font-black shadow-inner">
                            {item.count}개
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && !error && leaderboard.length === 0 && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto">
              <div className="text-6xl mb-4">🏁</div>
              <h3 className="text-xl font-bold text-slate-200 mb-2">아직 인증 참가자가 없습니다</h3>
              <p className="text-slate-500 mb-6">첫 스토리 인증샷을 업로드하고 1위를 차지해 보세요!</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">
            <button
              onClick={fetchLeaderboardData}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
            >
              🔄 실시간 정보 동기화
            </button>

            <a
              href="https://docs.google.com/spreadsheets/d/18Pdxzr_LVyCUF3ck1KbyjAYsv3CK5yXQCVjbXb2SZGA/edit?gid=1270585109#gid=1270585109"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl text-center shadow-md transition"
            >
              📊 구글 시트 원본 보드 보기
            </a>
          </div>
        </div>
      </section>

      {/* 📣 3단계: 바이럴 공유 & 에타/인스타 홍보 극대화 섹션 */}
      <section className="px-6 py-24 md:px-16 bg-slate-900 border-y border-slate-800 relative">
        <div className="absolute top-0 left-0 w-64 h-64 bg-teal-950/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest block mb-3">VIRAL & SHARING</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              에타 & 인스타로 친구들과 함께해요!
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              친구들을 초대해 탄소 다이어트 챌린지를 알려주세요! 원클릭 공유와 멋진 인스타 템플릿이 준비되어 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            
            {/* 에브리타임 전용 홍보글 생성 카드 */}
            <div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8 md:p-10 shadow-2xl flex flex-col justify-between">
              <div>
                <span className="text-red-400 font-black text-xs uppercase tracking-widest block mb-3">Everytime Copy Box</span>
                <h3 className="text-2xl font-bold mb-4 text-slate-100 flex items-center gap-2">
                  🏫 에브리타임(에타)용 원클릭 홍보글
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  에브리타임 게시판에 간편하게 공유할 수 있는 **이모지 맞춤형 게시물 내용**을 클릭 한 번으로 복사하여 자유롭게 홍보글을 올려보세요!
                </p>
                
                {/* 시각적인 게시물 모형 디자인 */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-xs text-slate-400 leading-relaxed font-mono select-none overflow-hidden max-h-[220px] relative">
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900 to-transparent"></div>
                  <span className="text-emerald-400 font-bold block mb-2">🌱 [에타 화제의 챌린지] 커피 한 잔만 텀블러에 받아도 상품 쏟아짐!! 🎁</span>
                  제 2기 경산시 탄소중립지원센터 퍼스트펭귄 팀이 진행하는 초간단 '탄소 다이어트 챌린지' 들어봤어??
                  <br />귀찮은 절차 하나 없이 인스타 스토리에 인증샷 올리고 태그하면 참여 끝임 ㅋㅋㅋ
                  <br /><br />🔥 1등 특혜: 리뉴 업사이클링 우산, 머그컵, 홈카페 유리컵, 에코백 중 상품 1순위 우선 선택!
                  <br />🎲 핀볼 추첨 방식: 인증 개수가 많을수록 핀볼 개수 늘어나서 당첨 확률 떡상함!
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={copyPromoText}
                  className="w-full px-8 py-5 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/40 hover:bg-red-500 hover:text-slate-950 text-red-400 font-black rounded-2xl transition shadow-lg text-center flex items-center justify-center gap-2 group"
                >
                  🚀 에타 홍보글 클립보드에 복사하기 <span className="group-hover:translate-x-1 transition font-mono">→</span>
                </button>
              </div>
            </div>

            {/* 인스타그램 스토리 템플릿 다운로드 카드 */}
            <div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8 md:p-10 shadow-2xl flex flex-col justify-between">
              <div>
                <span className="text-emerald-400 font-black text-xs uppercase tracking-widest block mb-3">Instagram Story Template</span>
                <h3 className="text-2xl font-bold mb-4 text-slate-100 flex items-center gap-2">
                  📸 인스타 스토리 업로드용 공식 템플릿
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  퍼스트펭귄의 **공식 인스타그램 템플릿 이미지**를 다운로드하여 나만의 멋진 탄소 다이어트 실천 사진을 올리고 태그해보세요!
                </p>
                
                {/* 템플릿 이미지 썸네일 */}
                <div className="relative group/thumb overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 flex justify-center items-center p-4 h-[220px]">
                  <img
                    src="/story_template.png"
                    alt="Instagram Story Template Preview"
                    className="h-full object-contain rounded shadow-lg group-hover/thumb:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/thumb:opacity-100 transition flex items-center justify-center pointer-events-none">
                    <span className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl text-xs font-bold text-slate-200">템플릿 이미지</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href="/story_template.png"
                  download="carbon_diet_story_template.png"
                  className="w-full px-8 py-5 bg-gradient-to-r from-emerald-500/20 to-teal-600/20 border border-emerald-500/40 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 font-black rounded-2xl transition shadow-lg text-center flex items-center justify-center gap-2 group"
                >
                  📥 공식 인스타 스토리 템플릿 다운로드 <span className="group-hover:translate-x-1 transition font-mono">→</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 주의사항 섹션 */}
      <section className="px-6 py-24 md:px-16 bg-slate-950 border-b border-slate-800">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-red-400 font-bold text-xs uppercase tracking-widest block mb-3">NOTICE & WARNING</span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-16">
            꼭 확인하세요! 미인정 주의사항
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
            <div className="bg-slate-900/60 rounded-3xl p-6 border border-slate-800 shadow-sm flex items-start gap-4 hover:border-red-500/30 transition">
              <span className="text-3xl">🚶‍♂️</span>
              <div>
                <h4 className="font-bold text-lg text-slate-200 mb-1">단순 풍경 사진 제외</h4>
                <p className="text-slate-400 text-xs leading-relaxed">단순히 길을 걷거나 거리를 찍어 올린 불분명한 걷기 인증은 미인정 처리됩니다.</p>
              </div>
            </div>

            <div className="bg-slate-900/60 rounded-3xl p-6 border border-slate-800 shadow-sm flex items-start gap-4 hover:border-red-500/30 transition">
              <span className="text-3xl">☕</span>
              <div>
                <h4 className="font-bold text-lg text-slate-200 mb-1">무늬만 다회용기 사용</h4>
                <p className="text-slate-400 text-xs leading-relaxed">음료나 물이 없는 빈 텀블러 셀카, 혹은 일회용 컵 위에 홀더만 텀블러를 씌운 기만적 사용은 엄격히 걸러집니다.</p>
              </div>
            </div>

            <div className="bg-slate-900/60 rounded-3xl p-6 border border-slate-800 shadow-sm flex items-start gap-4 hover:border-red-500/30 transition">
              <span className="text-3xl">♻️</span>
              <div>
                <h4 className="font-bold text-lg text-slate-200 mb-1">불량 분리배출 사진</h4>
                <p className="text-slate-400 text-xs leading-relaxed">페트병의 라벨을 떼지 않거나, 택배 상자에 부착된 스티커/테이프를 제거하지 않고 배출한 분리수거 사진은 미인정됩니다.</p>
              </div>
            </div>

            <div className="bg-slate-900/60 rounded-3xl p-6 border border-slate-800 shadow-sm flex items-start gap-4 hover:border-red-500/30 transition">
              <span className="text-3xl">🍽️</span>
              <div>
                <h4 className="font-bold text-lg text-slate-200 mb-1">잔반 제로 실패 사진</h4>
                <p className="text-slate-400 text-xs leading-relaxed">다량의 밥알, 국물, 반찬 찌꺼기 등이 여전히 그릇 위에 선명하게 남아 있는 빈 그릇 인증 사진은 인정되지 않습니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 마무리 */}
      <section className="px-6 py-28 text-center bg-slate-900 relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-7xl mb-8 animate-bounce">🌱</div>

          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-8">
            여러분의 작은 용기 하나가
            <br />
            지구의 푸른 내일을 지킵니다.
          </h2>

          <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-12 max-w-2xl mx-auto">
            챌린지 규칙, 핀볼 추첨, 인정 여부 등에 관한 모든 의문사항은 공식 인스타 DM 또는 에타 댓글을 남겨주시면 실시간 답변해 드립니다!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <a
              href="https://www.instagram.com/fp.zero/"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-lg transition shadow-lg text-center"
            >
              📷 퍼스트펭귄 인스타 바로가기
            </a>

            <a
              href="https://docs.google.com/spreadsheets/d/18Pdxzr_LVyCUF3ck1KbyjAYsv3CK5yXQCVjbXb2SZGA/edit?gid=1270585109#gid=1270585109"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 text-lg transition text-center shadow-md"
            >
              📊 구글 시트 전체현황 보기
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
