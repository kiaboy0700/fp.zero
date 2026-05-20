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


  // 📝 오늘 나의 탄소 감량 계산기 상태
  const [todayChecks, setTodayChecks] = useState({
    tumbler: false,
    recycle: false,
    ecoback: false,
    cleanPlate: false,
  });

  // 📋 플로팅 Toast 알림 상태
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // ⚡ 실시간 챌린저 롤링 티커 상태
  const [tickerIndex, setTickerIndex] = useState(0);
  const [tickerMessages, setTickerMessages] = useState([]);

  // Toast 트리거 함수
  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // 롤링 티커 타이머
  useEffect(() => {
    if (tickerMessages.length === 0) return;
    const interval = setInterval(() => {
      setTickerIndex((prevIndex) => (prevIndex + 1) % tickerMessages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [tickerMessages]);

  // 클립보드 복사 헬퍼 함수
  const handleCopyText = (text, type) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          triggerToast(`📋 ${type} 공유 문구가 복사되었습니다! 인스타/에타에 소문을 내보세요!`);
        })
        .catch((err) => {
          console.error('Failed to copy: ', err);
          fallbackCopyText(text, type);
        });
    } else {
      fallbackCopyText(text, type);
    }
  };

  const fallbackCopyText = (text, type) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed'; // 화면 스크롤 방지
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      triggerToast(`📋 ${type} 공유 문구가 복사되었습니다! 인스타/에타에 소문을 내보세요!`);
    } catch (err) {
      console.error('Fallback copy failed: ', err);
      triggerToast(`❌ 복사에 실패했습니다. 직접 복사해 주세요.`);
    }
    document.body.removeChild(textArea);
  };

  // 퀴즈 결과 바이럴 문구 템플릿
  const getQuizShareText = () => {
    if (!quizResult) return '';
    return `🥑 [탄소 다이어트 챌린지 등급 테스트 결과] 🥑
지구 온도를 낮추는 나의 탄소 지수 등급은 과연?

🏆 등급: ${quizResult.grade}등급 (${quizResult.emoji})
💬 "${quizResult.desc.slice(0, 70)}..."

🌿 일상 속 작은 인증샷 하나로 예쁜 에코백/우산/유리컵 100% 무조건 추첨!
👉 지금 바로 도전하기: https://fp-zero.vercel.app/

#탄소다이어트챌린지 #퍼스트펭귄 #탄소제로 #친환경 #제로웨이스트`;
  };

  // 탄소 계산기 바이럴 문구 템플릿
  const getCarbonCalculatorShareText = () => {
    const saved = calculateSavedCarbon();
    return `🌳 [탄소 다이어트 계산기] 🌳
오늘 하루 나의 실천으로 줄여낸 탄소 감량 스코어!

✨ 오늘 줄인 이산화탄소: ${saved}g CO₂
🌲 소나무 약 ${(saved * 0.1).toFixed(1)}그루를 심은 효과!

[나의 실천 항목]
${todayChecks.tumbler ? '☕ 텀블러/다회용 컵 사용 (+100g)\n' : ''}${todayChecks.recycle ? '♻️ 압착 라벨 제거 분리배출 (+50g)\n' : ''}${todayChecks.ecoback ? '👜 장볼 때 에코백 사용 (+30g)\n' : ''}${todayChecks.cleanPlate ? '🍽️ 음식 남기지 않고 잔반 제로 (+120g)\n' : ''}
👉 여러분도 오늘 하루 탄소 지수를 측정하고 선물 받아가세요!
🔗 참여 링크: https://fp-zero.vercel.app/

#탄소다이어트챌린지 #탄소계산기 #경산시 #탄소중립 #퍼스트펭귄`;
  };


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

      // ⚡ 실시간 롤링 티커 메시지 동적 구성
      if (parsedData.length > 0) {
        const messages = [];
        if (parsedData[0]) messages.push(`👑 현재 1위는 ${parsedData[0].username}님! 총 ${parsedData[0].count}회 인증으로 챌린지를 선도 중입니다.`);
        if (parsedData[1]) messages.push(`🥈 ${parsedData[1].username}님이 ${parsedData[1].count}회 인증으로 1위를 바짝 추격하고 있습니다!`);
        
        // 무작위 참여자 2명 선정하여 격려 메시지
        const shuffled = [...parsedData].sort(() => 0.5 - Math.random());
        const randomUsers = shuffled.slice(0, 2);
        randomUsers.forEach(u => {
          messages.push(`🌱 ${u.username}님이 소중한 탄소 다이어트 실천으로 지구 온도를 낮추고 있습니다! (누적 인증 ${u.count}회)`);
        });

        messages.push(`🎯 인스타 스토리에 @fp.zero를 태그하고 실천 사진을 올리면 즉시 랭킹에 등록됩니다!`);
        messages.push(`🎲 현재 실시간 핀볼 총 수량은 ${totalApprovedActions}개! 단 1개의 인증으로도 경품 당첨 기회가 열려있습니다.`);
        setTickerMessages(messages);
      } else {
        setTickerMessages([
          `🎯 인스타 스토리에 @fp.zero를 태그하고 실천 사진을 올리면 즉시 랭킹에 등록됩니다!`,
          `🌍 제 2기 경산시 탄소중립지원센터 퍼스트펭귄 팀과 함께 탄소 제로를 실천해 보아요!`,
        ]);
      }

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

    let searchId = calcInput.trim();
    if (!searchId.startsWith('@')) {
      searchId = `@${searchId}`;
    }

    const foundUser = leaderboard.find(
      (user) => user.rawUsername.toLowerCase() === searchId.toLowerCase()
    );

    if (!foundUser) {
      setShowCalcError(true);
      return;
    }

    const userPinballs = foundUser.count;
    const totalPinballs = stats.totalActions;
    const probability = totalPinballs > 0 ? (userPinballs / totalPinballs) * 100 : 0;
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

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers([]);
    setQuizResult(null);
  };



  // 📝 오늘 탄소 감량 무게 계산 (g CO2)
  // 텀블러: 100g, 올바른분리배출: 50g, 에코백: 30g, 잔반없음: 120g
  const calculateSavedCarbon = () => {
    return (
      (todayChecks.tumbler ? 100 : 0) +
      (todayChecks.recycle ? 50 : 0) +
      (todayChecks.ecoback ? 30 : 0) +
      (todayChecks.cleanPlate ? 120 : 0)
    );
  };

  const topThree = leaderboard.slice(0, 3);
  const restOfLeaderboard = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white antialiased">
      
      {/* ⚡ 실시간 챌린저 알림 롤링 티커 */}
      {tickerMessages.length > 0 && (
        <div className="bg-slate-950/90 border-b border-emerald-500/20 backdrop-blur-md sticky top-0 z-40 overflow-hidden py-3 px-4 flex items-center justify-center">
          <div className="max-w-4xl w-full flex items-center gap-3">
            <span className="flex-shrink-0 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider animate-pulse">
              LIVE FEED
            </span>
            <div className="flex-grow h-5 overflow-hidden relative">
              {tickerMessages.map((msg, idx) => (
                <p
                  key={idx}
                  className={`text-xs md:text-sm font-semibold text-slate-300 truncate w-full absolute transition-all duration-500 ease-in-out ${
                    idx === tickerIndex
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4 pointer-events-none'
                  }`}
                >
                  {msg}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 🌟 최상단 통합 프리미엄 대시보드 히어로 (초압축 & 고밀도 UI) */}
      <section className="relative px-6 py-10 md:py-12 md:px-16 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/80">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-950/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-teal-950/15 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto relative z-10 space-y-6">
          
          {/* A. 초소형 고밀도 헤더 (브랜드 & 타이틀 & CTA) */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800/60 pb-6">
            <div className="text-center md:text-left space-y-2">
              <div className="inline-flex items-center gap-2 bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold tracking-wide uppercase shadow-inner">
                🌍 제 2기 경산시 탄소중립지원센터 퍼스트펭귄 팀
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-300">
                탄소 다이어트 챌린지 🌱
              </h1>
              <p className="text-xs md:text-sm text-slate-400 max-w-xl">
                일상 속 작은 인증샷 하나로 지구 온도는 내리고, <span className="text-emerald-400 font-bold">감성 넘치는 친환경 굿즈 100% 무조건 추첨!</span>
              </p>
            </div>
            
            {/* CTA 버튼 그룹 */}
            <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
              <a
                href="https://www.instagram.com/fp.zero/"
                target="_blank"
                rel="noreferrer"
                className="flex-grow md:flex-grow-0 px-5 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs md:text-sm font-black tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.2)] transition transform hover:-translate-y-0.5 active:translate-y-0 text-center"
              >
                📸 지금 스토리 인증하기
              </a>
              <a
                href="#live-leaderboard"
                className="flex-grow md:flex-grow-0 px-5 py-3.5 rounded-xl bg-slate-850 border border-slate-700 hover:bg-slate-700 text-slate-200 text-xs md:text-sm font-bold transition text-center"
              >
                🏆 실시간 순위 조회
              </a>
            </div>
          </div>

          {/* B. 핵심 참여 동기 부여 미니 배지 (완벽한 중앙 정렬 및 프리미엄 글래스모피즘 캡슐형 디자인) */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/60 border border-emerald-500/20 text-slate-200 text-xs md:text-sm font-extrabold shadow-lg hover:border-emerald-500/40 transition duration-300 backdrop-blur-md">
              <span className="text-emerald-400 text-base">🎁</span> 총 7명 무조건 선정
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/60 border border-teal-500/20 text-slate-200 text-xs md:text-sm font-extrabold shadow-lg hover:border-teal-500/40 transition duration-300 backdrop-blur-md">
              <span className="text-teal-400 text-base">🎲</span> 1장만 올려도 공정한 핀볼 확률
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/60 border border-emerald-500/20 text-slate-200 text-xs md:text-sm font-extrabold shadow-lg hover:border-emerald-500/40 transition duration-300 backdrop-blur-md">
              <span className="text-emerald-400 text-base">🔥</span> 언제 참여해도 즉시 역전 가능
            </div>
          </div>

          {/* C. ⚡ 단 10초 만에 끝나는 참여 프로세스 (최상단 하이라이트 전면 배치) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs md:text-sm font-black text-slate-200 flex items-center gap-2">
                <span className="text-[10px] text-emerald-400 font-black px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 tracking-wider">PROCESS</span>
                단 10초 만에 참여 완료! 어떻게 참여하나요? ⚡
              </h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/50 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-4 hover:border-emerald-500/30 transition group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 text-4xl font-black text-slate-800/10 pointer-events-none group-hover:text-slate-800/20 transition">01</div>
                <span className="text-3xl bg-emerald-500/10 p-3 rounded-2xl group-hover:scale-110 transition shrink-0">🌱</span>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-500 font-black block mb-0.5 uppercase tracking-wider">STEP 01. 실천</span>
                  <span className="text-sm font-bold text-slate-200 block mb-0.5">일상 속 쉬운 탄소중립 실천</span>
                  <span className="text-slate-400 text-xs truncate block leading-normal">텀블러 사용, 분리배출, 에코백 사용 등</span>
                </div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-4 hover:border-emerald-500/30 transition group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 text-4xl font-black text-slate-800/10 pointer-events-none group-hover:text-slate-800/20 transition">02</div>
                <span className="text-3xl bg-emerald-500/10 p-3 rounded-2xl group-hover:scale-110 transition shrink-0">📸</span>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-500 font-black block mb-0.5 uppercase tracking-wider">STEP 02. 촬영</span>
                  <span className="text-sm font-bold text-slate-200 block mb-0.5">인증 사진 촬영</span>
                  <span className="text-slate-400 text-xs truncate block leading-normal">실천 내용과 내 정성이 명확히 보이게!</span>
                </div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-4 hover:border-emerald-500/30 transition group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 text-4xl font-black text-slate-800/10 pointer-events-none group-hover:text-slate-800/20 transition">03</div>
                <span className="text-3xl bg-emerald-500/10 p-3 rounded-2xl group-hover:scale-110 transition shrink-0">🏷️</span>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-500 font-black block mb-0.5 uppercase tracking-wider">STEP 03. 업로드</span>
                  <span className="text-sm font-bold text-slate-200 block mb-0.5">스토리 업로드</span>
                  <span className="text-slate-400 text-xs truncate block leading-normal">인스타 스토리에 @fp.zero 태그하면 끝</span>
                </div>
              </div>
            </div>
          </div>

          {/* E. 🎁 챌린저 감성 리워드 라인업 (상단 미니 배치) */}
          <div className="space-y-2.5 pt-2">
            <h4 className="text-xs font-black text-slate-400 flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-[9px] text-emerald-400 font-black px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 tracking-wider">REWARDS</span>
              이번 주 챌린저에게 쏟아지는 감성 친환경 굿즈 라인업 🎁
              <span className="text-[9px] text-amber-400 font-extrabold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full mt-1 md:mt-0">
                ⚡ 1등 특전: 추첨 제외 & 원하는 굿즈 1종 우선 선택·선점권!
              </span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {products.map((p, idx) => (
                <a
                  key={idx}
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-slate-900/40 border border-slate-800/80 hover:border-emerald-500/30 p-2.5 rounded-xl flex items-center gap-2.5 hover:scale-[1.02] transition group"
                >
                  <span className="text-2xl group-hover:scale-110 transition shrink-0">{p.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] text-slate-500 font-bold block leading-none mb-0.5">{p.winner} 추첨</span>
                    <span className="text-[11px] font-black text-slate-300 group-hover:text-emerald-400 transition truncate block leading-tight" title={p.name}>
                      {p.name}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* D. 🌍 챌린저 공동 목표 실시간 탄소 감량 현황판 (초슬림 & 초경량화) */}
          <div className="bg-slate-950/60 backdrop-blur-md border border-emerald-500/20 rounded-2xl p-4 md:p-5 shadow-xl animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-3">
              <div>
                <span className="text-emerald-400 font-black text-[9px] uppercase tracking-wider block mb-0.5">
                  GLOBAL ECO GOAL 🌍
                </span>
                <h3 className="text-sm md:text-base font-black text-slate-100">
                  우리가 함께 줄여낸 탄소 감량
                </h3>
              </div>
              <div className="bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 px-3 py-1 rounded-full text-xs font-black shrink-0">
                🌳 누적 소나무 {(stats.totalActions * 10).toFixed(0)}그루 식재 효과
              </div>
            </div>

            {/* 게이지 바 */}
            <div className="relative w-full bg-slate-800 h-4.5 rounded-full overflow-hidden border border-slate-700/50">
              <div
                className="absolute top-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                style={{ width: `${Math.min(((stats.totalActions * 100) / 50000) * 100, 100)}%` }}
              ></div>
              <span className="absolute inset-0 flex items-center justify-center text-[9px] md:text-[10px] font-black text-white drop-shadow-md">
                {(stats.totalActions * 100).toLocaleString()}g / 50,000g CO₂ 저감 ({Math.min(((stats.totalActions * 100) / 50000) * 100, 100).toFixed(1)}%)
              </span>
            </div>
            
            <p className="text-[9px] text-slate-500 font-medium mt-2 text-right">
              *참가자들이 구글 시트에 인증 완료한 총 핀볼 갯수 <b>{stats.totalActions}개</b>에 비례하여 실시간 자동 집계됩니다.
            </p>
          </div>

        </div>
      </section>

      {/* 🏆 [실시간 통합 랭킹 & 확률 센터] (스프레드시트 실시간 연동 + 내 순위 및 당첨 확률 검색기) */}
      <section id="live-leaderboard" className="px-6 py-24 md:px-16 bg-slate-950 relative border-b border-slate-800/85">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-emerald-950/15 rounded-full blur-[110px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-teal-950/10 rounded-full blur-[90px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-4 uppercase tracking-widest animate-pulse">
              🏆 REAL-TIME LEADERBOARD & PROBABILITY
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
              실시간 통합 랭킹 & 확률 센터
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
              본인의 인스타그램 아이디를 검색하여 실시간 순위와 당첨 확률을 즉시 확인하고, <br className="hidden md:inline"/>
              전체 참여자분들의 실시간 인증 순위 및 포디움 현황과 비교해 보세요!
            </p>
          </div>

          <div className="space-y-10">
            {/* 실시간 대시보드 그리드: 검색기 + 포디움 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* 왼쪽: 내 실시간 검색 및 확률 계산기 */}
              <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800/80 rounded-[32px] p-6 md:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/20 transition duration-300 min-h-[380px] flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
                
                <div>
                  <h3 className="text-xl font-black text-slate-100 mb-2 flex items-center gap-2">
                    🔍 내 당첨 확률 & 순위 조회
                  </h3>
                  <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    인스타 아이디를 입력하시면 현재 획득한 핀볼 수와 실시간 추첨 당첨 확률을 계산합니다.
                  </p>

                  <form onSubmit={handleCalcProbability} className="flex gap-2.5 mb-6">
                    <input
                      type="text"
                      placeholder="@username 또는 username"
                      value={calcInput}
                      onChange={(e) => setCalcInput(e.target.value)}
                      className="flex-grow px-4 py-3.5 bg-slate-950/80 border border-slate-700/60 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold placeholder-slate-600 transition"
                    />
                    <button
                      type="submit"
                      className="px-5 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl transition shadow-lg shrink-0 text-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    >
                      조회
                    </button>
                  </form>
                </div>

                {/* 검색 결과 표시 */}
                {calcResult && (
                  <div className="bg-slate-950/90 border border-emerald-500/30 rounded-2xl p-5 md:p-6 animate-fadeIn text-center relative overflow-hidden shadow-inner">
                    <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-emerald-900/10 rounded-full blur-[60px] pointer-events-none"></div>
                    
                    <span className="text-[10px] text-emerald-400 font-black tracking-widest block mb-1">MY LIVE STATS</span>
                    <h4 className="text-lg font-black text-slate-100 mb-4 truncate">{calcResult.maskedUsername}</h4>
                    
                    <div className="grid grid-cols-3 gap-2.5 mb-5">
                      <div className="bg-slate-900/90 border border-slate-800/80 p-3 rounded-xl flex flex-col justify-center">
                        <span className="text-[9px] text-slate-500 font-bold block mb-0.5">내 순위</span>
                        <span className="text-lg font-black text-slate-200">{calcResult.rank}위</span>
                      </div>
                      <div className="bg-slate-900/90 border border-slate-800/80 p-3 rounded-xl flex flex-col justify-center">
                        <span className="text-[9px] text-slate-500 font-bold block mb-0.5">보유 핀볼</span>
                        <span className="text-lg font-black text-emerald-400">{calcResult.count}개</span>
                      </div>
                      <div className="bg-slate-900/90 border border-slate-800/80 p-3 rounded-xl flex flex-col justify-center">
                        <span className="text-[9px] text-slate-500 font-bold block mb-0.5">당첨 확률</span>
                        <span className="text-lg font-black text-teal-400">{calcResult.probability}%</span>
                      </div>
                    </div>

                    {/* 확률 비주얼 게이지 바 */}
                    <div className="mb-5 bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 text-left">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] text-slate-400 font-black">실시간 당첨 점유율</span>
                        <span className="text-xs text-teal-400 font-black">{calcResult.probability}%</span>
                      </div>
                      <div className="w-full bg-slate-850 h-2.5 rounded-full overflow-hidden border border-slate-800/80 relative">
                        {/* 현재 확률 바 */}
                        <div
                          className="absolute top-0 left-0 bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(20,184,166,0.4)]"
                          style={{ width: `${Math.min(parseFloat(calcResult.probability), 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* 1장 더 인증 시 시뮬레이션 배지 */}
                    <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-3.5 flex flex-col gap-2 text-left">
                      <div>
                        <span className="text-[9px] text-emerald-400 font-black block tracking-wider mb-0.5">NEXT CHALLENGE PREVIEW 🔥</span>
                        <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                          오늘 스토리 인증을 <b>1개 추가</b>하면?
                        </p>
                      </div>
                      <div className="w-full bg-emerald-500 text-slate-950 text-xs font-black py-2 rounded-lg text-center shrink-0 shadow-md">
                        당첨 확률 {calcResult.nextProb}% 로 상승! (+{calcResult.diff}%)
                      </div>
                    </div>
                  </div>
                )}

                {/* 검색 결과 없음 예외 안내 */}
                {showCalcError && (
                  <div className="bg-slate-950/90 border border-red-500/20 rounded-2xl p-5 animate-fadeIn text-center shadow-inner">
                    <span className="text-2xl mb-2 block">🚨</span>
                    <h4 className="text-sm font-black text-slate-200 mb-1">인증 내역이 아직 반영되지 않았습니다</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed max-w-md mx-auto mb-4">
                      아이디 오타를 확인해 보시거나, 아직 첫 인증이 구글 시트에 반영되지 않았을 수 있습니다. (시트 업데이트는 실시간 수동 검토 후 진행됩니다.)
                    </p>
                    <a
                      href="https://www.instagram.com/fp.zero/"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-lg transition shadow-md hover:scale-[1.02]"
                    >
                      📸 지금 인스타 스토리 인증하기
                    </a>
                  </div>
                )}
              </div>

              {/* 오른쪽: TOP 3 포디움 명예의 전당 */}
              <div className="lg:col-span-7 h-full flex flex-col">
                {!loading && !error && leaderboard.length > 0 && (
                  <div className="bg-slate-900/40 border border-slate-800/80 rounded-[32px] p-6 shadow-2xl backdrop-blur-sm flex-grow flex flex-col justify-center min-h-[380px]">
                    <h3 className="text-xl font-black text-slate-100 mb-1.5 text-center flex items-center justify-center gap-2">
                      👑 명예의 전당 TOP 3
                    </h3>
                    <p className="text-[10px] text-emerald-400 font-black text-center mb-6 max-w-sm mx-auto leading-relaxed bg-emerald-500/10 border border-emerald-500/20 py-1 px-3.5 rounded-full inline-block self-center">
                      ⚡ 1등 독점 혜택: 추첨 제외 & 원하는 상품 1종 우선 선택·선점권! 🎁
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-end justify-center gap-4 max-w-xl mx-auto w-full">
                      
                      {/* 2등 실버 포디움 */}
                      {topThree[1] && (
                        <div className="order-2 sm:order-1 flex-1 bg-gradient-to-b from-slate-800/40 to-slate-900/60 border border-slate-700/50 rounded-2xl p-4 shadow-lg hover:scale-[1.02] hover:-translate-y-1 transition duration-300 text-center relative overflow-hidden flex flex-col justify-between min-h-[190px]">
                          <div className="absolute top-0 right-0 left-0 bg-slate-750 py-1 text-[9px] font-black text-slate-300 tracking-wider uppercase">2nd Place</div>
                          <div className="text-3xl mt-5 mb-1.5">🥈</div>
                          <h4 className="text-sm font-bold truncate text-slate-100">{topThree[1].username}</h4>
                          <div className="my-1">
                            <span className="text-2xl font-extrabold text-emerald-400">{topThree[1].count}</span>
                            <span className="text-xs text-slate-400">회 인증</span>
                          </div>
                          <p className="text-[9px] text-slate-500 font-medium">최초: {topThree[1].date || ''}</p>
                        </div>
                      )}

                      {/* 1등 골드 포디움 */}
                      {topThree[0] && (
                        <div className="order-1 sm:order-2 flex-1 bg-gradient-to-b from-emerald-950/30 to-slate-900/80 border-2 border-emerald-500/60 rounded-3xl p-5 shadow-2xl hover:scale-[1.04] hover:-translate-y-1.5 transition duration-300 text-center relative overflow-hidden flex flex-col justify-between min-h-[250px] ring-4 ring-emerald-500/10">
                          <div className="absolute top-0 right-0 left-0 bg-emerald-500/20 py-1 text-[10px] font-black text-emerald-300 tracking-wider uppercase">LEADER</div>
                          <div className="text-4xl mt-5 mb-1.5">👑 🥇</div>
                          <h4 className="text-base font-black truncate text-slate-100">{topThree[0].username}</h4>
                          <div className="my-1">
                            <span className="text-3xl font-black text-emerald-400">{topThree[0].count}</span>
                            <span className="text-xs text-emerald-200 font-bold">회 인증</span>
                          </div>
                          <p className="text-[9px] text-emerald-500/70 font-semibold mb-2">최초: {topThree[0].date || ''}</p>
                          <span className="text-[9px] text-emerald-300 font-bold bg-emerald-500/20 py-1 px-2 rounded-lg leading-normal block">
                            🎁 원하는 상품 1종 선점권 (추첨 제외)
                          </span>
                        </div>
                      )}

                      {/* 3등 브론즈 포디움 */}
                      {topThree[2] && (
                        <div className="order-3 sm:order-3 flex-1 bg-gradient-to-b from-slate-800/40 to-slate-900/60 border border-slate-700/50 rounded-2xl p-4 shadow-lg hover:scale-[1.02] hover:-translate-y-1 transition duration-300 text-center relative overflow-hidden flex flex-col justify-between min-h-[180px]">
                          <div className="absolute top-0 right-0 left-0 bg-amber-950/20 py-1 text-[9px] font-black text-amber-300 tracking-wider uppercase">3rd Place</div>
                          <div className="text-3xl mt-5 mb-1.5">🥉</div>
                          <h4 className="text-sm font-bold truncate text-slate-100">{topThree[2].username}</h4>
                          <div className="my-1">
                            <span className="text-2xl font-extrabold text-emerald-400">{topThree[2].count}</span>
                            <span className="text-xs text-slate-400">회 인증</span>
                          </div>
                          <p className="text-[9px] text-slate-500 font-medium">최초: {topThree[2].date || ''}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* 랭킹 로딩 중 스켈레톤 */}
                {loading && (
                  <div className="bg-slate-900/40 border border-slate-800/80 rounded-[32px] p-6 shadow-2xl backdrop-blur-sm flex-grow flex flex-col justify-center items-center min-h-[380px]">
                    <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-400 text-sm font-semibold">명예의 전당 정보 로딩 중...</p>
                  </div>
                )}

                {/* 랭킹 로딩 에러 */}
                {error && (
                  <div className="bg-red-950/10 border border-red-500/20 rounded-[32px] p-6 shadow-2xl backdrop-blur-sm flex-grow flex flex-col justify-center items-center min-h-[380px]">
                    <span className="text-3xl mb-3 block">🚨</span>
                    <h3 className="text-base font-bold text-slate-200 mb-2">동기화 실패</h3>
                    <button
                      onClick={fetchLeaderboardData}
                      className="px-4 py-2 bg-red-500 hover:bg-red-400 text-slate-950 text-xs font-black rounded-lg transition"
                    >
                      다시 불러오기
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* 하단: 4등 이하 순위 리스트 및 컨트롤러 */}
            {!loading && !error && leaderboard.length > 0 && (
              <div className="space-y-6">
                {/* 4등 이하 순위 리스트 */}
                {restOfLeaderboard.length > 0 && (
                  <div className="bg-slate-900/60 border border-slate-800/80 rounded-[32px] overflow-hidden shadow-xl max-w-6xl mx-auto">
                    <div className="bg-slate-950/80 px-6 py-4 grid grid-cols-12 text-xs font-black text-slate-500 uppercase tracking-widest text-center border-b border-slate-800/60">
                      <div className="col-span-2">순위</div>
                      <div className="col-span-6 text-left pl-6">인스타그램 아이디</div>
                      <div className="col-span-4">인정(O) 개수</div>
                    </div>
                    <div className="divide-y divide-slate-800/50 max-h-[360px] overflow-y-auto custom-scrollbar">
                      {restOfLeaderboard.map((item, index) => (
                        <div
                          key={index}
                          className="px-6 py-3.5 grid grid-cols-12 items-center text-center hover:bg-slate-850/30 transition group"
                        >
                          <div className="col-span-2 text-base font-black text-slate-500 group-hover:text-slate-300 transition">
                            {item.rank}
                          </div>
                          <div className="col-span-6 text-left pl-6 font-bold text-slate-300 group-hover:text-emerald-400 transition truncate text-sm">
                            {item.username}
                          </div>
                          <div className="col-span-4 font-black">
                            <span className="px-3 py-1.5 bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 rounded-full text-xs font-black shadow-inner">
                              {item.count}개
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 컨트롤러 버튼 */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-xl mx-auto pt-4">
                  <button
                    onClick={fetchLeaderboardData}
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    🔄 실시간 정보 동기화
                  </button>

                  <a
                    href="https://docs.google.com/spreadsheets/d/18Pdxzr_LVyCUF3ck1KbyjAYsv3CK5yXQCVjbXb2SZGA/edit?gid=1270585109#gid=1270585109"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-8 py-4 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl text-center shadow-md transition hover:scale-[1.02] active:scale-[0.98]"
                  >
                    📊 구글 시트 원본 보드 보기
                  </a>
                </div>
              </div>
            )}

            {!loading && !error && leaderboard.length === 0 && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto">
                <div className="text-6xl mb-4">🏁</div>
                <h3 className="text-xl font-bold text-slate-200 mb-2">아직 인증 참가자가 없습니다</h3>
                <p className="text-slate-500 mb-6">첫 스토리 인증샷을 업로드하고 1위를 차지해 보세요!</p>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* 🧠 테스트 1: 탄소 다이어트 등급 테스트 (흥미 유발 퀴즈) */}
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
                    className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl transition shadow-lg text-center shrink-0"
                  >
                    🌱 즉시 챌린지 신청하고 등급 올리기
                  </a>
                  <button
                    onClick={() => handleCopyText(getQuizShareText(), '테스트 결과')}
                    className="px-8 py-4 bg-slate-800/80 hover:bg-slate-700 text-emerald-400 font-black rounded-2xl border border-emerald-500/30 transition text-center shadow-md flex items-center justify-center gap-2"
                  >
                    🔗 결과 문구 복사 (인스타 소문내기)
                  </button>
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

      {/* 🍀 오늘 나의 탄소 감량 계산기 (참여 행동 촉진 도구) */}
      <section className="px-6 py-24 md:px-16 bg-slate-950 relative">
        <div className="absolute top-[30%] left-[-10%] w-[35%] h-[35%] bg-emerald-950/15 rounded-full blur-[90px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest block mb-3">DAILY ECO TRACKER</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              오늘 나는 탄소를 얼마나 감량했을까?
            </h2>
            <p className="text-slate-400">
              오늘 하루 실천한 행동들을 체크하면 바로 줄인 탄소의 양(CO2)을 계산해 줍니다!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* 체크리스트 */}
            <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-[32px] p-8 md:p-10 shadow-2xl backdrop-blur-md">
              <h3 className="text-xl font-bold mb-6 text-slate-200">🥗 오늘 실천한 행동 체크리스트</h3>
              
              <div className="space-y-4">
                <label className="flex items-center gap-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/30 transition cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    checked={todayChecks.tumbler}
                    onChange={(e) => setTodayChecks({ ...todayChecks, tumbler: e.target.checked })}
                    className="w-6 h-6 rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-200 group-hover:text-emerald-400 transition block">☕ 카페에서 텀블러/다회용 컵 사용하기</span>
                    <span className="text-xs text-slate-500 font-medium">하루 평균 100g CO₂ 저감 효과</span>
                  </div>
                </label>

                <label className="flex items-center gap-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/30 transition cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    checked={todayChecks.recycle}
                    onChange={(e) => setTodayChecks({ ...todayChecks, recycle: e.target.checked })}
                    className="w-6 h-6 rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-200 group-hover:text-emerald-400 transition block">♻️ 비닐 라벨을 제거하고 압착하여 분리배출하기</span>
                    <span className="text-xs text-slate-500 font-medium">재활용률 100% 상승 및 50g CO₂ 저감</span>
                  </div>
                </label>

                <label className="flex items-center gap-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/30 transition cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    checked={todayChecks.ecoback}
                    onChange={(e) => setTodayChecks({ ...todayChecks, ecoback: e.target.checked })}
                    className="w-6 h-6 rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-200 group-hover:text-emerald-400 transition block">👜 장볼 때 비닐봉투 대신 에코백 사용하기</span>
                    <span className="text-xs text-slate-500 font-medium">비닐 생산 최소화 및 30g CO₂ 저감</span>
                  </div>
                </label>

                <label className="flex items-center gap-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/30 transition cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    checked={todayChecks.cleanPlate}
                    onChange={(e) => setTodayChecks({ ...todayChecks, cleanPlate: e.target.checked })}
                    className="w-6 h-6 rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-200 group-hover:text-emerald-400 transition block">🍽️ 음식 남기지 않고 잔반 제로 실천하기</span>
                    <span className="text-xs text-slate-500 font-medium">음식물 쓰레기 감소 및 120g CO₂ 저감</span>
                  </div>
                </label>
              </div>
            </div>

            {/* 계산 결과 리포트 */}
            <div className="lg:col-span-5 bg-gradient-to-b from-emerald-950/40 to-slate-950/80 border border-emerald-500/30 rounded-[32px] p-8 md:p-10 shadow-2xl text-center flex flex-col justify-between min-h-[360px]">
              <div>
                <span className="text-3xl mb-4 block animate-bounce">🌳</span>
                <span className="text-xs text-emerald-400 font-black tracking-widest block mb-2">MY ECO SCORE</span>
                <h3 className="text-2xl font-bold text-slate-100 mb-6">오늘 줄인 이산화탄소</h3>
                
                <div className="my-6">
                  <span className="text-6xl font-black text-emerald-400 tracking-tight">{calculateSavedCarbon()}</span>
                  <span className="text-xl font-bold text-slate-300"> g CO₂</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 leading-relaxed mb-6 font-semibold">
                  {calculateSavedCarbon() > 0 ? (
                    `오늘 지켜낸 푸른 나무: 소나무 약 ${(calculateSavedCarbon() * 0.1).toFixed(1)}그루! 지금 즉시 실천한 내용을 사진으로 찍어 인스타 스토리에 업로드하고 푸짐한 리워드를 받아가세요!`
                  ) : (
                    '위의 친환경 행동을 하나 이상 체크하면 줄어든 탄소 감량 수치가 시각적으로 즉시 계산됩니다!'
                  )}
                </p>
                {calculateSavedCarbon() > 0 && (
                  <button
                    onClick={() => handleCopyText(getCarbonCalculatorShareText(), '오늘 감량 결과')}
                    className="block w-full py-4 mb-3 bg-slate-900 hover:bg-slate-800 border border-emerald-500/20 text-emerald-400 font-black rounded-2xl shadow-md transition text-sm md:text-base flex items-center justify-center gap-2 cursor-pointer"
                  >
                    🔗 오늘 감량 복사 (에타에 인증하기)
                  </button>
                )}
                <a
                  href="https://www.instagram.com/fp.zero/"
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-lg transition text-sm md:text-base text-center"
                >
                  📸 오늘 행동 스토리 인증하고 핀볼 받기
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 리워드(상품) 섹션 */}
      <section className="px-6 py-24 md:px-16 bg-slate-900 border-y border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest block mb-3">CHALLENGE REWARD</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              가장 탐나는 역대급 친환경 라인업
            </h2>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
              경산시 탄소중립지원센터 퍼스트펭귄 팀이 엄선한, 일상의 감성을 더해줄 하이엔드 업사이클링 및 제로웨이스트 상품들입니다. <span className="text-amber-400 font-extrabold block mt-2 text-xs md:text-sm">🔥 1등 특전: 명예의 전당 1위 달성자는 모든 추첨에서 제외되며, 위 상품 라인업 중 원하는 굿즈 1종을 최우선으로 선점하여 받아가실 수 있습니다!</span>
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



      {/* 🟢 올바른 인증 VS 🔴 미인정 visual 가이드 섹션 */}
      <section className="px-6 py-24 md:px-16 bg-slate-900 border-y border-slate-800 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest block mb-3">CERTIFICATION GUIDE</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              올바른 인증 VS 미인정 비주얼 비교
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              지구를 위한 여러분의 모든 실천은 소중해요! 💚 미인정 예시는 최소한의 가이드일 뿐, 최대한 많은 분들이 핀볼권을 획득하실 수 있도록 <span className="text-emerald-400 font-bold">아주 유연하고 너그러운 시선(유도리 있게!)으로 심사</span>할 예정이니 너무 걱정 말고 부담 없이 참여해 주세요! 🥰
            </p>
          </div>

          {/* 💡 안심 배너 */}
          <div className="bg-amber-950/20 border border-amber-500/20 rounded-3xl p-5 mb-12 text-xs md:text-sm text-amber-300 leading-relaxed flex items-start gap-3.5 max-w-3xl mx-auto shadow-lg backdrop-blur-sm">
            <span className="text-xl shrink-0">💡</span>
            <div>
              <strong className="font-extrabold text-amber-200 block mb-1 text-sm md:text-base">너무 걱정하지 마세요!</strong>
              단순한 실수나 상황에 따른 불가피한 부분은 최대한 긍정적으로 참작해 드립니다. 고의적인 무단 도용이나 허위 인증이 아니라면 너그럽게 인정 처리해 드려요!
            </div>
          </div>

          {/* 카테고리별 1:1 비교 그리드 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            
            {/* 카드 1: 텀블러 */}
            <div className="bg-slate-950/40 border border-slate-800 rounded-[32px] p-6 shadow-xl hover:border-slate-700/50 transition duration-300 flex flex-col justify-between group">
              <div className="mb-5 flex items-center justify-between border-b border-slate-850 pb-4">
                <h3 className="text-base md:text-lg font-black text-slate-100 flex items-center gap-2">
                  🥤 텀블러 & 다회용 컵 사용
                </h3>
                <span className="text-[10px] bg-slate-900 text-slate-400 font-black px-2 py-0.5 rounded-full border border-slate-800 uppercase tracking-wider">TUMBLER</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-950/20 border border-emerald-500/10 p-4 rounded-2xl flex flex-col justify-between hover:border-emerald-500/20 transition">
                  <div>
                    <span className="text-xs font-black text-emerald-400 block mb-1.5 flex items-center gap-1">🟢 정석 인증 (Approved)</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">카페에서 실제로 음료나 커피가 가득 담겨있고 사용 중인 정성 가득 텀블러 사진</p>
                  </div>
                </div>
                <div className="bg-red-950/10 border border-red-500/5 p-4 rounded-2xl flex flex-col justify-between hover:border-red-500/15 transition">
                  <div>
                    <span className="text-xs font-black text-red-400 block mb-1.5 flex items-center gap-1">🔴 단순 소지 (Reference)</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">음료나 물이 없는 텅 빈 텀블러 셀카, 혹은 일회용 컵을 쓰며 컵홀더만 가죽인 경우</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 카드 2: 분리배출 */}
            <div className="bg-slate-950/40 border border-slate-800 rounded-[32px] p-6 shadow-xl hover:border-slate-700/50 transition duration-300 flex flex-col justify-between group">
              <div className="mb-5 flex items-center justify-between border-b border-slate-850 pb-4">
                <h3 className="text-base md:text-lg font-black text-slate-100 flex items-center gap-2">
                  ♻️ 압착 라벨 제거 분리배출
                </h3>
                <span className="text-[10px] bg-slate-900 text-slate-400 font-black px-2 py-0.5 rounded-full border border-slate-800 uppercase tracking-wider">RECYCLE</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-950/20 border border-emerald-500/10 p-4 rounded-2xl flex flex-col justify-between hover:border-emerald-500/20 transition">
                  <div>
                    <span className="text-xs font-black text-emerald-400 block mb-1.5 flex items-center gap-1">🟢 정석 인증 (Approved)</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">플라스틱 페트병의 라벨을 깔끔하게 제거하고, 발로 밟아 압착하여 올바르게 분리배출함에 버리는 사진</p>
                  </div>
                </div>
                <div className="bg-red-950/10 border border-red-500/5 p-4 rounded-2xl flex flex-col justify-between hover:border-red-500/15 transition">
                  <div>
                    <span className="text-xs font-black text-red-400 block mb-1.5 flex items-center gap-1">🔴 불량 배출 (Reference)</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">페트병의 비닐 라벨을 그대로 붙여두거나, 뚜껑을 안 뗐거나, 택배용 테이프가 가득한 상자 배출 사진</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 카드 3: 장바구니/에코백 */}
            <div className="bg-slate-950/40 border border-slate-800 rounded-[32px] p-6 shadow-xl hover:border-slate-700/50 transition duration-300 flex flex-col justify-between group">
              <div className="mb-5 flex items-center justify-between border-b border-slate-850 pb-4">
                <h3 className="text-base md:text-lg font-black text-slate-100 flex items-center gap-2">
                  👜 장바구니 & 에코백 사용
                </h3>
                <span className="text-[10px] bg-slate-900 text-slate-400 font-black px-2 py-0.5 rounded-full border border-slate-800 uppercase tracking-wider">ECO BAG</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-950/20 border border-emerald-500/10 p-4 rounded-2xl flex flex-col justify-between hover:border-emerald-500/20 transition">
                  <div>
                    <span className="text-xs font-black text-emerald-400 block mb-1.5 flex items-center gap-1">🟢 정석 인증 (Approved)</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">대형마트, 다이소, 편의점 등에서 비닐봉지 대신 챙겨간 에코백에 물품을 담는 실제 사용 사진</p>
                  </div>
                </div>
                <div className="bg-red-950/10 border border-red-500/5 p-4 rounded-2xl flex flex-col justify-between hover:border-red-500/15 transition">
                  <div>
                    <span className="text-xs font-black text-red-400 block mb-1.5 flex items-center gap-1">🔴 단순 착용 (Reference)</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">장보기 활동과 전혀 무관하게, 일반 의류 패션 코디용으로 매치하여 야외나 집 안에서 에코백을 메고 찍은 사진</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 카드 4: 잔반 제로 */}
            <div className="bg-slate-950/40 border border-slate-800 rounded-[32px] p-6 shadow-xl hover:border-slate-700/50 transition duration-300 flex flex-col justify-between group">
              <div className="mb-5 flex items-center justify-between border-b border-slate-850 pb-4">
                <h3 className="text-base md:text-lg font-black text-slate-100 flex items-center gap-2">
                  🍽️ 깨끗하게 비운 잔반 제로
                </h3>
                <span className="text-[10px] bg-slate-900 text-slate-400 font-black px-2 py-0.5 rounded-full border border-slate-800 uppercase tracking-wider">CLEAN PLATE</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-950/20 border border-emerald-500/10 p-4 rounded-2xl flex flex-col justify-between hover:border-emerald-500/20 transition">
                  <div>
                    <span className="text-xs font-black text-emerald-400 block mb-1.5 flex items-center gap-1">🟢 정석 인증 (Approved)</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">음식물 쓰레기 감소를 증명하기 위해 찌꺼기 없이 완벽하게 비워낸 깨끗한 빈 그릇(식사 완료) 사진</p>
                  </div>
                </div>
                <div className="bg-red-950/10 border border-red-500/5 p-4 rounded-2xl flex flex-col justify-between hover:border-red-500/15 transition">
                  <div>
                    <span className="text-xs font-black text-red-400 block mb-1.5 flex items-center gap-1">🔴 음식 남김 (Reference)</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">음식을 많이 남겨 그릇 바닥에 다량의 국물, 음식물 찌꺼기, 반찬 등이 뚜렷하게 남은 엉성한 사진</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* 푸터 마무리 */}
      <section className="px-6 py-28 text-center bg-slate-900 relative border-t border-slate-800">
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

      {/* 📋 플로팅 Toast 알림 메시지 */}
      {showToast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-slideDown pointer-events-none">
          <div className="bg-slate-950/90 border border-emerald-500/40 text-slate-200 text-xs md:text-sm font-black px-6 py-4 rounded-2xl shadow-2xl shadow-emerald-500/10 backdrop-blur-md flex items-center gap-2">
            <span className="text-emerald-400">✨</span> {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
}
