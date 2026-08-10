import bagBrownThumb from '../assets/bag_brown_thumb.svg'
import bagPinkThumb from '../assets/bag_pink_thumb.svg'
import bagBlackThumb from '../assets/bag_black_thumb.svg'
import travelOption1Thumb from '../assets/travel_option1_thumb.svg'
import travelOption2Thumb from '../assets/travel_option2_thumb.svg'
import fashionPerfumeThumb1 from '../assets/fashion_perfume_thumb1.svg'
import fashionPerfumeThumb2 from '../assets/fashion_perfume_thumb2.svg'
import lifestyleAirpodCase from '../assets/lifestyle_airpod_case.svg'

// 새로 추가: 상세페이지 큰 메인 이미지 (가윤이 직접 넣을 파일들)
// 아직 파일이 없으면 import 줄을 주석 처리하고 아래 detailImageMap 값도 null로 둬도 됨
import bagBrownDetail from '../assets/bag_brown_detail.svg'
import bagPinkDetail from '../assets/bag_pink_detail.svg'
import bagBlackDetail from '../assets/bag_black_detail.svg'
import travelOption1Detail from '../assets/travel_option1_detail.svg'
import travelOption2Detail from '../assets/travel_option2_detail.svg'
import fashionPerfumeDetail1 from '../assets/fashion_perfume_option1_detail.svg'
import fashionPerfumeDetail2 from '../assets/fashion_perfume_option2_detail.svg'
import lifestyleAirpodCaseDetail from '../assets/lifestyle_airpod_case_detail.svg'

export const thumbMap = {
  '가방': {
    '갈색': bagBrownThumb,
    '분홍': bagPinkThumb,
    '검정': bagBlackThumb,
  },
  '트래블': {
    '옵션1': travelOption1Thumb,
    '옵션2': travelOption2Thumb,
  },
  '패션소품': {
    '옵션1': fashionPerfumeThumb1,
    '옵션2': fashionPerfumeThumb2,
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
    '옵션1': travelOption1Detail,
    '옵션2': travelOption2Detail,
  },
  '패션소품': {
    '옵션1': fashionPerfumeDetail1,
    '옵션2': fashionPerfumeDetail2,
  },
  '라이프스타일': {
    '기본': lifestyleAirpodCaseDetail,
  },
}