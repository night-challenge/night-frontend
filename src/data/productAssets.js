import bagBrownThumb from '../assets/bag_brown_thumb.svg'
import bagPinkThumb from '../assets/bag_pink_thumb.svg'
import bagBlackThumb from '../assets/bag_black_thumb.svg'
import travelOption1Thumb from '../assets/travel_option1_thumb.svg'
import travelOption2Thumb from '../assets/travel_option2_thumb.svg'
import fashionPerfumeThumb1 from '../assets/fashion_perfume_thumb1.svg'
import fashionPerfumeThumb2 from '../assets/fashion_perfume_thumb2.svg'
import lifestyleAirpodCase from '../assets/lifestyle_airpod_case.svg'

import bagBrownDetail from '../assets/bag_brown_detail.svg'
import bagPinkDetail from '../assets/bag_pink_detail.svg'
import bagBlackDetail from '../assets/bag_black_detail.svg'
import travelOption1Detail from '../assets/travel_option1_detail.svg'
import travelOption2Detail from '../assets/travel_option2_detail.svg'
import fashionPerfumeDetail1 from '../assets/fashion_perfume_option1_detail.svg'
import fashionPerfumeDetail2 from '../assets/fashion_perfume_option2_detail.svg'
import lifestyleAirpodCaseDetail from '../assets/lifestyle_airpod_case_detail.svg'

// 각인 오버레이 전용 base 이미지 (140x160 캔버스, engraving_ 접두어)
import engravingBagBrown from '../assets/engraving_bag_brown.svg'
import engravingBagPink from '../assets/engraving_bag_pink.svg'
import engravingBagBlack from '../assets/engraving_bag_black.svg'
import engravingTravelOption1 from '../assets/engraving_travel_option1.svg'
import engravingTravelOption2 from '../assets/engraving_travel_option2.svg'
import engravingFashionOption1 from '../assets/engraving_fashion_option1.svg'
import engravingFashionOption2 from '../assets/engraving_fashion_option2.svg'
import engravingLifestyleAirpod from '../assets/engraving_lifestyle_airpod.svg'

export const engravingBaseImageMap = {
  '가방': {
    '갈색': engravingBagBrown,
    '분홍': engravingBagPink,
    '검정': engravingBagBlack,
  },
  '트래블': {
    '갈색': engravingTravelOption1,
    '분홍': engravingTravelOption2,
  },
  '패션소품': {
    '50ml': engravingFashionOption1,
    '75ml': engravingFashionOption2,
  },
  '라이프스타일': {
    '기본': engravingLifestyleAirpod,
  },
}

export const thumbMap = {
  '가방': {
    '갈색': bagBrownThumb,
    '분홍': bagPinkThumb,
    '검정': bagBlackThumb,
  },
  '트래블': {
    '갈색': travelOption1Thumb,
    '분홍': travelOption2Thumb,
  },
  '패션소품': {
    '50ml': fashionPerfumeThumb1,
    '75ml': fashionPerfumeThumb2,
  },
  '라이프스타일': {
    '기본': lifestyleAirpodCase,
  },
}

export const detailImageMap = {
  '가방': {
    '갈색': bagBrownDetail,
    '분홍': bagPinkDetail,
    '검정': bagBlackDetail,
  },
  '트래블': {
    '갈색': travelOption1Detail,
    '분홍': travelOption2Detail,
  },
  '패션소품': {
    '50ml': fashionPerfumeDetail1,
    '75ml': fashionPerfumeDetail2,
  },
  '라이프스타일': {
    '기본': lifestyleAirpodCaseDetail,
  },
}