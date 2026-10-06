import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {EarlyField} from './EarlyField';

const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const C=(hex:string)=>{const h=hex.replace('#','');return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];};
const H=(rgb:number[])=>'#'+rgb.map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join('');
const rgba=(hex:string,a:number)=>{const [r,g,b]=C(hex); return `rgba(${r},${g},${b},${Math.max(0,Math.min(1,a))})`;};
const mix=(a:string,b:string,t:number)=>{const aa=C(a),bb=C(b),q=Math.max(0,Math.min(1,t));return H(aa.map((v,i)=>v+(bb[i]-v)*q));};
const colorStops=(frame:number,ranges:Array<[number,string]>)=>{if(frame<=ranges[0][0])return ranges[0][1];for(let i=1;i<ranges.length;i++){if(frame<=ranges[i][0]){const t=interpolate(frame,[ranges[i-1][0],ranges[i][0]],[0,1],clamp);return mix(ranges[i-1][1],ranges[i][1],t);}}return ranges[ranges.length-1][1];};
const ease=(f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{...clamp,easing:Easing.inOut(Easing.cubic)});

function EarlyCanvasGradient({frame}:{frame:number}){
  if(frame>240)return null;
  const white=interpolate(frame,[218,246],[0,1],clamp);
  const left=colorStops(frame,[[0,'#188fdf'],[20,'#159bdc'],[60,'#1ea6d8'],[90,'#148ea0'],[120,'#13945f'],[150,'#3fb41a'],[180,'#78ba19'],[210,'#e8d52f'],[230,'#f1ecc4'],[240,'#f5f7fa']]);
  const mid=colorStops(frame,[[0,'#159bdc'],[20,'#2cc3ed'],[60,'#2ab4df'],[90,'#46d1b3'],[120,'#65d84a'],[150,'#84dc17'],[180,'#bde62a'],[210,'#f1e261'],[230,'#f1efd2'],[240,'#f5f7fa']]);
  const right=colorStops(frame,[[0,'#0b9fba'],[20,'#18b1d0'],[60,'#179bbd'],[90,'#a9e5d9'],[120,'#cce99a'],[150,'#dce94f'],[180,'#e8e873'],[210,'#fff1a8'],[230,'#f4f4e6'],[240,'#f5f7fa']]);
  const angle=interpolate(frame,[0,20,90,180,240],[108,110,112,120,118],clamp);
  const haze=interpolate(frame,[190,220,240],[0,.12,.42],clamp);
  return <AbsoluteFill data-element="early-full-canvas-gradient" style={{opacity:0.24*(1-white*.35),background:`radial-gradient(ellipse 84% 112% at ${84-white*4}% ${48+white*12}%, rgba(255,255,244,${.22+haze*.5}) 0%, rgba(249,255,219,${.12+haze*.32}) 46%, transparent 78%), radial-gradient(ellipse 94% 118% at -8% 2%, ${mix('#0b749a',left,.35)} 0%, transparent 70%), radial-gradient(ellipse 88% 104% at -8% 104%, ${mix('#0b749a',left,.25)} 0%, transparent 74%), linear-gradient(${angle}deg, ${left} 0%, ${mid} 48%, ${right} 100%)`,filter:'blur(4px)'}}/>;
}

function LateCanvasGradient({frame}:{frame:number}){
  if(frame<270)return null;
  const f=frame;
  const reveal=ease(f,270,282);
  const left=colorStops(f,[[270,'#64c4bd'],[300,'#60c4b5'],[315,'#96d196'],[330,'#e8e46d'],[345,'#fae66d'],[360,'#f8e66f'],[378,'#20b3b0'],[390,'#148cea'],[400,'#168deb'],[418,'#228ee7']]);
  const right=colorStops(f,[[270,'#77d388'],[300,'#66d089'],[315,'#2bc576'],[330,'#20bf79'],[345,'#20b2a7'],[360,'#1997d8'],[378,'#228cf2'],[390,'#4b9bf9'],[400,'#78ccc7'],[418,'#a7d57a']]);
  const upperLeft=colorStops(f,[[270,'#1499c8'],[300,'#128fb8'],[315,'#2e9fc4'],[330,'#52a8b2'],[345,'#64b187'],[360,'#56b42f'],[378,'#2b44c0'],[390,'#0897b7'],[400,'#0a9bdc'],[418,'#148fe8']]);
  const upperRight=colorStops(f,[[270,'#2182c4'],[300,'#158da6'],[315,'#2c9fc4'],[330,'#2babaa'],[345,'#209acd'],[360,'#1a8ce5'],[378,'#2791ed'],[390,'#0c68f3'],[400,'#179c89'],[418,'#55b327']]);
  // Keep the late wave as one smooth, concave sweep.  The extra keys around
  // 284–290 are intentional: the prior version snapped the cap a few frames
  // late and made a shallow polygon instead of a wave.
  const edgeY=interpolate(f,[270,286,300,315,330,345,360,378,390,400,418],[440,420,370,310,280,255,166,70,70,74,92],clamp);
  const edgeEnd=interpolate(f,[270,315,345,360,378,390,400,418],[-70,-80,-70,65,192,252,222,170],clamp);
  const bend=interpolate(f,[270,330,360,378,390,400,418],[285,230,70,160,216,160,80],clamp);
  // Separate broad cap geometry from its palette. Two cubic segments keep
  // the left yellow/green boundary broad and curved before the late blue dip.
  const capLeft=interpolate(f,[270,300,315,330,345,360,378,390,400,418],[430,365,305,278,240,164,92,75,80,100],clamp);
  const capCenter=interpolate(f,[270,300,315,330,345,360,378,390,400,418],[310,225,180,143,136,103,164,200,165,96],clamp);
  const capEnd=interpolate(f,[270,315,345,360,378,390,400,418],[-150,-140,-105,-62,126,208,165,84],clamp);
  const capPath=`M -100 -180 H 850 V ${capEnd} C 660 ${capEnd-15} 510 ${capCenter+18} 340 ${capCenter} C 205 ${capLeft+3} 35 ${capLeft+18} -100 ${capLeft+8} Z`;
  const capBlur=interpolate(f,[270,315,345,360,378,418],[13,13,10,8,13,13],clamp);
  const id=`late-${f}`;
  const whiteY=interpolate(f,[270,275,280,285,290,295,300,305,310,315,318],[560,500,390,235,140,90,70,20,-45,-110,-170],clamp);
  const blueLift=colorStops(f,[[270,'#087fc2'],[300,'#138fb8'],[315,'#158fae'],[330,'#2b9baf'],[345,'#38a5ad'],[360,'#2488cf'],[378,'#2146c5'],[390,'#147fe0'],[400,'#138fe0'],[418,'#158ee7']]);
  // The reference's yellow/green lower band is already visible by f315;
  // quickly taper the lower-left blue haze so it does not wash that band out.
  const blueOpacity=interpolate(f,[270,300,315,320,330,345,360,378,390,418],[.78,.55,.20,.11,.04,.02,.015,.04,.08,.16],clamp);
  return <AbsoluteFill data-element="late-full-canvas-gradient" style={{opacity:reveal,background:`radial-gradient(ellipse 94% 82% at -8% 104%, ${rgba(blueLift,blueOpacity)} 0%, ${rgba(mix(blueLift,left,.35),blueOpacity*.68)} 55%, transparent 82%), linear-gradient(100deg, ${left} 0%, ${mix(left,right,.1)} 18%, ${mix(left,right,.78)} 57%, ${right} 100%)`}}>
    <svg viewBox="0 0 736 414" width="100%" height="100%" preserveAspectRatio="none" style={{overflow:'visible'}}>
      <defs><linearGradient id={`${id}-cap`} gradientUnits="userSpaceOnUse" x1="0" x2="736" y1="0" y2="0"><stop offset="0" stopColor={upperLeft}/><stop offset=".22" stopColor={mix(upperLeft,upperRight,.10)}/><stop offset=".47" stopColor={mix(upperLeft,upperRight,.53)}/><stop offset=".76" stopColor={mix(upperLeft,upperRight,.95)}/><stop offset="1" stopColor={upperRight}/></linearGradient></defs>
      <path d={capPath} fill={`url(#${id}-cap)`} style={{filter:`blur(${capBlur}px)`}}/>
      {/* Broad U-shaped white lift: endpoints rise earlier while the center
          lags, matching the rounded cap in frames 286–300. */}
      <path d={`M -100 -180 H 850 V ${whiteY-72} C 640 ${whiteY+10} 242 ${whiteY+110} -100 ${whiteY-20} Z`} fill="#f0f1f4" style={{filter:'blur(26px)'}}/>
    </svg>
  </AbsoluteFill>;
}

const starPath='M45 4 C53 19 61 31 86 45 C63 51 53 63 45 86 C37 63 27 53 4 45 C29 34 37 20 45 4 Z';
const starCoords=[45,4,51,25,57,33,86,45,58,54,51,62,45,86,38,63,31,54,4,45,31,35,38,27,45,4];
const squareCoords=[10,10,33,22,60,18,80,10,68,34,72,58,80,80,56,70,34,72,10,80,20,56,18,32,10,10];
const morphPath=(t:number)=>{const q=Math.max(0,Math.min(1,t));const v=starCoords.map((n,i)=>n+(squareCoords[i]-n)*q);return `M${v[0]} ${v[1]} C${v.slice(2,8).join(' ')} C${v.slice(8,14).join(' ')} C${v.slice(14,20).join(' ')} C${v.slice(20,26).join(' ')} Z`;};
function FourZoneStar({frame}:{frame:number}){
  const size=interpolate(frame,[230,232,236,240,244,248,256,270,280,286,400,418],[0,30,65,74,76,80,82,84,84,84,88,96],clamp);
  const rotation=interpolate(frame,[231,233,241,256,270,400,405,410,414,418],[24,18,5,0,0,0,0,0,0,0],clamp);
  // During the entrance the reference mark sits a few pixels to the right and
  // above the optical centre, then settles back to centre as it turns white.
  const entrance=ease(frame,234,280)*(1-ease(frame,280,294));
  const shiftX=0;
  const shiftY=0;
  const colored=1-ease(frame,292,300); const white=ease(frame,292,300); const shapeMorph=interpolate(frame,[230,236,240,248,260,280,300,400,418],[0,.12,.72,.92,.72,.24,0,0,1],clamp); const id=`star-${Math.round(frame)}`;
  return <div data-element="foreground-star" style={{position:'absolute',left:'50%',top:'50%',width:size,height:size,transform:`translate(calc(-50% + ${shiftX}px), calc(-50% - ${shiftY}px)) rotate(${rotation}deg)`,transformOrigin:'center',opacity:size>0?1:0}}><svg viewBox="0 0 90 90" width="100%" height="100%" aria-label="four-point star"><defs>
    <clipPath id={`${id}-clip`}><path d={morphPath(shapeMorph)}/></clipPath>
    {/* Reference layout: cool blue/green on the upper pair and warm
        red/yellow on the lower pair, with broad overlap through the center. */}
    <radialGradient id={`${id}-blue`} cx="4%" cy="0%" r="88%"><stop offset="0%" stopColor="#2f78ff"/><stop offset="52%" stopColor="#268df2" stopOpacity=".96"/><stop offset="100%" stopColor="#22d8ef" stopOpacity="0"/></radialGradient>
    <radialGradient id={`${id}-red`} cx="12%" cy="86%" r="72%"><stop offset="0%" stopColor="#f51f54"/><stop offset="48%" stopColor="#ff3053" stopOpacity=".98"/><stop offset="78%" stopColor="#ff9a2e" stopOpacity=".72"/><stop offset="100%" stopColor="#ffd12e" stopOpacity="0"/></radialGradient>
    <radialGradient id={`${id}-green`} cx="100%" cy="0%" r="76%"><stop offset="0%" stopColor="#20e38b"/><stop offset="55%" stopColor="#37d8ae" stopOpacity=".9"/><stop offset="100%" stopColor="#51c8de" stopOpacity="0"/></radialGradient>
    <radialGradient id={`${id}-yellow`} cx="100%" cy="100%" r="72%"><stop offset="0%" stopColor="#ffd32c"/><stop offset="52%" stopColor="#b9e34a" stopOpacity=".86"/><stop offset="100%" stopColor="#58c98b" stopOpacity="0"/></radialGradient>
  </defs><g clipPath={`url(#${id}-clip)`} opacity={colored} style={{filter:'saturate(1.18)'}}><rect x="0" y="0" width="90" height="90" fill="#2f8fea"/><rect x="0" y="0" width="90" height="90" fill={`url(#${id}-blue)`}/><rect x="0" y="0" width="90" height="90" fill={`url(#${id}-green)`}/><rect x="0" y="0" width="90" height="90" fill={`url(#${id}-red)`}/><rect x="0" y="0" width="90" height="90" fill={`url(#${id}-yellow)`}/></g><path d={morphPath(shapeMorph)} fill="#fff" opacity={white}/></svg></div>;
}

export const RemogenReplica:React.FC=()=>{const frame=useCurrentFrame(); const earlyBase=colorStops(frame,[[0,'#1383f4'],[90,'#4ed3b1'],[150,'#a8e81c'],[210,'#f6e66a'],[238,'#f5f7f9'],[286,'#f7fafc']]); const whiteStage=interpolate(frame,[236,244,252,286],[0,.12,.82,1],clamp); const lateBase=ease(frame,270,282); const baseForBg=frame<244?earlyBase:'#f0f1f4'; return <AbsoluteFill data-element="remogen-replica" style={{background:baseForBg,overflow:'hidden'}}><AbsoluteFill style={{opacity:1-lateBase,background:`linear-gradient(118deg, ${mix(baseForBg,'#f8fafc',whiteStage)} 0%, ${mix(baseForBg,'#fff',whiteStage)} 49%, ${mix(baseForBg,'#f4f8fb',whiteStage)} 100%)`}}/><EarlyField frame={frame}/><AbsoluteFill style={{background:'#f0f1f4',opacity:frame<232?0:whiteStage*(1-lateBase)}}/><LateCanvasGradient frame={frame}/><FourZoneStar frame={frame}/><Audio src={staticFile('reference-audio.m4a')} volume={.88}/></AbsoluteFill>;};
