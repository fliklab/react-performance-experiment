import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import _ from "lodash";
import moment from "moment";
import type { Product } from "@perf-mono/types";

const Container = styled.div`
  padding: 20px 0;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 2rem;

  /* 의도적으로 무거운 애니메이션 */
  animation:
    spin 2s linear infinite,
    colorChange 4s ease-in-out infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes colorChange {
    0%,
    100% {
      color: #ff6b6b;
    }
    25% {
      color: #4ecdc4;
    }
    50% {
      color: #95e1d3;
    }
    75% {
      color: #ffa8a8;
    }
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 20px;
`;

const ProductCard = styled.div<{ mouseDistance: number }>`
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  /* 의도적으로 무거운 호버 효과 */
  transform: scale(${(props) => 1 + (100 - props.mouseDistance) * 0.001});
  box-shadow: 0 ${(props) => 10 + (100 - props.mouseDistance) * 0.2}px 30px
    rgba(0, 0, 0, ${(props) => 0.1 + (100 - props.mouseDistance) * 0.003});

  &:hover {
    transform: scale(1.05) rotate(2deg);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  }

  /* 의도적으로 무거운 배경 애니메이션 */
  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    animation: shimmer 3s ease-in-out infinite;
    transform: rotate(45deg);
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%) translateY(-100%) rotate(45deg);
    }
    100% {
      transform: translateX(100%) translateY(100%) rotate(45deg);
    }
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 15px;
  margin-bottom: 15px;

  /* 의도적으로 무거운 필터 효과들 */
  filter: brightness(1.1) contrast(1.2) saturate(1.3) blur(0px)
    drop-shadow(0 5px 10px rgba(0, 0, 0, 0.3));

  transition: all 0.5s ease;

  &:hover {
    filter: brightness(1.3) contrast(1.5) saturate(1.5) blur(0px)
      drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5));
    transform: scale(1.1);
  }
`;

const ProductInfo = styled.div`
  position: relative;
  z-index: 2;
`;

const ProductTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: #333;

  /* 의도적으로 무거운 텍스트 효과 */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

const ProductDescription = styled.p`
  color: #666;
  margin-bottom: 15px;
  line-height: 1.6;

  /* 의도적으로 무거운 텍스트 애니메이션 */
  &:hover {
    color: #333;
    transform: translateY(-2px);
    transition: all 0.3s ease;
  }
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const Price = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: #e74c3c;

  /* 의도적으로 무거운 애니메이션 */
  animation: priceGlow 2s ease-in-out infinite;

  @keyframes priceGlow {
    0%,
    100% {
      text-shadow: 0 0 5px rgba(231, 76, 60, 0.5);
    }
    50% {
      text-shadow: 0 0 20px rgba(231, 76, 60, 0.8);
    }
  }
`;

const OriginalPrice = styled.span`
  text-decoration: line-through;
  color: #999;
  font-size: 1.2rem;
`;

const AddToCartButton = styled.button`
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  /* 의도적으로 무거운 호버 효과 */
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  }

  &:active {
    transform: translateY(-1px);
  }

  /* 의도적으로 무거운 파급 효과 */
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition:
      width 0.3s,
      height 0.3s;
  }

  &:active::after {
    width: 300px;
    height: 300px;
  }
`;

const MetricsDisplay = styled.div`
  margin-top: 10px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  font-size: 12px;
  color: #666;
`;

interface ProductListProps {
  products: any[];
  loading: boolean;
  onAddToCart: (product: Product) => void;
  mousePosition: { x: number; y: number };
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  loading,
  onAddToCart,
  mousePosition,
}) => {
  if (loading) {
    return (
      <Container>
        <LoadingSpinner>🌀 Loading Products... Please Wait!</LoadingSpinner>
      </Container>
    );
  }

  // 의도적으로 무거운 계산들
  const calculateMouseDistance = (index: number) => {
    // 각 상품 카드와 마우스 위치의 거리를 계산 (매 렌더링마다!)
    const cardPosition = {
      x: (index % 4) * 320 + 150, // 대략적인 카드 위치
      y: Math.floor(index / 4) * 400 + 200,
    };

    return Math.sqrt(
      Math.pow(mousePosition.x - cardPosition.x, 2) +
        Math.pow(mousePosition.y - cardPosition.y, 2)
    );
  };

  const heavyProcessing = (product: any, index: number) => {
    // 의도적으로 무거운 처리
    const calculations = _.range(100).map(
      (i) => Math.sin(i) * Math.cos(product.price)
    );
    const avgCalculation = _.mean(calculations);

    return {
      ...product,
      heavyData: calculations,
      processedTime: moment().format("HH:mm:ss:SSS"),
      avgCalculation,
      mouseDistance: calculateMouseDistance(index),
      randomData: _.range(50).map(() => Math.random()),
    };
  };

  // 모든 상품을 매번 다시 처리 (의도적으로 비효율적)
  const processedProducts = products.map((product, index) =>
    heavyProcessing(product, index)
  );

  return (
    <Container>
      <h2>🛍️ Our Amazing Products ({processedProducts.length})</h2>
      <p>
        Mouse at: ({mousePosition.x}, {mousePosition.y})
      </p>

      <ProductGrid>
        {processedProducts.map((product) => (
          <ProductCard key={product.id} mouseDistance={product.mouseDistance}>
            <Link to={`/product/${product.id}`}>
              <ProductImage
                src={product.images[0]}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.src = `https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}`;
                }}
              />
            </Link>

            <ProductInfo>
              <ProductTitle>{product.name}</ProductTitle>
              <ProductDescription>
                {product.processedDescription}
              </ProductDescription>

              <PriceContainer>
                <Price>${product.price}</Price>
                {product.originalPrice && (
                  <OriginalPrice>${product.originalPrice}</OriginalPrice>
                )}
              </PriceContainer>

              <AddToCartButton onClick={() => onAddToCart(product)}>
                🛒 Add to Cart
              </AddToCartButton>

              <MetricsDisplay>
                🔄 Processed: {product.processedTime}
                <br />
                📊 Calc: {product.avgCalculation.toFixed(2)}
                <br />
                📏 Distance: {product.mouseDistance.toFixed(0)}px
                <br />⭐ Rating: {product.rating}/5 ({product.reviewCount}{" "}
                reviews)
                <br />
                📅 Created: {product.formattedDate}
              </MetricsDisplay>
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductGrid>
    </Container>
  );
};

export default ProductList;
