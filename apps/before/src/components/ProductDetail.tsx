import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import _ from "lodash";
import moment from "moment";
import type { Product } from "@perf-mono/types";

const Container = styled.div`
  padding: 40px 0;
`;

const ProductDetailContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  margin-bottom: 50px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const ImageContainer = styled.div`
  position: relative;
`;

const MainImage = styled.img`
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: 20px;

  /* 의도적으로 무거운 필터 효과 */
  filter: brightness(1.1) contrast(1.3) saturate(1.4)
    drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));

  transition: all 0.5s ease;

  &:hover {
    filter: brightness(1.2) contrast(1.5) saturate(1.6)
      drop-shadow(0 20px 50px rgba(0, 0, 0, 0.5));
    transform: scale(1.02);
  }
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
  overflow-x: auto;
`;

const Thumbnail = styled.img<{ active: boolean }>`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;

  ${(props) =>
    props.active
      ? `
    border: 3px solid #667eea;
    transform: scale(1.1);
  `
      : `
    border: 2px solid transparent;
    opacity: 0.7;
  `}

  &:hover {
    opacity: 1;
    transform: scale(1.05);
  }
`;

const ProductInfo = styled.div`
  padding: 20px;
`;

const ProductTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #333;

  /* 의도적으로 무거운 텍스트 효과 */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  animation: titleGlow 3s ease-in-out infinite;

  @keyframes titleGlow {
    0%,
    100% {
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    }
    50% {
      text-shadow: 2px 2px 8px rgba(102, 126, 234, 0.3);
    }
  }
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
`;

const Price = styled.span`
  font-size: 2.5rem;
  font-weight: bold;
  color: #e74c3c;

  /* 의도적으로 무거운 애니메이션 */
  animation: priceGlow 2s ease-in-out infinite;

  @keyframes priceGlow {
    0%,
    100% {
      text-shadow: 0 0 10px rgba(231, 76, 60, 0.5);
      transform: scale(1);
    }
    50% {
      text-shadow: 0 0 25px rgba(231, 76, 60, 0.8);
      transform: scale(1.05);
    }
  }
`;

const OriginalPrice = styled.span`
  text-decoration: line-through;
  color: #999;
  font-size: 1.8rem;
`;

const Description = styled.div`
  margin-bottom: 30px;

  h3 {
    margin-bottom: 15px;
    color: #333;
  }

  p {
    line-height: 1.8;
    color: #666;
    margin-bottom: 15px;
  }
`;

const AddToCartButton = styled.button`
  width: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 30px;
  font-weight: bold;
  font-size: 1.3rem;
  cursor: pointer;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;

  /* 의도적으로 무거운 호버 효과 */
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  }

  &:active {
    transform: translateY(-2px);
  }

  /* 의도적으로 무거운 파급 효과 */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const MetricsPanel = styled.div`
  background: rgba(0, 0, 0, 0.05);
  padding: 20px;
  border-radius: 15px;
  margin-top: 30px;
`;

const LiveMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
`;

const MetricItem = styled.div`
  background: white;
  padding: 15px;
  border-radius: 10px;
  text-align: center;

  /* 의도적으로 무거운 애니메이션 */
  animation: metricPulse 2s ease-in-out infinite;

  @keyframes metricPulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
  }

  .label {
    font-size: 12px;
    color: #666;
    margin-bottom: 5px;
  }

  .value {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }
`;

interface ProductDetailProps {
  products: any[];
  onAddToCart: (product: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  products,
  onAddToCart,
}) => {
  const { id } = useParams<{ id: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [liveMetrics, setLiveMetrics] = useState({
    viewTime: 0,
    scrollPosition: 0,
    mouseMovements: 0,
    calculations: 0,
  });

  // 의도적으로 느린 상품 찾기
  const product = products.find((p) => p.id === id);

  // 의도적으로 무거운 실시간 메트릭 수집
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics((prev) => {
        // 의도적으로 무거운 계산
        const heavyCalculation = _.range(1000).reduce((acc, num) => {
          return acc + Math.sin(num) * Math.cos(num) * Math.random();
        }, 0);

        return {
          viewTime: prev.viewTime + 1,
          scrollPosition: window.scrollY,
          mouseMovements: prev.mouseMovements + Math.random(),
          calculations: heavyCalculation,
        };
      });
    }, 100); // 매 100ms마다 업데이트

    const handleMouseMove = () => {
      setLiveMetrics((prev) => ({
        ...prev,
        mouseMovements: prev.mouseMovements + 1,
      }));
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearInterval(interval);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (!product) {
    return (
      <Container>
        <div style={{ textAlign: "center", padding: "50px" }}>
          <h2>🚫 Product Not Found</h2>
          <p>The product you're looking for doesn't exist.</p>
        </div>
      </Container>
    );
  }

  // 의도적으로 무거운 실시간 처리
  const processedProduct = {
    ...product,
    viewData: {
      currentTime: moment().format("YYYY-MM-DD HH:mm:ss:SSS"),
      processedDescription: _.repeat(product.description, 2),
      heavyCalculations: _.range(200).map((i) => Math.sin(i * product.price)),
      randomMetrics: _.range(100).map(() => Math.random() * product.price),
    },
  };

  const averageCalculation = _.mean(
    processedProduct.viewData.heavyCalculations
  );

  return (
    <Container>
      <ProductDetailContainer>
        <ImageContainer>
          <MainImage
            src={product.images[selectedImageIndex] || product.images[0]}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = `https://via.placeholder.com/500x500?text=${encodeURIComponent(product.name)}`;
            }}
          />

          <ThumbnailContainer>
            {product.images.map((image: string, index: number) => (
              <Thumbnail
                key={index}
                src={image}
                alt={`${product.name} ${index + 1}`}
                active={index === selectedImageIndex}
                onClick={() => setSelectedImageIndex(index)}
                onError={(e) => {
                  e.currentTarget.src = `https://via.placeholder.com/80x80?text=${index + 1}`;
                }}
              />
            ))}
          </ThumbnailContainer>
        </ImageContainer>

        <ProductInfo>
          <ProductTitle>{product.name}</ProductTitle>

          <PriceContainer>
            <Price>${product.price}</Price>
            {product.originalPrice && (
              <OriginalPrice>${product.originalPrice}</OriginalPrice>
            )}
          </PriceContainer>

          <Description>
            <h3>📝 Description</h3>
            <p>{processedProduct.viewData.processedDescription}</p>

            <h3>📊 Product Details</h3>
            <p>
              ⭐ Rating: {product.rating}/5 ({product.reviewCount} reviews)
            </p>
            <p>🏷️ Category: {product.category}</p>
            <p>📅 Created: {product.formattedDate}</p>
            <p>🔢 Average Calculation: {averageCalculation.toFixed(4)}</p>
          </Description>

          <AddToCartButton onClick={() => onAddToCart(product)}>
            🛒 Add to Cart - ${product.price}
          </AddToCartButton>

          <MetricsPanel>
            <h4>📈 Live Metrics</h4>
            <p>Real-time data for this product view</p>

            <LiveMetrics>
              <MetricItem>
                <div className="label">View Time</div>
                <div className="value">{liveMetrics.viewTime}s</div>
              </MetricItem>

              <MetricItem>
                <div className="label">Scroll Position</div>
                <div className="value">{liveMetrics.scrollPosition}px</div>
              </MetricItem>

              <MetricItem>
                <div className="label">Mouse Movements</div>
                <div className="value">{liveMetrics.mouseMovements}</div>
              </MetricItem>

              <MetricItem>
                <div className="label">Heavy Calculation</div>
                <div className="value">
                  {liveMetrics.calculations.toFixed(2)}
                </div>
              </MetricItem>

              <MetricItem>
                <div className="label">Current Time</div>
                <div className="value">
                  {processedProduct.viewData.currentTime}
                </div>
              </MetricItem>

              <MetricItem>
                <div className="label">Image Index</div>
                <div className="value">
                  {selectedImageIndex + 1}/{product.images.length}
                </div>
              </MetricItem>
            </LiveMetrics>
          </MetricsPanel>
        </ProductInfo>
      </ProductDetailContainer>
    </Container>
  );
};

export default ProductDetail;
