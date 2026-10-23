export const autonomy=i=>i.daily>0?i.qty/i.daily:null;
export const impactMargin=(lead,risk,factor=.50)=>Math.ceil(lead*(risk/100)*factor);
export const etaDays=(lead,risk,factor=.50)=>lead+impactMargin(lead,risk,factor);
export const advanceDays=(risk,base=3)=>Math.round(base+risk*.1);
export function project(item,daysCount,purchases,risk,fallbackFactor=.50,routes=[]){
 const points=[];let stock=item.qty;
 for(let d=0;d<=daysCount;d++){
  for(const p of purchases){
   const route=routes.find(r=>r.id===p.route);
   const factor=route?.impactFactor??fallbackFactor;
   const arrival=etaDays(p.baseDays,p.risk??risk,factor);
   if(arrival===d) stock+=p.items.filter(x=>x.productId===item.id).reduce((a,x)=>a+x.qty,0);
  }
  points.push(Math.max(0,stock));stock-=item.daily||0;
 }
 return points;
}
export const reorderDate=(item,risk,safety=10)=>{const a=autonomy(item);if(a===null)return null;return Math.max(0,Math.floor(a-safety-advanceDays(risk)))};
export const observedFactor=(baseDays,actualDays,risk)=>{const delay=actualDays-baseDays;return baseDays>0&&risk>0?delay/(baseDays*(risk/100)):null};
