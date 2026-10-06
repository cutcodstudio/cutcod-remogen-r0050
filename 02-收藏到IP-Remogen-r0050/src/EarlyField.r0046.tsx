import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';

const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const C=(s:string)=>[parseInt(s.slice(1,3),16),parseInt(s.slice(3,5),16),parseInt(s.slice(5,7),16)];
const mix=(a:string,b:string,t:number)=>'#'+C(a).map((v,i)=>Math.round(v+(C(b)[i]-v)*t).toString(16).padStart(2,'0')).join('');
const stop=(f:number,p:Array<[number,string]>)=>{for(let i=1;i<p.length;i++)if(f<=p[i][0])return mix(p[i-1][1],p[i][1],interpolate(f,[p[i-1][0],p[i][0]],[0,1],clamp));return p[p.length-1][1]};
const k=(f:number,p:number[],v:number[])=>interpolate(f,p,v,clamp);
// A single continuous concave field: there are no intersecting ribbons or
// polygon masks.  Its control points stay far outside the composition.
const field='M 0 -1 C .15 -.36 .36 -.15 1 0 C .36 .15 .15 .36 0 1 C -.15 .36 -.36 .15 -1 0 C -.36 -.15 -.15 -.36 0 -1 Z';
export const EarlyField:React.FC<{frame:number}>=({frame})=>{
  if(frame>244)return null;
  const f=frame;
  // The first twenty frames establish the concave arc.  Keep the bright wedge
  // high and left while it sweeps in, then hand control to the slower color
  // field.  The old path entered almost entirely off-canvas and read as a flat
  // blue card in the opening.
  const baseLeft=stop(f,[[0,'#1286eb'],[20,'#1592e7'],[75,'#079098'],[100,'#078a9f'],[125,'#0d967c'],[160,'#0f9954'],[180,'#72b900'],[205,'#ead21f'],[220,'#f4e447'],[244,'#edf1f3']]);
  const baseRight=stop(f,[[0,'#0b9fbe'],[20,'#128deb'],[45,'#158cee'],[75,'#1ca5d5'],[100,'#2ab98f'],[125,'#37ad31'],[160,'#269966'],[180,'#36a68b'],[205,'#f8f2c8'],[220,'#f4f2d8'],[244,'#eef1f4']]);
  const color=stop(f,[[0,'#4dc9fa'],[20,'#58d6f5'],[75,'#35d1e7'],[95,'#45d4aa'],[120,'#78d630'],[150,'#86d70e'],[180,'#bde12e'],[205,'#f8e53d'],[220,'#f6e344'],[235,'#dce8d5'],[244,'#edf1f4']]);
  const glow=stop(f,[[0,'#baf3fb'],[20,'#cdf7fb'],[75,'#d4f6f5'],[100,'#d7f4d8'],[140,'#def5be'],[180,'#eaf4b7'],[210,'#fff5bc'],[244,'#eff1f4']]);
  const cx=k(f,[0,8,20,40,75,90,100,120,160,190,210,220,236,244],[-300,-40,150,365,398,414,392,396,408,430,280,235,20,-260]);
  const cy=k(f,[0,8,20,40,75,100,120,160,190,220,244],[154,142,134,214,202,205,265,230,200,200,80]);
  const rot=k(f,[0,8,20,40,60,75,90,100,120,160,180,200,220,244],[34,-10,-8,-5,0,0,8,42,0,0,5,25,38,52]);
  const rx=k(f,[0,8,20,40,75,100,120,160,180,200,220,244],[820,790,730,650,650,730,690,680,710,790,900,1020]);
  const ry=k(f,[0,8,20,40,75,100,120,160,180,200,220,244],[760,740,610,605,630,780,750,710,710,820,900,1080]);
  // Keep the swept wedge soft over its whole opening. The previous 4px
  // trough around f45–75 exposed a crisp polygonal edge against the reference.
  const blur=k(f,[0,8,20,45,75,90,100,120,160,180,190,200,210,220,240],[18,18,18,13,12,14,14,12,12,11,10,10,9,9,16]);
  const fade=k(f,[0,223,232,244],[1,1,.82,0]);
  const gx=k(f,[0,20,40,75,120,180,220],[20,46,64,69,70,78,88]);
  const gy=k(f,[0,20,40,75,120,180,220],[16,28,29,39,63,72,42]);
  // The reference keeps a readable dark rim around the bright concave field
  // from f90 through f225.  The broad blurred field above supplies the soft
  // lighting; these two oversized SVG lobes make the changing boundary legible
  // without introducing a hard polygonal seam.
  const edgeIn=interpolate(f,[82,94,165,185,205,225,244],[0,1,1,.72,.34,.12,0],clamp);
  const edgeTopX=k(f,[90,120,150,180,210,225],[215,246,276,322,386,430]);
  const edgeTopY=k(f,[90,120,150,180,210,225],[72,182,136,88,22,-24]);
  const edgeLowerY=k(f,[90,120,150,180,210,225],[156,318,300,274,228,188]);
  const edgeLowerX=k(f,[90,120,150,180,210,225],[210,286,304,338,388,420]);
  const edgeColor=stop(f,[[90,'#087e9d'],[120,'#118b7a'],[150,'#228f54'],[180,'#5a9b32'],[210,'#c4c44a'],[225,'#ded985'],[244,'#e9e9cf']]);
  const edgeBlue=stop(f,[[90,'#087fad'],[120,'#0c958e'],[150,'#1e9b5e'],[180,'#5b9e32'],[210,'#c1c34b'],[225,'#d7d47c'],[244,'#e8e9d5']]);
  const id=`early-${f}`;
  return <AbsoluteFill data-element="early-field" style={{background:`linear-gradient(112deg,${baseLeft} 0%,${mix(baseLeft,baseRight,.3)} 55%,${baseRight} 100%)`,opacity:fade,overflow:'hidden'}}>
    <svg viewBox="0 0 736 414" width="100%" height="100%" preserveAspectRatio="none" style={{overflow:'visible',filter:`blur(${blur}px)`}}>
      <defs><clipPath id={`${id}-clip`}><path d={field} transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${rx} ${ry})`}/></clipPath>
        <linearGradient id={`${id}-fill`}><stop offset="0" stopColor={color}/><stop offset=".55" stopColor={mix(color,glow,.27)}/><stop offset="1" stopColor={mix(color,glow,.04)}/></linearGradient>
        <radialGradient id={`${id}-glow`} cx={`${gx}%`} cy={`${gy}%`} r="61%"><stop offset="0" stopColor={glow}/><stop offset=".24" stopColor={glow} stopOpacity=".9"/><stop offset=".72" stopColor={color} stopOpacity=".34"/><stop offset="1" stopColor={color} stopOpacity="0"/></radialGradient>
      </defs><g clipPath={`url(#${id}-clip)`}><rect x="-80" y="-80" width="900" height="580" fill={`url(#${id}-fill)`}/><rect x="-80" y="-80" width="900" height="580" fill={`url(#${id}-glow)`}/></g>
      <g opacity={edgeIn} style={{filter:'blur(9px)'}}>
        <path d={`M -120 -120 H ${edgeTopX} C ${edgeTopX-126} ${edgeTopY-6} 80 ${edgeTopY+32} -120 ${edgeTopY+62} Z`} fill={edgeColor}/>
        <path d={`M -120 ${edgeLowerY} C 22 ${edgeLowerY+28} ${edgeLowerX-76} ${edgeLowerY+82} ${edgeLowerX} 520 H -120 Z`} fill={edgeBlue}/>
      </g>
    </svg>
  </AbsoluteFill>
};
export default EarlyField;
