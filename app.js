const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const municipalities=['Alvarães','Amaturá','Anamã','Anori','Apuí','Atalaia do Norte','Autazes','Barcelos','Barreirinha','Benjamin Constant','Beruri','Boa Vista do Ramos','Boca do Acre','Borba','Caapiranga','Canutama','Carauari','Careiro','Careiro da Várzea','Coari','Codajás','Eirunepé','Envira','Fonte Boa','Guajará','Humaitá','Ipixuna','Iranduba','Itacoatiara','Itamarati','Itapiranga','Japurá','Juruá','Jutaí','Lábrea','Manacapuru','Manaquiri','Manaus','Manicoré','Maraã','Maués','Nhamundá','Nova Olinda do Norte','Novo Airão','Novo Aripuanã','Parintins','Pauini','Presidente Figueiredo','Rio Preto da Eva','Santa Isabel do Rio Negro','Santo Antônio do Içá','São Gabriel da Cachoeira','São Paulo de Olivença','São Sebastião do Uatumã','Silves','Tabatinga','Tapauá','Tefé','Tonantins','Uarini','Urucará','Urucurituba'];
const products=[{name:'Soro fisiológico 0,9%',stock:1380,use:48,safety:20},{name:'Amoxicilina 500 mg',stock:760,use:24,safety:25},{name:'Dipirona 500 mg',stock:2100,use:72,safety:18},{name:'Luvas de procedimento',stock:4600,use:155,safety:22},{name:'Oxigênio medicinal',stock:310,use:11,safety:30}];
const risks=['Baixo','Moderado','Alto','Crítico'];
function severity(a,l){const m=a-l;if(m<=-7||l>=a*1.25)return'Crítico';if(m<0)return'Alto';if(m<=5)return'Moderado';return'Baixo'}
function data(ci,pi=0){const p=products[pi],df=.78+((ci*13+pi*7)%43)/100,sf=.72+((ci*11+pi*17)%58)/100,use=Math.max(1,Math.round(p.use*df)),stock=Math.max(use*5,Math.round(p.stock*sf)),lead=12+((ci*7)%25)+[0,1,0,2,4][pi];return{stock,use,lead,safety:p.safety,autonomy:Math.floor(stock/use)}}
const ubs=municipalities.map((city,i)=>{const d=data(i);return{id:i+1,name:`UBS ${city} Centro`,city,...d,risk:severity(d.autonomy,d.lead)}});
function unitProduct(ci,pi){const d=data(ci,pi);return{id:ci+1,name:`UBS ${municipalities[ci]} Centro`,city:municipalities[ci],product:products[pi].name,productIndex:pi,...d,risk:severity(d.autonomy,d.lead),margin:d.autonomy-d.lead}}
function allInventory(){return municipalities.flatMap((_,ci)=>products.map((_,pi)=>unitProduct(ci,pi)))}
function worstAlerts(){const rank={Crítico:0,Alto:1,Moderado:2,Baixo:3};return municipalities.map((_,ci)=>products.map((_,pi)=>unitProduct(ci,pi)).sort((a,b)=>rank[a.risk]-rank[b.risk]||a.margin-b.margin)[0]).sort((a,b)=>rank[a.risk]-rank[b.risk]||a.margin-b.margin)}

const nav=[['dashboard','▦','Visão estadual'],['rotas','⇄','Risco de entrada'],['simulador','◉','Simulador de reposição'],['ubs','✚','UBS monitoradas'],['alertas','!','Alertas'],['relatorios','▤','Relatórios']];
const hiddenNav=[['estoque','▥','Estoque'],['desenvolvedor','</>','Desenvolvedor']];
let hiddenMode=false;
function unlockHiddenMode(){
 if(hiddenMode)return;
 hiddenMode=true;
 sessionStorage.setItem('hidrosee-hidden-mode','1');
 hiddenNav.forEach(item=>{if(!nav.some(x=>x[0]===item[0]))nav.push(item)});
 const navElement=document.getElementById('nav');
 if(navElement){
  navElement.innerHTML=nav.map(x=>`<a href="#${x[0]}" data-route="${x[0]}"><span>${x[1]}</span>${x[2]}</a>`).join('');
  $$('#nav a').forEach(x=>x.classList.toggle('active',x.dataset.route===location.hash.slice(1)));
 }
 toast('Modo HidroSee Interno ativado');
}
function lockHiddenMode(){
 hiddenMode=false;
 sessionStorage.removeItem('hidrosee-hidden-mode');
 hiddenNav.forEach(item=>{const i=nav.findIndex(x=>x[0]===item[0]);if(i>=0)nav.splice(i,1)});
}
function pill(r){const cls=r==='Crítico'?'critical':r==='Alto'?'high':r==='Moderado'?'medium':'low';return`<span class="pill ${cls}">${r}</span>`}function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
function head(k,t,d,a=''){return`<div class="page-head"><div><span class="eyebrow">${k}</span><h2>${t}</h2><p>${d}</p></div>${a}</div>`}
function metrics(){const c=ubs.filter(x=>['Crítico','Alto'].includes(x.risk)).length;return`<section class="metrics"><div class="metric"><div class="metric-top">Índice HidroSee</div><strong>74</strong><span class="trend risk">Risco demonstrativo alto</span></div><div class="metric"><div class="metric-top">Municípios</div><strong>62</strong><span class="trend">Cobertura estadual</span></div><div class="metric"><div class="metric-top">Lead time médio</div><strong>${Math.round(ubs.reduce((s,x)=>s+x.lead,0)/62)} dias</strong></div><div class="metric"><div class="metric-top">Prioridades</div><strong>${c}</strong><span class="trend risk">Alto ou crítico</span></div></section>`}
function dashboard(){return head('PANORAMA','Central de risco logístico','Entrada nacional, Manaus e distribuição às UBS.','<button class="primary" data-go="simulador">Simular reposição</button>')+metrics()+`<div class="grid-main"><div class="card"><h3>Corredor prioritário</h3><div class="route"><div class="route-node"><b>Outras regiões</b><small>Fornecedores</small></div><div class="route-arrow">→</div><div class="route-node"><b>Manaus</b><small>Central estadual</small></div><div class="route-arrow">→</div><div class="route-node"><b>UBS</b><small>Última milha</small></div></div><div class="risk-bar"><span style="width:74%"></span></div></div><div class="card"><h3>Critérios consistentes</h3><p class="muted">A classificação agora considera a margem entre autonomia e tempo de entrega. Margem positiva de até 5 dias é moderada, não alta.</p></div></div>`}
function rotas(){return head('ENTRADA DE CARGAS','Risco de abastecimento externo','Trechos demonstrativos do fornecimento até as UBS.')+`<div class="card"><div class="alerts">${[['São Paulo → Belém','Rodoviário',2,'Moderado'],['Belém → Manaus','Cabotagem/hidroviário',5,'Alto'],['Manaus → Tefé','Fluvial',9,'Crítico'],['Manaus → Parintins','Fluvial',4,'Moderado']].map(x=>`<div class="alert-row"><div><strong>${x[0]}</strong><small>${x[1]} · +${x[2]} dias</small></div>${pill(x[3])}</div>`).join('')}</div></div>`}
function simulator(){return head('PLANEJAMENTO PREDITIVO','Simulador de reposição','Os dados mudam por município e produto.')+`<div class="card"><form id="sim-form" class="form-grid"><label>Município<select id="sim-city">${municipalities.map(x=>`<option>${x}</option>`).join('')}</select></label><label>Insumo<select id="sim-item">${products.map((x,i)=>`<option value="${i}">${x.name}</option>`).join('')}</select></label><label>Estoque atual<input id="sim-stock" type="number" min="1"></label><label>Consumo médio diário<input id="sim-use" type="number" min="1"></label><label>Lead time normal<input id="sim-lead" type="number" min="1"></label><label>Estoque de segurança (%)<input id="sim-safe" type="number" min="0" max="100"></label><div class="full"><button class="primary">Calcular recomendação</button></div></form><div id="sim-result"></div></div>`}
function loadData(){const d=data($('#sim-city').selectedIndex,+$('#sim-item').value);$('#sim-stock').value=d.stock;$('#sim-use').value=d.use;$('#sim-lead').value=d.lead;$('#sim-safe').value=d.safety;calc()}
function probability(a,l){return Math.max(5,Math.min(98,Math.round(15+(l/Math.max(1,a)-.55)*85)))}
function calc(e){e?.preventDefault();const st=+$('#sim-stock').value,u=+$('#sim-use').value,l=+$('#sim-lead').value,s=+$('#sim-safe').value;if(!st||!u||!l)return toast('Preencha valores válidos.');const a=Math.floor(st/u),la=Math.ceil(l*1.65),m=a-la,r=severity(a,la),pp=Math.ceil(u*la*(1+s/100)),when=m<0?'Reposição emergencial':m<=5?'Solicitar agora':`Em até ${m-5} dias`;$('#sim-result').innerHTML=`<div class="result-panel"><div class="card-head"><h3>Recomendação para ${$('#sim-city').value}</h3>${pill(r)}</div><div class="result-grid"><div><small>Autonomia</small><strong>${a} dias</strong></div><div><small>Lead time ajustado</small><strong>${la} dias</strong></div><div><small>Margem logística</small><strong>${m>=0?'+':''}${m} dias</strong></div><div><small>Quando pedir</small><strong>${when}</strong></div></div><p class="muted">Ponto de pedido: <b>${pp} unidades</b>.</p></div><div class="scenario-grid">${[['Normal',l],['Estiagem moderada',Math.ceil(l*1.3)],['Estiagem severa',la]].map(x=>`<div class="scenario"><small>${x[0]}</small><strong>${x[1]} dias</strong><span>${probability(a,x[1])}% · ${severity(a,x[1])}</span></div>`).join('')}</div>`}
function ubsPage(){return head('REDE ESTADUAL','UBS monitoradas','Consulte estoque, consumo e prazo de entrega por produto em cada município.')+`<div class="toolbar"><input id="search" placeholder="Buscar município ou UBS"><select id="ubs-product">${products.map((p,i)=>`<option value="${i}">${p.name}</option>`).join('')}</select><select id="filter"><option value="">Todas as prioridades</option>${risks.map(x=>`<option>${x}</option>`).join('')}</select></div><div class="table-wrap"><table><thead><tr><th>UNIDADE</th><th>PRODUTO</th><th>ESTOQUE</th><th>CONSUMO/DIA</th><th>AUTONOMIA</th><th>ENTREGA</th><th>MARGEM</th><th>PRIORIDADE</th></tr></thead><tbody id="rows"></tbody></table></div>`}
function fill(){const q=($('#search').value||'').toLowerCase(),f=$('#filter').value,pi=Number($('#ubs-product').value);const rows=municipalities.map((_,ci)=>unitProduct(ci,pi)).filter(x=>(x.city+' '+x.name).toLowerCase().includes(q)&&(!f||x.risk===f));$('#rows').innerHTML=rows.map(x=>`<tr><td><b>${x.name}</b><small class="table-sub">${x.city}</small></td><td>${x.product}</td><td><b>${x.stock.toLocaleString('pt-BR')}</b> un.</td><td>${x.use} un.</td><td>${x.autonomy} dias</td><td>${x.lead} dias</td><td class="${x.margin<0?'negative':'positive'}">${x.margin>=0?'+':''}${x.margin} dias</td><td>${pill(x.risk)}</td></tr>`).join('')||'<tr><td colspan="8">Nenhuma UBS encontrada.</td></tr>'}
function alertas(){const list=worstAlerts().slice(0,20);return head('CENTRAL DE ALERTAS','Prioridades de intervenção','Cada alerta identifica o produto com maior risco em cada UBS.','<button class="primary" id="plan">Gerar plano de ação</button>')+`<div class="card"><div class="alerts">${list.map(x=>`<div class="alert-row priority-${x.risk.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}"><div class="alert-copy"><strong>${x.name}</strong><span class="alert-product">${x.product}</span><small>Estoque ${x.stock.toLocaleString('pt-BR')} un. · consumo ${x.use}/dia · autonomia ${x.autonomy} dias · entrega ${x.lead} dias · margem ${x.margin>=0?'+':''}${x.margin}</small></div>${pill(x.risk)}</div>`).join('')}</div></div>`}
function reports(){const counts=Object.fromEntries(risks.map(r=>[r,ubs.filter(x=>x.risk===r).length])),p=counts.Crítico+counts.Alto;return head('DOCUMENTAÇÃO','Relatórios funcionais','Downloads refletem os dados atuais.')+`<div class="metrics">${[['Risco estadual','62 municípios','risk'],['Plano de reposição',`${p} prioridades`,'plan'],['Rotas críticas','4 corredores','routes'],['Metodologia','Equações','method']].map(x=>`<div class="metric"><span>${x[0]}</span><strong style="font-size:20px">${x[1]}</strong><button class="link-button report" data-kind="${x[2]}">Baixar →</button></div>`).join('')}</div><div class="card"><div class="result-grid">${risks.map(r=>`<div><small>${r}</small><strong>${counts[r]}</strong></div>`).join('')}</div></div>`}
function download(name,text){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+text],{type:'text/csv;charset=utf-8'}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),300)}
function report(k){if(k==='method')return window.open('METODOLOGIA-HIDROSEE.md','_blank');if(k==='routes')download('rotas.csv','Trecho;Modal;Atraso;Risco\nSão Paulo-Belém;Rodoviário;2;Moderado\nBelém-Manaus;Cabotagem;5;Alto\nManaus-Tefé;Fluvial;9;Crítico');else{let a=k==='plan'?ubs.filter(x=>['Alto','Crítico'].includes(x.risk)):ubs;download(k==='plan'?'plano-reposicao.csv':'risco-estadual.csv','Município;UBS;Autonomia;Lead time;Margem;Risco\n'+a.map(x=>`${x.city};${x.name};${x.autonomy};${x.lead};${x.autonomy-x.lead};${x.risk}`).join('\n'))}toast('Relatório baixado.')}

function estoque(){const inv=allInventory();const total=inv.reduce((s,x)=>s+x.stock,0),critical=inv.filter(x=>x.risk==='Crítico').length,low=inv.filter(x=>x.autonomy<15).length;return head('GESTÃO DE INSUMOS','Estoque estadual','Visão dos 310 registros demonstrativos: 62 municípios × 5 produtos.')+`<section class="metrics"><div class="metric"><span>Registros de estoque</span><strong>${inv.length}</strong><small class="muted">combinações UBS/produto</small></div><div class="metric"><span>Unidades disponíveis</span><strong>${total.toLocaleString('pt-BR')}</strong><small class="muted">soma demonstrativa</small></div><div class="metric"><span>Itens críticos</span><strong>${critical}</strong><small class="trend risk">reposição emergencial</small></div><div class="metric"><span>Autonomia abaixo de 15 dias</span><strong>${low}</strong><small class="trend risk">monitorar</small></div></section><div class="toolbar"><input id="stock-search" placeholder="Buscar município, UBS ou produto"><select id="stock-product"><option value="">Todos os produtos</option>${products.map((p,i)=>`<option value="${i}">${p.name}</option>`).join('')}</select><select id="stock-risk"><option value="">Todas as prioridades</option>${risks.map(r=>`<option>${r}</option>`).join('')}</select></div><div class="table-wrap"><table><thead><tr><th>UBS / MUNICÍPIO</th><th>PRODUTO</th><th>ESTOQUE</th><th>CONSUMO</th><th>AUTONOMIA</th><th>LEAD TIME</th><th>PRIORIDADE</th></tr></thead><tbody id="stock-rows"></tbody></table></div>`}
function fillStock(){const q=($('#stock-search').value||'').toLowerCase(),p=$('#stock-product').value,r=$('#stock-risk').value;const rows=allInventory().filter(x=>(x.name+' '+x.city+' '+x.product).toLowerCase().includes(q)&&(p===''||x.productIndex===Number(p))&&(!r||x.risk===r)).sort((a,b)=>a.margin-b.margin).slice(0,160);$('#stock-rows').innerHTML=rows.map(x=>`<tr><td><b>${x.name}</b><small class="table-sub">${x.city}</small></td><td>${x.product}</td><td><b>${x.stock.toLocaleString('pt-BR')}</b> un.</td><td>${x.use}/dia</td><td>${x.autonomy} dias</td><td>${x.lead} dias</td><td>${pill(x.risk)}</td></tr>`).join('')||'<tr><td colspan="7">Nenhum item encontrado.</td></tr>'}
function developer(){return head('DOCUMENTACAO TECNICA','Area do desenvolvedor','Memoria de calculo, regras de classificacao e parametros usados pelo prototipo.')+`<div class="grid-main"><div class="card"><h3>Fluxo de calculo</h3><div class="alerts"><div class="alert-row"><div><strong>1. Autonomia</strong><small>A = piso(Estoque / Consumo diario)</small></div></div><div class="alert-row"><div><strong>2. Lead time ajustado</strong><small>La = teto(Lead normal x Fator de estiagem)</small></div></div><div class="alert-row"><div><strong>3. Margem logistica</strong><small>M = Autonomia - Lead time ajustado</small></div></div><div class="alert-row"><div><strong>4. Ponto de pedido</strong><small>PP = teto(Consumo x La x (1 + Seguranca/100))</small></div></div></div></div><div class="card"><h3>Arquivos tecnicos</h3><p class="muted">A documentacao completa explica variaveis, multiplicadores, classificacao e exemplos calculados.</p><p><a class="primary" href="HIDROSEE-MEMORIA-DE-CALCULO.pdf" target="_blank">Abrir memoria de calculo em PDF</a></p><p><a class="link-button" href="METODOLOGIA-HIDROSEE.md" target="_blank">Abrir versao Markdown</a></p></div></div><div class="card" style="margin-top:17px"><h3>Faixas de risco</h3><div class="result-grid" style="margin-top:15px"><div><small>Baixo</small><strong>M &gt; 5 dias</strong></div><div><small>Moderado</small><strong>0 a 5 dias</strong></div><div><small>Alto</small><strong>-1 a -6 dias</strong></div><div><small>Critico</small><strong>M <= -7 dias</strong></div></div></div>`}

const pages={dashboard,rotas,simulador:simulator,ubs:ubsPage,alertas,relatorios:reports,estoque,desenvolvedor:developer};
function bind(route){$$('[data-go]').forEach(x=>x.onclick=()=>go(x.dataset.go));if(route==='simulador'){$('#sim-form').onsubmit=calc;$('#sim-city').onchange=loadData;$('#sim-item').onchange=loadData;loadData()}if(route==='ubs'){$('#search').oninput=fill;$('#filter').onchange=fill;$('#ubs-product').onchange=fill;fill()}if(route==='estoque'){$('#stock-search').oninput=fillStock;$('#stock-product').onchange=fillStock;$('#stock-risk').onchange=fillStock;fillStock()}$('#plan')?.addEventListener('click',()=>report('plan'));$$('.report').forEach(x=>x.onclick=()=>report(x.dataset.kind))}
function go(r){
 if((r==='estoque'||r==='desenvolvedor')&&!hiddenMode)r='dashboard';
 r=pages[r]?r:'dashboard';
 if(location.hash.slice(1)!==r)location.hash=r;
 $('#content').innerHTML=pages[r]();
 $$('#nav a').forEach(x=>x.classList.toggle('active',x.dataset.route===r));
 const page=[...nav,...hiddenNav].find(x=>x[0]===r);
 if(page)$('#title').textContent=page[2];
 $('#sidebar').classList.remove('open');
 bind(r);
}
function show(){ $('#login-screen').classList.add('hidden');$('#app').classList.remove('hidden');$('#nav').innerHTML=nav.map(x=>`<a href="#${x[0]}" data-route="${x[0]}"><span>${x[1]}</span>${x[2]}</a>`).join('');go(location.hash.slice(1)||'dashboard')}
function performLogin(event){
 if(event) event.preventDefault();
 const userInput=document.getElementById('login-user');
 const passwordInput=document.getElementById('login-password');
 const error=document.getElementById('login-error');
 if(!userInput || !passwordInput){
  console.error('HidroSee: campos de login nao encontrados.');
  return false;
 }
 const valid=userInput.value.trim().toLowerCase()==='cema' && passwordInput.value==='hidrosee';
 if(!valid){
  if(error) error.textContent='Usuario ou senha incorretos.';
  passwordInput.focus();
  return false;
 }
 if(error) error.textContent='';
 sessionStorage.setItem('hidrosee-auth','1');
 show();
 return false;
}
function initializeApp(){
 if(sessionStorage.getItem('hidrosee-hidden-mode')==='1'){
  hiddenMode=true;
  hiddenNav.forEach(item=>{if(!nav.some(x=>x[0]===item[0]))nav.push(item)});
 }
 document.addEventListener('keydown',event=>{
  if(event.ctrlKey&&event.shiftKey&&event.key.toLowerCase()==='h'){
   event.preventDefault();
   unlockHiddenMode();
  }
 });
 // Delegacao evita falha mesmo se o formulario for recriado ou o script carregar antes do HTML.
 document.addEventListener('submit',event=>{
  if(event.target && event.target.id==='login-form') performLogin(event);
 },true);
 document.addEventListener('click',event=>{
  const button=event.target.closest('#login-form button[type="submit"], #login-form button:not([type])');
  if(button){
   event.preventDefault();
   performLogin(event);
  }
 },true);
 document.getElementById('menu')?.addEventListener('click',()=>document.getElementById('sidebar')?.classList.toggle('open'));
 document.getElementById('logout')?.addEventListener('click',()=>{
  sessionStorage.removeItem('hidrosee-auth');
  lockHiddenMode();
  location.hash='';
  location.reload();
 });
 document.getElementById('reset')?.addEventListener('click',()=>go('dashboard'));
 document.getElementById('alerts-button')?.addEventListener('click',()=>go('alertas'));
 window.addEventListener('hashchange',()=>{
  if(sessionStorage.getItem('hidrosee-auth')) go(location.hash.slice(1));
 });
 if(sessionStorage.getItem('hidrosee-auth')==='1') show();
 else {
  document.getElementById('login-screen')?.classList.remove('hidden');
  document.getElementById('app')?.classList.add('hidden');
 }
}
window.hidroseeLogin=performLogin;
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initializeApp,{once:true});
else initializeApp();
