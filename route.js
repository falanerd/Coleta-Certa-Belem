(function(root){
function number(v){return typeof v==='number'?v:Number(String(v??'').trim().replace(',','.'));}
function minutes(v){if(typeof v==='number')return Math.round((v%1)*1440);const m=String(v??'').trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);if(!m||+m[1]>23||+m[2]>59)throw Error('Horário inválido');return +m[1]*60+ +m[2];}
function clock(t){t=((Math.round(t)%1440)+1440)%1440;return String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');}
function normalize(sheets){
const groups=new Map(),errors=[];
for(const {name,rows} of sheets){
 if(rows.length<2)continue;
 const h=rows[0].map(x=>String(x??'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''));
 const hi=h.indexOf('hora'),la=h.indexOf('latitude'),lo=h.indexOf('longitude'),si=h.indexOf('setor'),ca=h.indexOf('caminhao'),pi=h.indexOf('periodo'),ei=h.indexOf('empresa'),ci=h.findIndex(x=>x==='caminhao'||x==='veiculo');
 if(hi<0||la<0||lo<0){errors.push(name+': faltam Hora, Latitude ou Longitude');continue;}
 const modern=si>=0&&ca>=0;
 if(si>=0&&ca<0){errors.push(name+': informe Setor e Caminhao');continue;}
 rows.slice(1).forEach((row,i)=>{if(row.every(v=>v==null||v===''))return;
 try{
 const lat=number(row[la]),lng=number(row[lo]);
 if(!Number.isFinite(lat)||!Number.isFinite(lng)||Math.abs(lat)>90||Math.abs(lng)>180||row[la]==null||row[lo]==null||String(row[la]).trim()===''||String(row[lo]).trim()==='')throw Error('Coordenadas inválidas');
 const sector=modern?String(row[si]??'').trim():'',truck=modern?String(row[ca]??'').trim():String(ci>=0?row[ci]||'Caminhão':ei>=0?row[ei]||'Caminhão':row[0]||'Caminhão');
 if(modern&&(!sector||!truck))throw Error('Setor e Caminhao são obrigatórios');
 const company=String(ci<0?name:(ei<0?name:row[ei]||name));
 const key=modern?JSON.stringify([sector,truck]):JSON.stringify([name,company,truck]);
 let route=groups.get(key);
 if(!route){route={label:modern?'Setor '+sector+' - Caminhão '+truck:company+' · '+truck,sector,truck,points:[]};groups.set(key,route);}
 const points=route.points;let time=minutes(row[hi]);
 if(points.length){const last=points.at(-1).time;time+=Math.floor(last/1440)*1440;if(time<last){if(last%1440>=1080&&time%1440<=360)time+=1440;else throw Error('Horários fora de ordem');}}
 points.push({lat,lng,time,period:pi>=0?String(row[pi]??'').trim():''});
 }catch(e){errors.push(name+', linha '+(i+2)+': '+e.message);}});
}
const routes=[...groups.values()];for(const r of routes)if(r.points.length<2)errors.push(r.label+': são necessários pelo menos dois pontos');
if(errors.length)throw Error(errors.slice(0,4).join('; '));if(!routes.length)throw Error('A planilha não contém trajetos válidos');return routes;
}
function color(sector){return ({'1':'#2563eb','2':'#16a34a','3':'#dc2626'})[sector]||'#7555aa';}
function nearest(points,lat,lng){const rad=Math.PI/180,R=6371000,c=Math.cos(lat*rad);const xy=p=>[(p.lng-lng)*rad*R*c,(p.lat-lat)*rad*R];let best={distance:Infinity};for(let i=0;i<points.length-1;i++){const a=points[i],b=points[i+1],[ax,ay]=xy(a),[bx,by]=xy(b),dx=bx-ax,dy=by-ay;const t=Math.max(0,Math.min(1,-(ax*dx+ay*dy)/(dx*dx+dy*dy||1))),distance=Math.hypot(ax+t*dx,ay+t*dy);if(distance<best.distance)best={distance,time:a.time+(b.time-a.time)*t,lat:a.lat+(b.lat-a.lat)*t,lng:a.lng+(b.lng-a.lng)*t,segment:i,period:t===1?b.period:(a.period===b.period?a.period:[a.period,b.period].filter(Boolean).join(' / '))};}return best;}
const api={number,minutes,clock,normalize,nearest,color};if(typeof module!=='undefined')module.exports=api;else root.Coleta=api;
})(typeof window!=='undefined'?window:globalThis);
