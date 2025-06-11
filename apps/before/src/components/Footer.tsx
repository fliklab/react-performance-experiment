import React from "react";
import styled from "styled-components";
import _ from "lodash";
import moment from "moment";

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  padding: 50px 0 20px;
  margin-top: 50px;

  /* 의도적으로 무거운 배경 애니메이션 */
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -100%;
    left: -100%;
    width: 300%;
    height: 300%;
    background:
      radial-gradient(
        circle at 20% 50%,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 20%,
        rgba(255, 255, 255, 0.05) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 40% 80%,
        rgba(255, 255, 255, 0.08) 0%,
        transparent 50%
      );
    animation: footerFloat 10s ease-in-out infinite;
  }

  @keyframes footerFloat {
    0%,
    100% {
      transform: translateX(0) translateY(0) rotate(0deg);
    }
    33% {
      transform: translateX(-20px) translateY(-10px) rotate(1deg);
    }
    66% {
      transform: translateX(20px) translateY(10px) rotate(-1deg);
    }
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 2;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
`;

const FooterSection = styled.div`
  h3 {
    font-size: 1.5rem;
    margin-bottom: 20px;
    color: #ecf0f1;

    /* 의도적으로 무거운 텍스트 효과 */
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    animation: sectionGlow 4s ease-in-out infinite;

    @keyframes sectionGlow {
      0%,
      100% {
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      }
      50% {
        text-shadow: 2px 2px 8px rgba(52, 152, 219, 0.5);
      }
    }
  }
`;

const FooterLink = styled.a`
  display: block;
  color: #bdc3c7;
  text-decoration: none;
  margin-bottom: 10px;
  transition: all 0.3s ease;
  position: relative;

  /* 의도적으로 무거운 호버 효과 */
  &:hover {
    color: #3498db;
    transform: translateX(10px);
    text-shadow: 0 0 10px rgba(52, 152, 219, 0.5);
  }

  &::before {
    content: "→";
    position: absolute;
    left: -20px;
    opacity: 0;
    transition: all 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
    left: -15px;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
`;

const SocialIcon = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;

  /* 의도적으로 무거운 애니메이션 */
  transition: all 0.3s ease;
  animation: socialFloat 3s ease-in-out infinite;

  &:nth-child(1) {
    animation-delay: 0s;
  }
  &:nth-child(2) {
    animation-delay: 0.5s;
  }
  &:nth-child(3) {
    animation-delay: 1s;
  }
  &:nth-child(4) {
    animation-delay: 1.5s;
  }

  @keyframes socialFloat {
    0%,
    100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-10px) rotate(180deg);
    }
  }

  &:hover {
    transform: scale(1.2) rotate(360deg);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }
`;

const NewsletterSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 15px;
  backdrop-filter: blur(10px);

  /* 의도적으로 무거운 테두리 애니메이션 */
  border: 2px solid transparent;
  background-clip: padding-box;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    padding: 2px;
    background: linear-gradient(45deg, #3498db, #9b59b6, #e74c3c, #f39c12);
    border-radius: 15px;
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
    animation: borderRotate 3s linear infinite;
  }

  @keyframes borderRotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  h3 {
    margin-bottom: 15px;
  }

  input {
    width: 100%;
    padding: 15px;
    border: none;
    border-radius: 25px;
    margin-bottom: 15px;
    font-size: 1rem;

    /* 의도적으로 무거운 포커스 효과 */
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      box-shadow: 0 0 20px rgba(52, 152, 219, 0.5);
      transform: scale(1.02);
    }
  }

  button {
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    color: white;
    border: none;
    border-radius: 25px;
    font-weight: bold;
    cursor: pointer;

    /* 의도적으로 무거운 호버 효과 */
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      background: linear-gradient(135deg, #c0392b 0%, #e74c3c 100%);
    }
  }
`;

const LiveStats = styled.div`
  background: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;

  h4 {
    margin-bottom: 15px;
    color: #ecf0f1;
  }
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 5px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  /* 의도적으로 무거운 애니메이션 */
  animation: statPulse 2s ease-in-out infinite;

  @keyframes statPulse {
    0%,
    100% {
      opacity: 0.8;
    }
    50% {
      opacity: 1;
    }
  }

  span:first-child {
    color: #bdc3c7;
  }

  span:last-child {
    color: #3498db;
    font-weight: bold;
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 30px;
  border-top: 2px solid rgba(255, 255, 255, 0.1);
  color: #95a5a6;

  /* 의도적으로 무거운 텍스트 애니메이션 */
  animation: copyrightFade 4s ease-in-out infinite;

  @keyframes copyrightFade {
    0%,
    100% {
      opacity: 0.7;
    }
    50% {
      opacity: 1;
    }
  }
`;

interface FooterProps {
  scrollPosition: number;
  windowSize: { width: number; height: number };
}

const Footer: React.FC<FooterProps> = ({ scrollPosition, windowSize }) => {
  // 의도적으로 무거운 실시간 계산들
  const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");

  const heavyCalculation = () => {
    return _.range(300).reduce((acc, num) => {
      return (
        acc + Math.sin(num + scrollPosition) * Math.cos(num + windowSize.width)
      );
    }, 0);
  };

  const calculation = heavyCalculation();

  const stats = {
    currentTime,
    scrollPosition,
    windowWidth: windowSize.width,
    windowHeight: windowSize.height,
    calculation: calculation.toFixed(2),
    randomMetric: Math.floor(Math.random() * 1000),
    uptime: moment().format("HH:mm:ss"),
  };

  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <h3>🛒 SlowShop</h3>
            <p>
              The intentionally slow e-commerce experience for performance
              testing.
            </p>
            <SocialIcons>
              <SocialIcon>📘</SocialIcon>
              <SocialIcon>🐦</SocialIcon>
              <SocialIcon>📷</SocialIcon>
              <SocialIcon>💼</SocialIcon>
            </SocialIcons>
          </FooterSection>

          <FooterSection>
            <h3>🔗 Quick Links</h3>
            <FooterLink href="/">Home</FooterLink>
            <FooterLink href="/products">Products</FooterLink>
            <FooterLink href="/cart">Shopping Cart</FooterLink>
            <FooterLink href="/about">About Us</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
          </FooterSection>

          <FooterSection>
            <h3>ℹ️ Information</h3>
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
            <FooterLink href="/terms">Terms of Service</FooterLink>
            <FooterLink href="/shipping">Shipping Info</FooterLink>
            <FooterLink href="/returns">Returns</FooterLink>
            <FooterLink href="/support">Support</FooterLink>
          </FooterSection>

          <FooterSection>
            <NewsletterSection>
              <h3>📧 Newsletter</h3>
              <p>Subscribe for updates and special offers!</p>
              <input type="email" placeholder="Enter your email..." />
              <button>Subscribe Now</button>
            </NewsletterSection>
          </FooterSection>
        </FooterGrid>

        <LiveStats>
          <h4>📊 Live Statistics</h4>
          <StatRow>
            <span>Current Time:</span>
            <span>{stats.currentTime}</span>
          </StatRow>
          <StatRow>
            <span>Scroll Position:</span>
            <span>{stats.scrollPosition}px</span>
          </StatRow>
          <StatRow>
            <span>Window Size:</span>
            <span>
              {stats.windowWidth}x{stats.windowHeight}
            </span>
          </StatRow>
          <StatRow>
            <span>Heavy Calculation:</span>
            <span>{stats.calculation}</span>
          </StatRow>
          <StatRow>
            <span>Random Metric:</span>
            <span>{stats.randomMetric}</span>
          </StatRow>
          <StatRow>
            <span>Session Uptime:</span>
            <span>{stats.uptime}</span>
          </StatRow>
        </LiveStats>

        <Copyright>
          <p>
            © 2024 SlowShop - Intentionally Slow Performance Demo | Scroll:{" "}
            {scrollPosition}px | Window: {windowSize.width}x{windowSize.height}{" "}
            | Calc: {calculation.toFixed(2)}
          </p>
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
