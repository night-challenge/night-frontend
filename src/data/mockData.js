// 임시 mock 데이터 — 백엔드(/api/products, /api/products/options/:id, /api/engravings)
// 완성되면 USE_MOCK을 false로 바꾸면 원래 axios 코드가 그대로 작동함
export const USE_MOCK = true

// GET /api/products?category=xxx 응답(res.data.data.options)을 흉내낸 데이터
export const mockProductsByCategory = {
  '가방': [
    { id: 1, optionName: 'L Aren 비세토스 스쿨 토트', optionLabel: '갈색', price: 1250000 },
    { id: 2, optionName: 'L Aren 비세토스 스쿨 토트', optionLabel: '분홍', price: 1250000 },
    { id: 3, optionName: 'L Aren 비세토스 스쿨 토트', optionLabel: '검정', price: 1250000 },
  ],
  '트래블': [
    { id: 4, optionName: 'L 비세토스 수트케이스', optionLabel: '옵션1', price: 6750000 },
    { id: 5, optionName: 'L 비세토스 수트케이스', optionLabel: '옵션2', price: 6750000 },
  ],
  '패션소품': [
    { id: 6, optionName: '코스믹 스타 오 드 퍼퓸 75ml', optionLabel: '옵션1', price: 141000 },
    { id: 7, optionName: '코스믹 스타 오 드 퍼퓸 75ml', optionLabel: '옵션2', price: 141000 },
  ],
  '라이프스타일': [
    { id: 8, optionName: '엠보스드 모노그램 레더 에어팟 프로 케이스', optionLabel: '기본', price: 310000 },
  ],
}

// GET /api/products/options/{optionId} 응답(res.data.data)을 흉내낸 데이터
export const mockProductDetails = {
  1: {
    id: 1, optionName: 'L Aren 비세토스 스쿨 토트', optionLabel: '갈색', price: 1250000,
    description: '천연 가죽 트림이 더해진 비세토스 모노그램 캔버스 토트백\n학생부터 직장인까지, 누구나 언제 어디서나\n실용적으로 활용할 수 있도록 디자인된 라지 토트백입니다.\n\n시그니처 비세토스 모노그램의 타임리스한 아름다움이 담겨 있으며,\n24K 도금 로고 브라스 플레이트 장식이 고급스러움을 더합니다.\n\n문서, 노트북, 데일리 아이템까지 넉넉하게 수납할 수 있는\n실용적인 내부 공간도 갖추고 있습니다.',
  },
  2: {
    id: 2, optionName: 'L Aren 비세토스 스쿨 토트', optionLabel: '분홍', price: 1250000,
    description: '천연 가죽 트림이 더해진 비세토스 모노그램 캔버스 토트백\n학생부터 직장인까지, 누구나 언제 어디서나\n실용적으로 활용할 수 있도록 디자인된 라지 토트백입니다.',
  },
  3: {
    id: 3, optionName: 'L Aren 비세토스 스쿨 토트', optionLabel: '검정', price: 1250000,
    description: '천연 가죽 트림이 더해진 비세토스 모노그램 캔버스 토트백\n학생부터 직장인까지, 누구나 언제 어디서나\n실용적으로 활용할 수 있도록 디자인된 라지 토트백입니다.',
  },
  4: {
    id: 4, optionName: 'L 비세토스 수트케이스', optionLabel: '옵션1', price: 6750000,
    description: '시대를 초월한 캐리어 수공예 기술을 증명합니다.\n\n70년대 뮌헨의 문화 전성기에 탄생하여 독일 역사에서\n유명한 그 시기의 세련된 여행 감성을 구현한\n라지 하드케이스 비세토스 수트케이스입니다.\n\n소가죽으로 감싼 모서리와 티없이 깨끗한 마이크로파이버\n스웨이드 소재의 내부 및 24K 도금 래치 잠금 장치가 돋보이는\n헤리티지 동반자입니다.',
  },
  5: {
    id: 5, optionName: 'L 비세토스 수트케이스', optionLabel: '옵션2', price: 6750000,
    description: '시대를 초월한 캐리어 수공예 기술을 증명합니다.\n\n70년대 뮌헨의 문화 전성기에 탄생하여 독일 역사에서\n유명한 그 시기의 세련된 여행 감성을 구현한\n라지 하드케이스 비세토스 수트케이스입니다.',
  },
  6: {
    id: 6, optionName: '코스믹 스타 오 드 퍼퓸 75ml', optionLabel: '옵션1', price: 141000,
    description: "자신만의 빛으로 세상을 밝히는 이들을 위한 향수\n\n모험가와 꿈꾸는 이들을 위한 천상의 향기\n'코즈믹 스타'는 자유분방함과 자신감, 그리고 호기심을 발산합니다.\n\n우주의 에너지에서 영감을 받은 이 여성용 향수는 페어와 은방울꽃,\n코코넛 워터의 산뜻한 탑 노트로 그 빛을 발합니다.\n\n신선한 꽃향기의 에너지를 품은 '코즈믹 스타'의 진정한 매력은 시간\n이 흐를수록 그 본연의 향을 풍성하게 드러냅니다.\n\n그리고 지평선 너머에서 전해오는 바닐라, 화이트 초콜릿, 오크모스\n의 달콤하고 평온한 잔향 속에 몸을 맡겨보세요.",
  },
  7: {
    id: 7, optionName: '코스믹 스타 오 드 퍼퓸 75ml', optionLabel: '옵션2', price: 141000,
    description: "자신만의 빛으로 세상을 밝히는 이들을 위한 향수\n\n모험가와 꿈꾸는 이들을 위한 천상의 향기\n'코즈믹 스타'는 자유분방함과 자신감, 그리고 호기심을 발산합니다.",
  },
  8: {
    id: 8, optionName: '엠보스드 모노그램 레더 에어팟 프로 케이스', optionLabel: '기본', price: 310000,
    description: '헤리티지 모노그램이 돋보이는 모바일 액세서리 케이스\n\n풀그레인 나파 가죽으로 제작된 에어팟 프로 케이스.\n클래식 비세토스 모노그램이 엠보싱으로 표현되었으며,\n바이에른 다이아몬드에서 영감을 받은\n스프링 클래스프가 더해져 백에 부착할 수 있습니다.',
  },
}

// GET /api/engravings 응답(res.data.data.records) — 문서에 있던 예시 그대로
export const mockEngravings = [

]