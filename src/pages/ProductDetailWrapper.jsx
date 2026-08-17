import { useParams } from 'react-router-dom'
import ProductDetail from './ProductDetail'

function ProductDetailWrapper() {
  const { optionId } = useParams()
  return <ProductDetail key={optionId} />
}

export default ProductDetailWrapper