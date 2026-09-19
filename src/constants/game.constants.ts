/*
 * Happy Number - Open Source Math Game
 *
 * This is an open-source project of https://math-hero.online and https://happy-number.online
 * The author of this project is TNQ MEDIA
 * GitHub: https://github.com/xcoj027/happy-number-lite
 *
 * You are free to clone, modify, contribute, fork, and build commercial products
 * from this project. All pull requests are welcome.
 * You can also open any issues or report bugs.

 */

export const GAME_CONFIG = {
  totalLevels: 12,
  timeLimit: 20,
  maxPlayers: 50,
  roomIdLength: 5,
} as const;

export const OPERATIONS = ['+', '-', '×', '÷'] as const;

export const CELEBRATION_TEXTS = [
  "TUYỆT VỜI!",
  "HOÀN HẢO!",
  "THIÊN TÀI!",
  "XUẤT SẮC!",
  "QUÁ ĐỈNH!",
  "SIÊU QUÁ!"
] as const;

export const CORRECT_MESSAGES = [
  'Giỏi quá! Chính xác rồi!',
  'Tuyệt vời! Đúng rồi!',
  'Xuất sắc! Hoàn hảo!',
  'Chính xác! Quá tài giỏi!',
  'Đúng đấy! Thông minh quá!',
  'Tài giỏi! 100 điểm!',
  'Chuẩn luôn! Giỏi ghê!',
  'Ăn điểm rồi! Tiếp tục!',
  'Siêu đỉnh! Không sai!',
  'Wow! Quá nhanh!',
  'Perfect! Keep going!',
] as const;

export const WRONG_MESSAGES = [
  'Đừng bỏ cuộc! Tiếp tục nào!',
  'Chưa đúng! Cố lên nhé!',
  'Sai rồi! Lần sau sẽ tốt hơn!',
  'Ối! Câu sau cẩn thận hơn nha!',
  'Chưa chính xác! Cố gắng tiếp!',
  'Hãy thử lại lần sau!',
  'Gần đúng rồi! Cố thêm nha!',
  'Ổn thôi! Câu sau lấy lại điểm!',
  'Không sao! Vẫn còn cơ hội!',
  'Cẩn thận hơn nhé! Cố lên!',
  'Oops! Try the next one!',
] as const;

export const TIMEOUT_MESSAGES = [
  "Hết giờ rồi! Cố gắng câu sau nhé!",
  "Lần sau trả lời nhanh hơn nha!",
  "Thời gian hết rồi! Tiếp tục thôi!",
  "Ối! Hết giờ! Câu sau sẽ tốt hơn!"
] as const;

export const ANSWER_THEMES = [
  { emoji: '⭐', bg: 'from-[#04BF8A]/90 to-[#03A64A]/90', border: '[#04BF8A]' },
  { emoji: '🎨', bg: 'from-[#026873]/90 to-[#024059]/90', border: '[#026873]' },
  { emoji: '🌈', bg: 'from-[#03A64A]/90 to-[#025940]/90', border: '[#03A64A]' },
  { emoji: '🎯', bg: 'from-[#04BF8A]/90 to-[#026873]/90', border: '[#04BF8A]' },
] as const;

export const SVG_BACKGROUND = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3ClinearGradient id='bg1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23162447;stop-opacity:1' /%3E%3Cstop offset='50%25' style='stop-color:%231f4068;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%231b1b2f;stop-opacity:1' /%3E%3C/linearGradient%3E%3CradialGradient id='glow1'%3E%3Cstop offset='0%25' style='stop-color:%2300d4ff;stop-opacity:0.4' /%3E%3Cstop offset='100%25' style='stop-color:%2300d4ff;stop-opacity:0' /%3E%3C/radialGradient%3E%3CradialGradient id='glow2'%3E%3Cstop offset='0%25' style='stop-color:%23ff00ff;stop-opacity:0.4' /%3E%3Cstop offset='100%25' style='stop-color:%23ff00ff;stop-opacity:0' /%3E%3C/radialGradient%3E%3CradialGradient id='glow3'%3E%3Cstop offset='0%25' style='stop-color:%2300ff88;stop-opacity:0.3' /%3E%3Cstop offset='100%25' style='stop-color:%2300ff88;stop-opacity:0' /%3E%3C/radialGradient%3E%3Cfilter id='blur1'%3E%3CfeGaussianBlur in='SourceGraphic' stdDeviation='2'/%3E%3C/filter%3E%3Cfilter id='blur2'%3E%3CfeGaussianBlur in='SourceGraphic' stdDeviation='3'/%3E%3C/filter%3E%3Cfilter id='blur3'%3E%3CfeGaussianBlur in='SourceGraphic' stdDeviation='4'/%3E%3C/filter%3E%3Cfilter id='blur4'%3E%3CfeGaussianBlur in='SourceGraphic' stdDeviation='1.5'/%3E%3C/filter%3E%3C/defs%3E%3Crect fill='url(%23bg1)' width='1200' height='800'/%3E%3Ccircle fill='url(%23glow1)' cx='250' cy='200' r='200' /%3E%3Ccircle fill='url(%23glow2)' cx='950' cy='600' r='220' /%3E%3Ccircle fill='url(%23glow3)' cx='600' cy='400' r='180' /%3E%3Cg%3E%3Ctext x='150' y='150' font-size='64' fill='%2300d4ff' font-family='Arial,sans-serif' font-weight='bold' opacity='0.45' filter='url(%23blur3)'%3E2+2%3C/text%3E%3Ctext x='152' y='152' font-size='64' fill='%23000' font-family='Arial,sans-serif' font-weight='bold' opacity='0.15' filter='url(%23blur1)'%3E2+2%3C/text%3E%3C/g%3E%3Cg%3E%3Ctext x='900' y='180' font-size='58' fill='%23ff00ff' font-family='Arial,sans-serif' font-weight='bold' opacity='0.6' filter='url(%23blur2)'%3E5%C3%973%3C/text%3E%3Ctext x='902' y='182' font-size='58' fill='%23000' font-family='Arial,sans-serif' font-weight='bold' opacity='0.2' filter='url(%23blur1)'%3E5%C3%973%3C/text%3E%3C/g%3E%3Cg%3E%3Ctext x='120' y='600' font-size='52' fill='%2300ff88' font-family='Arial,sans-serif' font-weight='bold' opacity='0.5' filter='url(%23blur4)'%3E9-4%3C/text%3E%3Ctext x='122' y='602' font-size='52' fill='%23000' font-family='Arial,sans-serif' font-weight='bold' opacity='0.18' filter='url(%23blur1)'%3E9-4%3C/text%3E%3C/g%3E%3Cg%3E%3Ctext x='850' y='680' font-size='60' fill='%23ffaa00' font-family='Arial,sans-serif' font-weight='bold' opacity='0.55' filter='url(%23blur3)'%3E8%C3%B72%3C/text%3E%3Ctext x='852' y='682' font-size='60' fill='%23000' font-family='Arial,sans-serif' font-weight='bold' opacity='0.22' filter='url(%23blur2)'%3E8%C3%B72%3C/text%3E%3C/g%3E%3Cg%3E%3Ctext x='500' y='300' font-size='72' fill='%23ff0088' font-family='Arial,sans-serif' font-weight='bold' opacity='0.7' filter='url(%23blur2)'%3E=%3C/text%3E%3Ctext x='502' y='302' font-size='72' fill='%23000' font-family='Arial,sans-serif' font-weight='bold' opacity='0.25' filter='url(%23blur1)'%3E=%3C/text%3E%3C/g%3E%3Cg%3E%3Ctext x='300' y='450' font-size='48' fill='%2300ffff' font-family='Arial,sans-serif' font-weight='bold' opacity='0.4' filter='url(%23blur4)'%3E7+3%3C/text%3E%3Ctext x='302' y='452' font-size='48' fill='%23000' font-family='Arial,sans-serif' font-weight='bold' opacity='0.16' filter='url(%23blur1)'%3E7+3%3C/text%3E%3C/g%3E%3Cg opacity='0.5' filter='url(%23blur1)'%3E%3Cpath fill='none' stroke='%2300d4ff' stroke-width='3' d='M0,400 Q300,350 600,400 T1200,400'/%3E%3Cpath fill='none' stroke='%23ff00ff' stroke-width='3' d='M0,450 Q300,500 600,450 T1200,450'/%3E%3C/g%3E%3Cg opacity='0.6' filter='url(%23blur2)'%3E%3Cpath fill='none' stroke='%2300ff88' stroke-width='2' d='M100,100 L200,150 L150,250 Z' /%3E%3Cpath fill='none' stroke='%23ffaa00' stroke-width='2' d='M1000,200 L1100,250 L1050,350 Z' /%3E%3C/g%3E%3Cg opacity='0.5'%3E%3Ccircle fill='%2300d4ff' cx='400' cy='150' r='5' filter='url(%23blur1)'/%3E%3Ccircle fill='%23ff00ff' cx='700' cy='250' r='6' filter='url(%23blur2)'/%3E%3Ccircle fill='%2300ff88' cx='200' cy='500' r='4' filter='url(%23blur1)'/%3E%3Ccircle fill='%23ffaa00' cx='950' cy='350' r='5' filter='url(%23blur2)'/%3E%3Ccircle fill='%23ff0088' cx='550' cy='650' r='4' filter='url(%23blur1)'/%3E%3Ccircle fill='%2300ffff' cx='850' cy='500' r='5' filter='url(%23blur2)'/%3E%3C/g%3E%3Cg opacity='0.35' filter='url(%23blur3)'%3E%3Crect fill='none' stroke='%2300d4ff' stroke-width='3' x='80' y='80' width='100' height='100' rx='8'/%3E%3Crect fill='none' stroke='%23ff00ff' stroke-width='3' x='1000' y='120' width='80' height='80' rx='8'/%3E%3Crect fill='none' stroke='%2300ff88' stroke-width='3' x='150' y='650' width='90' height='90' rx='8'/%3E%3C/g%3E%3Ctext x='600' y='420' font-size='150' fill='%2300d4ff' opacity='0.06' font-family='Arial,sans-serif' font-weight='bold' text-anchor='middle' filter='url(%23blur4)'%3ETNQ%3C/text%3E%3C/svg%3E")`;

export const ANIMATIONS = `
  body {
    overflow-x: hidden;
  }
  @keyframes moveCar {
    0% { transform: translateX(calc(100vw + 100px)); }
    100% { transform: translateX(-100px); }
  }
  @keyframes borderLineMove {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes floatUpPop {
    0% { transform: translate(-50%, 20px) scale(0.5) rotate(-5deg); opacity: 0; }
    40% { transform: translate(-50%, -10px) scale(1.3) rotate(5deg); opacity: 1; }
    100% { transform: translate(-50%, -30px) scale(1.1) rotate(5deg); opacity: 0; }
  }
  @keyframes firework {
    0% { transform: scale(1) rotate(0deg); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
    25% { transform: scale(1.08) rotate(-3deg); }
    50% { transform: scale(1.08) rotate(3deg); box-shadow: 0 0 30px 15px rgba(34, 197, 94, 0.4); }
    75% { transform: scale(1.08) rotate(-3deg); }
    100% { transform: scale(1) rotate(0deg); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
  }
  @keyframes wrong-fall {
    0% {
      transform: translateY(-20px) rotate(0deg) scale(1);
      opacity: 1;
    }
    50% {
      transform: translateY(125px) rotate(-180deg) scale(0.8);
      opacity: 0.7;
    }
    100% {
      transform: translateY(250px) rotate(-360deg) scale(0.5);
      opacity: 0;
    }
  }
  @keyframes big-sad-fall {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    50% {
      transform: scale(2);
      opacity: 1;
    }
    100% {
      transform: scale(2.5);
      opacity: 0;
    }
  }
  @keyframes scoreUp {
    0% {
      transform: translateY(0);
      opacity: 1;
    }
    100% {
      transform: translateY(-50px);
      opacity: 0;
    }
  }
  @keyframes scoreDown {
    0% {
      transform: translateY(0);
      opacity: 1;
    }
    100% {
      transform: translateY(50px);
      opacity: 0;
    }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
    20%, 40%, 60%, 80% { transform: translateX(8px); }
  }
  @keyframes wiggle {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-3deg); }
    75% { transform: rotate(3deg); }
  }
  @keyframes stampBounce {
    0% {
      transform: scale(0) rotate(-45deg);
      opacity: 0;
    }
    50% {
      transform: scale(1.2) rotate(-15deg);
    }
    70% {
      transform: scale(0.9) rotate(-10deg);
    }
    100% {
      transform: scale(1) rotate(-12deg);
      opacity: 1;
    }
  }
  @keyframes stampAppear {
    0% {
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  @keyframes spin-slow {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes slotBorderGlow {
    0%, 100% {
      background-position: 0% 50%;
      filter: brightness(1);
    }
    50% {
      background-position: 100% 50%;
      filter: brightness(1.2);
    }
  }
  @keyframes slotBorderGlowFast {
    0%, 100% {
      background-position: 0% 50%;
      filter: brightness(1.2) drop-shadow(0 0 20px #ff0000);
    }
    50% {
      background-position: 100% 50%;
      filter: brightness(1.5) drop-shadow(0 0 30px #ff0000);
    }
  }
  @keyframes vibrantBorderFlow {
    0% {
      background-position: 0% 50%;
      filter: brightness(1.1) drop-shadow(0 0 15px rgba(255, 20, 147, 0.4));
    }
    25% {
      background-position: 25% 50%;
      filter: brightness(1.3) drop-shadow(0 0 25px rgba(255, 215, 0, 0.5));
    }
    50% {
      background-position: 50% 50%;
      filter: brightness(1.2) drop-shadow(0 0 20px rgba(0, 206, 209, 0.4));
    }
    75% {
      background-position: 75% 50%;
      filter: brightness(1.3) drop-shadow(0 0 25px rgba(147, 112, 219, 0.5));
    }
    100% {
      background-position: 100% 50%;
      filter: brightness(1.1) drop-shadow(0 0 15px rgba(255, 20, 147, 0.4));
    }
  }
  @keyframes vibrantBorderFlowFast {
    0% {
      background-position: 0% 50%;
      filter: brightness(1.3) drop-shadow(0 0 25px rgba(255, 20, 147, 0.6)) drop-shadow(0 0 40px rgba(255, 0, 0, 0.4));
    }
    25% {
      background-position: 25% 50%;
      filter: brightness(1.5) drop-shadow(0 0 35px rgba(255, 215, 0, 0.7)) drop-shadow(0 0 50px rgba(255, 165, 0, 0.5));
    }
    50% {
      background-position: 50% 50%;
      filter: brightness(1.4) drop-shadow(0 0 30px rgba(0, 206, 209, 0.6)) drop-shadow(0 0 45px rgba(0, 255, 255, 0.4));
    }
    75% {
      background-position: 75% 50%;
      filter: brightness(1.5) drop-shadow(0 0 35px rgba(147, 112, 219, 0.7)) drop-shadow(0 0 50px rgba(138, 43, 226, 0.5));
    }
    100% {
      background-position: 100% 50%;
      filter: brightness(1.3) drop-shadow(0 0 25px rgba(255, 20, 147, 0.6)) drop-shadow(0 0 40px rgba(255, 0, 0, 0.4));
    }
  }
  @keyframes slotLight {
    0%, 100% {
      opacity: 0.3;
      transform: scale(0.8);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
  }
  @keyframes scrollBallTop {
    0% {
      left: -6%;
      opacity: 0;
    }
    5% {
      opacity: 1;
    }
    95% {
      opacity: 1;
    }
    100% {
      left: 106%;
      opacity: 0;
    }
  }
  @keyframes scrollBallBottom {
    0% {
      left: 106%;
      opacity: 0;
    }
    5% {
      opacity: 1;
    }
    95% {
      opacity: 1;
    }
    100% {
      left: -6%;
      opacity: 0;
    }
  }
  @keyframes scrollBallLeft {
    0% {
      top: -6%;
      opacity: 0;
    }
    5% {
      opacity: 1;
    }
    95% {
      opacity: 1;
    }
    100% {
      top: 106%;
      opacity: 0;
    }
  }
  @keyframes scrollBallRight {
    0% {
      top: 106%;
      opacity: 0;
    }
    5% {
      opacity: 1;
    }
    95% {
      opacity: 1;
    }
    100% {
      top: -6%;
      opacity: 0;
    }
  }
  @keyframes borderPulse {
    0%, 100% {
      box-shadow: 0 0 0 0 currentColor;
    }
    50% {
      box-shadow: 0 0 0 4px currentColor;
    }
  }
  @keyframes slideInFromRight {
    0% {
      opacity: 0;
      transform: translateX(100%) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }
  @keyframes slideInFromLeft {
    0% {
      opacity: 0;
      transform: translateX(-100%) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }
  @keyframes slideInFromRight {
    0% {
      opacity: 0;
      transform: translateX(100%) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }
  @keyframes slideOutToLeft {
    0% {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translateX(-100%) scale(0.95);
    }
  }
  @keyframes questionTransition {
    0% {
      opacity: 0;
      transform: scale(0.95) translateX(50px);
    }
    60% {
      transform: scale(1.02) translateX(0);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateX(0);
    }
  }
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes answerPopIn {
    0% {
      opacity: 0;
      transform: scale(0.8) translateY(20px);
    }
    60% {
      transform: scale(1.05) translateY(0);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  .moving-car {
    position: fixed;
    left: 0;
    z-index: 1;
    filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
    animation: moveCar linear infinite;
  }
  .celebration-text {
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
    z-index: 30;
    animation: floatUpPop 1.1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    font-size: 3.5rem;
    font-weight: 900;
    width: 100%;
    text-align: center;
    background: linear-gradient(to bottom, #fde047, #f59e0b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(2px 2px 0px rgba(255,255,255,0.8));
  }
  .wrong-piece {
    position: absolute;
    font-size: 24px;
    animation: wrong-fall 1.8s ease-in forwards;
    z-index: 25;
    pointer-events: none;
    filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
  }
  .wrong-big-face {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 120px;
    animation: big-sad-fall 0.6s ease-out forwards;
    z-index: 25;
    pointer-events: none;
    filter: drop-shadow(4px 4px 8px rgba(0,0,0,0.4));
  }
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
  .animate-slideInFromLeft {
    animation: slideInFromLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .animate-slideInFromRight {
    animation: slideInFromRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .animate-slideOut {
    animation: slideOutToLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .animate-questionTransition {
    animation: questionTransition 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
  .animate-borderMove {
    animation: borderLineMove 3s ease-in-out infinite;
  }
  .animate-borderMoveFast {
    animation: borderLineMove 1s ease-in-out infinite;
  }
  .animate-answerPopIn-0 {
    animation: answerPopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    animation-delay: 0.1s;
    opacity: 0;
  }
  .animate-answerPopIn-1 {
    animation: answerPopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    animation-delay: 0.2s;
    opacity: 0;
  }
  .animate-answerPopIn-2 {
    animation: answerPopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    animation-delay: 0.3s;
    opacity: 0;
  }
  .animate-answerPopIn-3 {
    animation: answerPopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    animation-delay: 0.4s;
    opacity: 0;
  }
  .animate-scoreUp {
    animation: scoreUp 1s ease-out forwards;
  }
  .animate-scoreDown {
    animation: scoreDown 1s ease-out forwards;
  }
  .animate-shake {
    animation: shake 0.5s ease-in-out;
  }
  .animate-wiggle {
    animation: wiggle 0.5s ease-in-out infinite;
  }
  .animate-stampBounce {
    animation: stampBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  .animate-stampAppear {
    animation: stampAppear 2s ease-in-out forwards;
  }
  .animate-spin-slow {
    animation: spin-slow 3s linear infinite;
  }
  .animate-borderPulse:hover {
    animation: borderPulse 1s ease-in-out infinite;
  }
  @keyframes pageSwipeIn {
    from {
      opacity: 0;
      transform: scale(0.97) translateY(18px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  .page-swipe-transition {
    animation: pageSwipeIn 0.32s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
`;
