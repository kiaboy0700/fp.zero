import { useState, useEffect } from 'react';

export default function CarbonChallengeLandingPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [stats, setStats] = useState({ totalParticipants: 0, totalActions: 0 });

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
      desc: '텀블러 사용, 분리배출, 에코백 사용 등',
      number: '01',
    },
    {
      title: '인증 사진 촬영',
      desc: '실천 내용이 보이게 사진 찍기',
      number: '02',
    },
    {
      title: '스토리 업로드',
      desc: '@fp.zero 태그하면 참여 완료',
      number: '03',
    },
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
    
    const keep = 2; // 앞뒤로 유지할 글자 수
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
      // 🏆순위 현황판 시트 GID: 1526392803
      const sheetUrl = 'https://docs.google.com/spreadsheets/d/18Pdxzr_LVyCUF3ck1KbyjAYsv3CK5yXQCVjbXb2SZGA/export?format=csv&gid=1526392803';
      const response = await fetch(sheetUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const csvText = await response.text();
      const lines = csvText.split(/\r?\n/);
      const parsedData = [];
      let headerFound = false;
      let totalApprovedActions = 0;

      for (const line of lines) {
        // 쉼표로 분리하되 쌍따옴표 내의 쉼표는 무시하는 정규식
        const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (!parts || parts.length < 3) continue;

        const col0 = parts[0].replace(/^"|"$/g, '').trim();
        const col1 = parts[1] ? parts[1].replace(/^"|"$/g, '').trim() : '';
        const col2 = parts[2] ? parts[2].replace(/^"|"$/g, '').trim() : '';
        const col3 = parts[3] ? parts[3].replace(/^"|"$/g, '').trim() : '';

        // '순위'가 들어있는 행을 헤더 행으로 인식
        if (col0 === '순위') {
          headerFound = true;
          continue;
        }

        if (headerFound) {
          const rank = parseInt(col0, 10);
          const username = col1;
          const count = parseInt(col2, 10) || 0;
          const date = col3;

          // 데이터 유효성 검사 및 종료 처리
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

      // 최종 갱신 시간 기록
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

  // 상위 TOP 3 멤버 추출
  const topThree = leaderboard.slice(0, 3);
  const restOfLeaderboard = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-white text-black overflow-hidden">
      {/* 히어로 섹션 */}
      <section className="relative px-6 py-24 md:px-16 text-center bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            🌍 제2기 경산시 탄소중립 서포터즈 퍼스트펭귄
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
            탄소 다이어트
            <br />
            챌린지
          </h1>

          <p className="text-lg md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-10">
            일상 속 작은 탄소중립 실천으로
            <br />
            환경도 지키고 상품도 받아가세요.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href="https://www.instagram.com/fp.zero/"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 rounded-2xl bg-black text-white text-lg font-semibold hover:scale-105 transition shadow-lg"
            >
              📷 지금 참여하기
            </a>

            <a
              href="#live-leaderboard"
              className="px-8 py-4 rounded-2xl border border-gray-300 text-lg font-semibold bg-white hover:bg-gray-50 transition shadow-sm"
            >
              🏆 실시간 순위 보기
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="text-4xl mb-3">🎁</div>
              <h3 className="text-xl font-semibold mb-2">총 7명 당첨</h3>
              <p className="text-gray-500">친환경 감성 상품 증정</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="text-4xl mb-3">🎲</div>
              <h3 className="text-xl font-semibold mb-2">핀볼 시스템</h3>
              <p className="text-gray-500">인증 1개당 핀볼 +1</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="text-4xl mb-3">🔥</div>
              <h3 className="text-xl font-semibold mb-2">지금이 기회</h3>
              <p className="text-gray-500">지금 시작해도 역전 가능</p>
            </div>
          </div>
        </div>
      </section>

      {/* 리워드 섹션 */}
      <section className="px-6 md:px-16 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-green-600 font-semibold mb-3">CHALLENGE REWARD</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              챌린지 상품
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <a
                key={index}
                href={product.link}
                target="_blank"
                rel="noreferrer"
                className="group bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-xl transition duration-300 hover:-translate-y-1"
              >
                <div className="text-5xl mb-5">{product.emoji}</div>
                <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
                  {product.winner} 당첨
                </div>
                <h3 className="text-2xl font-semibold leading-snug mb-3 group-hover:text-green-600 transition">
                  {product.name}
                </h3>
                <p className="text-gray-500">상품 자세히 보기 →</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 참여 방법 섹션 */}
      <section className="px-6 md:px-16 py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-green-600 font-semibold mb-3">HOW TO JOIN</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              참여 방법
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
              >
                <div className="text-6xl font-bold text-gray-100 mb-6">
                  {step.number}
                </div>
                <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🏆 실시간 순위 현황판 섹션 (스프레드시트 연동) */}
      <section id="live-leaderboard" className="px-6 md:px-16 py-24 bg-white relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-500 text-sm font-semibold mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              LIVE 실시간 순위 피드
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              참여자 순위 현황판
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              현재 참여자분들의 실시간 인증 순위입니다. 아이디의 중간 정보는 개인정보 보호를 위해 마스킹 처리되었습니다.
            </p>
          </div>

          {/* 실시간 현황 요약 카드 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto">
            <div className="bg-green-50 border border-green-100 rounded-2xl p-5 text-center">
              <span className="text-sm text-green-700 font-semibold block mb-1">총 참가자 수</span>
              <span className="text-3xl font-bold text-green-950">{loading ? '...' : `${stats.totalParticipants}명`}</span>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-2xl p-5 text-center">
              <span className="text-sm text-green-700 font-semibold block mb-1">총 누적 인증 횟수</span>
              <span className="text-3xl font-bold text-green-950">{loading ? '...' : `${stats.totalActions}회`}</span>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-2xl p-5 text-center col-span-2 md:col-span-1">
              <span className="text-sm text-green-700 font-semibold block mb-1">마지막 업데이트</span>
              <span className="text-xs font-semibold text-green-950 block mt-2 break-all">{loading ? '가져오는 중...' : lastUpdated || '기록 없음'}</span>
            </div>
          </div>

          {/* 에러 상태 표시 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center max-w-2xl mx-auto mb-10">
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="text-xl font-bold text-red-800 mb-2">실시간 데이터를 가져오지 못했습니다</h3>
              <p className="text-red-600 mb-6">
                구글 스프레드시트 네트워크 지연 또는 설정 변경으로 인해 불러올 수 없습니다. 아래 현황판 원본 바로가기 버튼을 통해 원본 데이터를 확인하실 수 있습니다.
              </p>
              <button
                onClick={fetchLeaderboardData}
                className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
              >
                🔄 다시 시도하기
              </button>
            </div>
          )}

          {/* 로딩 스켈레톤 UI */}
          {loading && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* TOP 3 스켈레톤 */}
              <div className="grid grid-cols-3 gap-4 h-48 items-end max-w-xl mx-auto mb-10">
                <div className="bg-gray-100 animate-pulse rounded-2xl h-36"></div>
                <div className="bg-gray-200 animate-pulse rounded-2xl h-44"></div>
                <div className="bg-gray-100 animate-pulse rounded-2xl h-32"></div>
              </div>
              {/* 테이블 목록 스켈레톤 */}
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex justify-between items-center animate-pulse">
                    <div className="h-6 w-12 bg-gray-200 rounded-md"></div>
                    <div className="h-6 w-32 bg-gray-200 rounded-md"></div>
                    <div className="h-6 w-16 bg-gray-200 rounded-md"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 로딩 완료 및 데이터 정상 노출 상태 */}
          {!loading && !error && leaderboard.length > 0 && (
            <div className="max-w-4xl mx-auto space-y-10">
              
              {/* TOP 3 포디움 디자인 */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-end justify-center gap-6 max-w-2xl mx-auto">
                
                {/* 2등 실버 포디움 */}
                {topThree[1] && (
                  <div className="order-2 sm:order-1 flex-1 bg-gradient-to-t from-slate-100 to-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm hover:scale-[1.03] transition duration-300 text-center relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                    <div className="absolute top-0 right-0 left-0 bg-slate-200/50 py-1 text-xs font-semibold text-slate-700">2nd Place</div>
                    <div className="text-4xl mt-4 mb-2">🥈</div>
                    <h4 className="text-xl font-bold truncate text-slate-800">{topThree[1].username}</h4>
                    <div>
                      <span className="text-3xl font-extrabold text-slate-900">{topThree[1].count}</span>
                      <span className="text-sm text-slate-500 font-medium"> 개의 인증</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 font-medium">최초인증: {topThree[1].date?.split(' ')[0] || ''}</p>
                  </div>
                )}

                {/* 1등 골드 포디움 */}
                {topThree[0] && (
                  <div className="order-1 sm:order-2 flex-1 bg-gradient-to-t from-yellow-50 to-white border-2 border-yellow-300 rounded-[32px] p-8 shadow-md hover:scale-[1.05] transition duration-300 text-center relative overflow-hidden flex flex-col justify-between min-h-[260px] ring-4 ring-yellow-100">
                    <div className="absolute top-0 right-0 left-0 bg-yellow-300/50 py-1 text-xs font-bold text-yellow-800 tracking-wider">LEADER</div>
                    <div className="text-5xl mt-4 mb-2">👑 🥇</div>
                    <h4 className="text-2xl font-black truncate text-yellow-950">{topThree[0].username}</h4>
                    <div>
                      <span className="text-4xl font-black text-yellow-900">{topThree[0].count}</span>
                      <span className="text-sm text-yellow-700 font-bold"> 개의 인증</span>
                    </div>
                    <p className="text-[10px] text-yellow-600 mt-2 font-medium">최초인증: {topThree[0].date?.split(' ')[0] || ''}</p>
                  </div>
                )}

                {/* 3등 브론즈 포디움 */}
                {topThree[2] && (
                  <div className="order-3 sm:order-3 flex-1 bg-gradient-to-t from-orange-50 to-white border-2 border-orange-200 rounded-3xl p-6 shadow-sm hover:scale-[1.03] transition duration-300 text-center relative overflow-hidden flex flex-col justify-between min-h-[200px]">
                    <div className="absolute top-0 right-0 left-0 bg-orange-200/40 py-1 text-xs font-semibold text-orange-700">3rd Place</div>
                    <div className="text-4xl mt-4 mb-2">🥉</div>
                    <h4 className="text-xl font-bold truncate text-orange-800">{topThree[2].username}</h4>
                    <div>
                      <span className="text-3xl font-extrabold text-orange-950">{topThree[2].count}</span>
                      <span className="text-sm text-orange-500 font-medium"> 개의 인증</span>
                    </div>
                    <p className="text-[10px] text-orange-400 mt-2 font-medium">최초인증: {topThree[2].date?.split(' ')[0] || ''}</p>
                  </div>
                )}

              </div>

              {/* 4등 이하 순위 리스트 */}
              {restOfLeaderboard.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                  <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 grid grid-cols-12 text-sm font-semibold text-gray-500 text-center">
                    <div className="col-span-2">순위</div>
                    <div className="col-span-6 text-left pl-4">인스타그램 아이디</div>
                    <div className="col-span-4">인정(O) 개수</div>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {restOfLeaderboard.map((item, index) => (
                      <div
                        key={index}
                        className="px-6 py-4 grid grid-cols-12 items-center text-center hover:bg-gray-50/70 transition"
                      >
                        <div className="col-span-2 text-lg font-bold text-gray-400">
                          {item.rank}
                        </div>
                        <div className="col-span-6 text-left pl-4 font-semibold text-gray-700 truncate">
                          {item.username}
                        </div>
                        <div className="col-span-4 font-bold text-gray-800">
                          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-semibold">
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

          {/* 데이터 없음 예외 처리 */}
          {!loading && !error && leaderboard.length === 0 && (
            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-10 text-center max-w-md mx-auto">
              <div className="text-5xl mb-3">🏁</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">아직 인증된 기록이 없습니다</h3>
              <p className="text-gray-500 mb-4">인증하고 첫 1위의 주인공이 되어보세요!</p>
            </div>
          )}

          {/* 하단 제어 및 상세 데이터 링크 */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">
            <button
              onClick={fetchLeaderboardData}
              disabled={loading}
              className="px-6 py-3 bg-black text-white font-semibold rounded-2xl hover:scale-105 transition disabled:opacity-50 flex items-center gap-2 shadow-sm"
            >
              🔄 실시간 정보 새로고침
            </button>

            <a
              href="https://docs.google.com/spreadsheets/d/18Pdxzr_LVyCUF3ck1KbyjAYsv3CK5yXQCVjbXb2SZGA/edit?gid=1270585109#gid=1270585109"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 border border-gray-300 font-semibold rounded-2xl hover:bg-gray-50 transition shadow-sm text-gray-700 bg-white"
            >
              📊 구글 시트 원본 전체 보기
            </a>
          </div>
        </div>
      </section>

      {/* 실시간 경쟁/현황 안내 배너 (기존 배너를 더 고급스럽게 커스텀) */}
      <section className="px-6 md:px-16 py-12">
        <div className="max-w-5xl mx-auto bg-black text-white rounded-[40px] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-950/30 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          <div className="text-5xl mb-6">📢</div>

          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 tracking-tight">
            탄소 다이어트 챌린지는 진행 중!
          </h2>

          <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto mb-10">
            실시간 핀볼 룰렛 추첨은 누적 인정(O) 개수에 비례하여 당첨 확률이 증가합니다. 지금 바로 작은 실천을 통해 내 당첨 확률을 올려보세요!
          </p>

          <a
            href="https://www.instagram.com/fp.zero/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex px-8 py-4 rounded-2xl bg-white text-black text-lg font-bold hover:scale-105 transition shadow-lg"
          >
            📸 인스타그램 인증하러 가기
          </a>
        </div>
      </section>

      {/* 주의사항 섹션 */}
      <section className="px-6 md:px-16 py-24 bg-green-50">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-green-700 font-semibold mb-3">NOTICE</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-12">
            주의사항
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
              ❌ 단순 풍경 사진
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
              ❌ 빈 텀블러 인증샷
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
              ❌ 패션용 에코백 착용샷
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
              ❌ 기타 애매한 인증 사진
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 안내 및 마무리 섹션 */}
      <section className="px-6 md:px-16 py-28 text-center bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-6xl mb-6">🌱</div>

          <h2 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-8">
            여러분의 작은 실천이
            <br />
            지구의 미래를 바꿉니다.
          </h2>

          <p className="text-xl text-gray-600 leading-relaxed mb-12">
            문의사항은 인스타 DM 또는 에브리타임 댓글로
            <br />
            편하게 남겨주세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.instagram.com/fp.zero/"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 rounded-2xl bg-black text-white text-lg font-semibold hover:scale-105 transition shadow-lg"
            >
              @fp.zero 바로가기
            </a>

            <a
              href="https://docs.google.com/spreadsheets/d/18Pdxzr_LVyCUF3ck1KbyjAYsv3CK5yXQCVjbXb2SZGA/edit?gid=1270585109#gid=1270585109"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 rounded-2xl border border-gray-300 text-lg font-semibold bg-white hover:bg-gray-50 transition shadow-sm"
            >
              구글 시트 전체현황 보기
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
