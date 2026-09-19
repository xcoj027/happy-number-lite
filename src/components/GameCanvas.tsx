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

import React, { useEffect, useRef, useCallback } from 'react';

const TOTAL_BALLOONS = 6;
const SWAY_AMP       = 7.0;
const TIMEOUT_ZOOM   = 900;

function balloonSize(mobile:boolean){ return mobile ? {brx:46,bry:46} : {brx:72,bry:72}; }

const BAL_COLORS = [
  { body:'#FF5252', text:'#fff'    },
  { body:'#40C4FF', text:'#fff'    },
  { body:'#FFEB3B', text:'#4a3000' },
  { body:'#69F0AE', text:'#1a3d1a' },
  { body:'#EA80FC', text:'#fff'    },
  { body:'#FF6D00', text:'#fff'    },
  { body:'#64FFDA', text:'#1a3d35' },
  { body:'#FF80AB', text:'#fff'    },
];

type BalloonState = 'appear' | 'idle' | 'burst' | 'correct' | 'dimmed' | 'zoom';
interface Balloon {
  id:number; answer:number; label:string; colorIdx:number;
  gx:number; gy:number; ox:number; oy:number;
  swayPhase:number; bobPhase:number;
  alpha:number; scale:number; state:BalloonState;
  appearT:number; appearDelay:number;
  burstT:number; correctT:number; zoomT:number; shakeAmp:number;
  targetAlpha:number;
}

let _uid=0; const uid=()=>++_uid;
function padAnswers(answers:number[],correct:number,total:number):number[]{

  const ex=new Set<number>();
  const res:number[]=[];
  for(const a of answers){ if(!ex.has(a)){ ex.add(a); res.push(a); } }
  if(!ex.has(correct)){ ex.add(correct); res.push(correct); }
  let range=Math.max(8,Math.abs(correct)*0.8+4);
  let att=0;
  while(res.length<total&&att<400){
    att++;

    if(att%50===0) range*=2;
    const c=correct+Math.round((Math.random()-.5)*range*2);
    if(!ex.has(c)&&c>=0&&c!==correct){ex.add(c);res.push(c);}
  }
  for(let i=res.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[res[i],res[j]]=[res[j],res[i]];}
  return res;
}

import { CompletedLevel } from '../types/game.types';
export interface GameCanvasProps {
  questionNumber:number; totalQuestions:number; animKey:number;
  timeLeft:number; timerActive:boolean;
  answersDisabled?:boolean;
  answers:number[]; labels?:string[]; correctAnswer:number;
  showFeedback:boolean; selectedAnswer:number|null; isTimeout:boolean;
  completedLevels?: CompletedLevel[];
  onAnswer:(answer:number)=>void; onWrongAnswer?:()=>void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  questionNumber,totalQuestions,animKey,
  answersDisabled=false,answers,labels,correctAnswer,
  showFeedback,isTimeout,completedLevels,onAnswer,onWrongAnswer,
}) => {
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const wrapRef=useRef<HTMLDivElement>(null);
  const rafRef=useRef<number>(0);
  const lastTRef=useRef<number>(0);
  const sizeRef=useRef({w:0,h:0});
  const mobileRef=useRef(false);
  const balloonsRef=useRef<Balloon[]>([]);
  const qNumR=useRef(questionNumber); const qTotR=useRef(totalQuestions);
  const answersDisabledR=useRef(answersDisabled);
  const answersR=useRef(answers); const labelsR=useRef(labels);
  const correctR=useRef(correctAnswer); const feedbackR=useRef(showFeedback);
  const isTimeoutR=useRef(isTimeout);
  const onAnswerR=useRef(onAnswer); const onWrongR=useRef(onWrongAnswer);
  const completedR=useRef(completedLevels);

  useEffect(()=>{completedR.current=completedLevels;},[completedLevels]);
  useEffect(()=>{qNumR.current=questionNumber;},[questionNumber]);
  useEffect(()=>{qTotR.current=totalQuestions;},[totalQuestions]);
  useEffect(()=>{answersDisabledR.current=answersDisabled;},[answersDisabled]);
  useEffect(()=>{answersR.current=answers;},[answers]);
  useEffect(()=>{labelsR.current=labels;},[labels]);
  useEffect(()=>{correctR.current=correctAnswer;},[correctAnswer]);
  useEffect(()=>{feedbackR.current=showFeedback;},[showFeedback]);
  useEffect(()=>{isTimeoutR.current=isTimeout;},[isTimeout]);
  useEffect(()=>{onAnswerR.current=onAnswer;},[onAnswer]);
  useEffect(()=>{onWrongR.current=onWrongAnswer;},[onWrongAnswer]);

  useEffect(()=>{
    const{w,h}=sizeRef.current;
    if(w>0)buildGrid(w,h,mobileRef.current);

  },[animKey]);

  useEffect(()=>{
    if(!showFeedback)return;
    const bs=balloonsRef.current;
    if(isTimeout){


      bs.forEach(b => {
        if (b.state !== 'idle') return;
        if (b.answer === correctAnswer) {
          b.state = 'zoom'; b.zoomT = 0; b.shakeAmp = 0;
        } else {
          b.state = 'dimmed';
        }
      });
      setTimeout(() => {
        balloonsRef.current.forEach(b => {
          if (b.state === 'zoom' || b.state === 'dimmed') {
            b.state = 'burst'; b.burstT = 0; b.alpha = 1;
          }
        });
      }, TIMEOUT_ZOOM);
    } else {
      bs.forEach(b=>{if(b.state!=='idle')return;if(b.answer===correctAnswer){b.state='correct';b.correctT=0;}else b.state='dimmed';});
    }

  },[showFeedback]);


  const buildGrid = useCallback((w:number, h:number, mobile:boolean) => {

    const ballZoneTop = mobile ? 8 : 12;
    const ballZoneBottom = Math.max(ballZoneTop, h - (mobile ? 14 : 18));
    const ballH   = Math.max(0, ballZoneBottom - ballZoneTop);
    const cols = mobile ? 3 : TOTAL_BALLOONS;
    const rows = mobile ? 2 : 1;
    const totalSlots = mobile ? cols * rows : TOTAL_BALLOONS;
    const { brx, bry } = balloonSize(mobile);
    const ans    = answersR.current;
    const padded = padAnswers(ans, correctR.current, totalSlots);

    const labelMap = new Map<number,string>();
    if(labelsR.current){ ans.forEach((a,i)=>{ if(!labelMap.has(a)) labelMap.set(a, labelsR.current![i] ?? String(a)); }); }
    const rowGap = mobile ? 14 : 18;
    const rowBlockH = rows * (bry * 1.95) + (rows - 1) * rowGap;
    const ballTop = ballZoneTop + Math.max(0, (ballH - rowBlockH) / 2);
    const cellW = w / cols;
    const cellH = rows > 0 ? Math.max(bry * 1.9, (rowBlockH - (rows - 1) * rowGap) / rows) : ballH;
    const bs:Balloon[] = [];
    for (let i=0; i<padded.length; i++) {
      const col=i%cols, row=Math.floor(i/cols);
      const gx0=cellW*(col+0.5);
      const gy0=ballTop + row * (cellH + rowGap) + cellH * 0.5;
      const jx=(Math.random()-.5)*cellW*.28;
      const jy=(Math.random()-.5)*cellH*.24;
      const mg=brx+6;
      const origIdx=ans.indexOf(padded[i]);
      const label=labelMap.has(padded[i]) ? labelMap.get(padded[i])! : (origIdx>=0&&labelsR.current ? labelsR.current[origIdx] : String(padded[i]));
      bs.push({
        id:uid(), answer:padded[i], label, colorIdx:i%BAL_COLORS.length,
        gx:Math.max(mg,Math.min(w-mg,gx0+jx)),
        gy:Math.max(bry+6,Math.min(h-bry-40,gy0+jy)),
        ox:0, oy:0,
        swayPhase:Math.random()*Math.PI*2, bobPhase:Math.random()*Math.PI*2,
        alpha:0, scale:0, state:'appear',
        appearT:0, appearDelay:i*80,
        burstT:0, correctT:0, zoomT:0, shakeAmp:0, targetAlpha:0,
      });
    }
    balloonsRef.current = bs;
  }, []);


  const drawBalloon = useCallback((ctx:CanvasRenderingContext2D,b:Balloon,dpr:number,mobile:boolean,glowI?:number,correctWin?:boolean)=>{
    const _sz=balloonSize(mobile);
    const brx=_sz.brx*dpr,bry=_sz.bry*dpr;
    const c=BAL_COLORS[b.colorIdx%BAL_COLORS.length];
    const bx=(b.gx+b.ox)*dpr,by=(b.gy+b.oy)*dpr;
    ctx.save();ctx.globalAlpha=b.alpha;

    if(b.state==='burst'){
      const p=b.burstT;
      for(let i=0;i<14;i++){const ang=(i/14)*Math.PI*2,d=p*72*dpr;ctx.globalAlpha=b.alpha*Math.max(0,1-p*2.4);ctx.beginPath();ctx.arc(bx+Math.cos(ang)*d,by+Math.sin(ang)*d,Math.max(.5,(5-p*4.5)*dpr),0,Math.PI*2);ctx.fillStyle=c.body;ctx.fill();}
      if(p<.15){ctx.globalAlpha=b.alpha*(1-p/.15)*.28;ctx.beginPath();ctx.arc(bx,by,brx*1.5,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();}
      ctx.restore();return;
    }

    const zoom=b.state==='correct'?1.3:b.state==='zoom'?b.scale:1;
    const rx=brx*zoom,ry=bry*zoom;

    if(glowI&&glowI>0){
      const aura=ctx.createRadialGradient(bx,by,Math.max(.01,rx*.5),bx,by,Math.max(.01,rx*2.6));
      aura.addColorStop(0,`rgba(80,255,160,${.6*glowI})`);aura.addColorStop(.4,`rgba(80,255,160,${.28*glowI})`);aura.addColorStop(1,'rgba(80,255,160,0)');
      ctx.save();ctx.globalAlpha=b.alpha;ctx.fillStyle=aura;ctx.beginPath();ctx.ellipse(bx,by,rx*2.6,ry*2.6,0,0,Math.PI*2);ctx.fill();ctx.restore();
      ctx.save();ctx.globalAlpha=b.alpha*(.55+.45*glowI);ctx.strokeStyle=`rgba(100,255,170,${.9*glowI})`;ctx.lineWidth=(3+3*glowI)*dpr;ctx.shadowColor='#00ff88';ctx.shadowBlur=22*dpr*glowI;
      ctx.beginPath();ctx.ellipse(bx,by,rx*1.22,ry*1.22,0,0,Math.PI*2);ctx.stroke();ctx.restore();
    }
    if(rx<1||ry<1){ctx.restore();return;}
    ctx.beginPath();ctx.arc(bx,by,rx,0,Math.PI*2);ctx.fillStyle=c.body;ctx.fill();
    if(correctWin){ctx.save();ctx.globalAlpha=b.alpha*.32;ctx.beginPath();ctx.ellipse(bx,by,rx,ry,0,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();ctx.restore();}
    ctx.textAlign='center';ctx.textBaseline='middle';
    const maxPx=(mobile?24:36)*dpr,fitPx=(rx*1.5)/Math.max(1,b.label.length*.6);
    ctx.font=`900 ${Math.min(maxPx,fitPx)}px "Fuzzy Bubbles",cursive,sans-serif`;
    ctx.shadowColor='rgba(0,0,0,.45)';ctx.shadowBlur=4*dpr;ctx.fillStyle=c.text;
    ctx.fillText(b.label,bx,by+2*dpr);ctx.shadowBlur=0;
    ctx.restore();
  },[]);

  const animate=useCallback((ts:number)=>{
    const canvas=canvasRef.current;if(!canvas){return;}
    const ctx=canvas.getContext('2d');if(!ctx){return;}
    const mobile=mobileRef.current;
    const dpr=Math.min(window.devicePixelRatio||1, mobile ? 1.5 : 2);
    const dt=Math.min(ts-lastTRef.current,50);lastTRef.current=ts;
    const{w,h}=sizeRef.current;if(w===0){rafRef.current=requestAnimationFrame(animate);return;}
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save();
    const barH    = 6*dpr;
    const barY    = h*dpr - barH;
    const total   = qTotR.current;
    const filled  = qNumR.current;
    const gap     = 2*dpr;
    const segW    = (w*dpr - gap*(total+1)) / total;
    const segEmpty = 'rgba(255,255,255,0.12)';
    for (let i=0;i<total;i++){
      const sx = gap + i*(segW+gap);
      ctx.fillStyle = segEmpty;
      ctx.beginPath(); ctx.roundRect(sx,barY,segW,barH,2*dpr); ctx.fill();
      if(i < filled){
        const isCurrent = i === filled-1;

        const completed = completedR.current;
        const pastResult = completed && completed[i];
        let wasWrong: boolean;
        if (pastResult !== undefined) {
          wasWrong = !pastResult.success;
        } else {
          wasWrong = isCurrent && (isTimeoutR.current || (feedbackR.current && !balloonsRef.current.some(b => b.state==='correct')));
        }
        const fillColor = wasWrong
          ? (isCurrent ? '#FF5252' : 'rgba(255,82,82,0.75)')
          : (isCurrent ? '#00C49A' : 'rgba(0,196,154,0.85)');
        ctx.fillStyle = fillColor;
        ctx.shadowColor=fillColor; ctx.shadowBlur=(isCurrent?6:0)*dpr;
        ctx.beginPath(); ctx.roundRect(sx,barY,segW,barH,2*dpr); ctx.fill();
        ctx.shadowBlur=0;
      }
    }
    ctx.restore();
    ctx.save();
    const dead:number[]=[];
    const bs=balloonsRef.current;
    for(let i=0;i<bs.length;i++){
      const b=bs[i];
      switch(b.state){
        case'appear':
          if(b.appearDelay>0){b.appearDelay=Math.max(0,b.appearDelay-dt);break;}
          b.appearT=Math.min(1,b.appearT+dt/400);
          b.targetAlpha=b.appearT;

          b.alpha+=(b.targetAlpha-b.alpha)*Math.min(1,dt/120);
          b.scale=1;b.ox=0;b.oy=0;
          if(b.appearT>=1){b.state='idle';}break;
        case'idle':case'dimmed':{
          b.ox=0;b.oy=0;

          b.targetAlpha=b.state==='dimmed'?0.35:1;

          const lerpSpeed=b.targetAlpha>b.alpha?dt/200:dt/80;
          b.alpha+=(b.targetAlpha-b.alpha)*Math.min(1,lerpSpeed);
          break;
        }
        case'zoom':



          b.zoomT=Math.min(1,b.zoomT+dt/TIMEOUT_ZOOM);
          { const ease=1-Math.pow(1-b.zoomT,3);

            b.scale=1+ease*0.55+Math.sin(b.zoomT*Math.PI)*0.12;
            b.alpha=1; b.ox=0; b.oy=0; }
          break;
        case'burst':
          b.burstT=Math.min(1,b.burstT+dt/380);b.alpha=Math.max(0,1-b.burstT*2.5);
          if(b.alpha<=0){dead.push(i);continue;}break;
        case'correct':
          b.correctT=Math.min(1,b.correctT+dt/3000);
          {const decay=Math.exp(-b.correctT*3.5);
          b.shakeAmp=SWAY_AMP*4.5*decay+SWAY_AMP*.8;
          b.swayPhase+=.06*(dt/16.7);b.bobPhase+=.04*(dt/16.7);
          b.ox=Math.sin(b.swayPhase)*b.shakeAmp;b.oy=Math.sin(b.bobPhase)*b.shakeAmp*.5;b.alpha=1;}break;
      }
      drawBalloon(ctx,b,dpr,mobile,undefined,b.state==='correct'||b.state==='zoom');
    }
    for(let i=dead.length-1;i>=0;i--)bs.splice(dead[i],1);
    ctx.restore();

    rafRef.current=requestAnimationFrame(animate);
  },[drawBalloon]);

  useEffect(()=>{lastTRef.current=performance.now();rafRef.current=requestAnimationFrame(animate);return()=>cancelAnimationFrame(rafRef.current);},[animate]);

  useEffect(()=>{
    const canvas=canvasRef.current,wrap=wrapRef.current;if(!canvas||!wrap)return;
    const set=()=>{
      const cw=wrap.clientWidth,ch=wrap.clientHeight,mob=cw<=600;
      const dpr=Math.min(window.devicePixelRatio||1, mob ? 1.5 : 2);
      sizeRef.current={w:cw,h:ch};mobileRef.current=mob;
      canvas.width=Math.round(cw*dpr);canvas.height=Math.round(ch*dpr);
      canvas.style.width=`${cw}px`;canvas.style.height=`${ch}px`;
      buildGrid(cw,ch,mob);
    };
    set();const ro=new ResizeObserver(set);ro.observe(wrap);return()=>ro.disconnect();
  },[buildGrid]);

  const hitTest=useCallback((cx:number,cy:number)=>{
    if(feedbackR.current||answersDisabledR.current)return;
    const canvas=canvasRef.current;if(!canvas)return;
    const rect=canvas.getBoundingClientRect();
    const logicalW = sizeRef.current.w || rect.width;
    const logicalH = sizeRef.current.h || rect.height;
    const scaleX = rect.width  > 0 ? logicalW / rect.width  : 1;
    const scaleY = rect.height > 0 ? logicalH / rect.height : 1;
    const x=(cx-rect.left)*scaleX, y=(cy-rect.top)*scaleY;
    const mobile=mobileRef.current;
    const _sz=balloonSize(mobile);
    const brxBase=_sz.brx, bryBase=_sz.bry;
    const HIT_SCALE = 1.6;
    const bs=balloonsRef.current;
    for(let i=bs.length-1;i>=0;i--){
      const b=bs[i];
      if(b.state!=='idle'&&b.state!=='appear'&&b.state!=='dimmed')continue;
      const dx=x-(b.gx+b.ox), dy=y-(b.gy+b.oy);
      if((dx*dx)/(brxBase*brxBase*HIT_SCALE)+(dy*dy)/(bryBase*bryBase*HIT_SCALE)<=1){
        if(b.state==='appear'){
          b.state='idle';
        }
        if(b.answer===correctR.current){
          const activeCount=balloonsRef.current.filter(bl=>bl.state==='idle'||bl.state==='appear').length;
          onAnswerR.current(activeCount>1?b.answer:-1);
        } else{
          b.state='burst';b.burstT=0;b.alpha=1;onWrongR.current?.();
        }
        break;
      }
    }
  },[]);

  return(
    <div ref={wrapRef} style={{position:'absolute',inset:0,overflow:'hidden',borderRadius:'inherit'}}>
      <canvas
        ref={canvasRef}
        onPointerUp={e=>{
          if(!e.isPrimary||(e.pointerType==='mouse'&&e.button!==0))return;
          hitTest(e.clientX,e.clientY);
        }}
        style={{display:'block',touchAction:'none',cursor:'default'}}
        onMouseMove={(e) => {
          const canvas = e.currentTarget;
          const rect = canvas.getBoundingClientRect();
          const logicalH = sizeRef.current.h || rect.height;
          const scaleY = rect.height > 0 ? logicalH / rect.height : 1;
          const my = (e.clientY - rect.top)  * scaleY;
          const inAnswerZone = my > logicalH * 0.52;
          canvas.style.cursor = inAnswerZone ? 'pointer' : 'default';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.cursor = 'default';
        }}
      />
    </div>
  );
};
