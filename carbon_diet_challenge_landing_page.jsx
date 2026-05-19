export default function CarbonChallengeLandingPage() {
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

  return (
    <div className="min-h-screen bg-white text-black overflow-hidden">
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
              className="px-8 py-4 rounded-2xl bg-black text-white text-lg font-semibold hover:scale-105 transition"
            >
              📷 지금 참여하기
            </a>

            <a
              href="https://docs.google.com/spreadsheets/d/18Pdxzr_LVyCUF3ck1KbyjAYsv3CK5yXQCVjbXb2SZGA/edit?gid=1270585109#gid=1270585109"
              target="_blank"
              className="px-8 py-4 rounded-2xl border border-gray-300 text-lg font-semibold hover:bg-gray-50 transition"
            >
              📊 실시간 현황 보기
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="text-4xl mb-3">🎁</div>
              <h3 className="text-xl font-semibold mb-2">총 7명 당첨</h3>
              <p className="text-gray-500">친환경 감성 상품 증정</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="text-4xl mb-3">🎲</div>
              <h3 className="text-xl font-semibold mb-2">핀볼 시스템</h3>
              <p className="text-gray-500">인증 1개당 핀볼 +1</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="text-4xl mb-3">🔥</div>
              <h3 className="text-xl font-semibold mb-2">지금이 기회</h3>
              <p className="text-gray-500">지금 시작해도 역전 가능</p>
            </div>
          </div>
        </div>
      </section>

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

      <section className="px-6 md:px-16 py-24">
        <div className="max-w-5xl mx-auto bg-black text-white rounded-[40px] p-10 md:p-16 text-center">
          <div className="text-5xl mb-6">📊</div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            실시간 경쟁 공개 중
          </h2>

          <p className="text-xl text-gray-300 leading-relaxed mb-10">
            현재 순위, 인정 개수, 핀볼 현황까지
            <br />
            모두 실시간으로 공개됩니다.
          </p>

          <a
            href="https://docs.google.com/spreadsheets/d/18Pdxzr_LVyCUF3ck1KbyjAYsv3CK5yXQCVjbXb2SZGA/edit?gid=1270585109#gid=1270585109"
            target="_blank"
            className="inline-flex px-8 py-4 rounded-2xl bg-white text-black text-lg font-semibold hover:scale-105 transition"
          >
            현황판 바로가기
          </a>
        </div>
      </section>

      <section className="px-6 md:px-16 py-24 bg-green-50">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-green-700 font-semibold mb-3">NOTICE</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-12">
            주의사항
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="bg-white rounded-3xl p-6 border border-gray-100">
              ❌ 단순 풍경 사진
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100">
              ❌ 빈 텀블러 인증샷
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100">
              ❌ 패션용 에코백 착용샷
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100">
              ❌ 기타 애매한 인증 사진
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-16 py-28 text-center">
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
              className="px-8 py-4 rounded-2xl bg-black text-white text-lg font-semibold hover:scale-105 transition"
            >
              @fp.zero 바로가기
            </a>

            <a
              href="https://docs.google.com/spreadsheets/d/18Pdxzr_LVyCUF3ck1KbyjAYsv3CK5yXQCVjbXb2SZGA/edit?gid=1270585109#gid=1270585109"
              target="_blank"
              className="px-8 py-4 rounded-2xl border border-gray-300 text-lg font-semibold hover:bg-gray-50 transition"
            >
              현황판 보기
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
