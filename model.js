'use strict';
const Model={
 statuses:['Planuojamas','Vykdomas','Atvyko į objektą','Dirba objekte','Užbaigtas','Atšauktas'],
 round:n=>Math.round((n+Number.EPSILON)*100)/100,
 present:n=>n!==null&&n!==undefined&&n!==''&&Number.isFinite(Number(n)),
 planned:o=>Model.round(Number(o.km||0)*Number(o.rate||0)+Number(o.hours||0)*Number(o.hourRate||0)),
 actual:o=>Model.present(o.actualKm)&&Model.present(o.actualHours)?Model.round(Number(o.actualKm)*Number(o.rate||0)+Number(o.actualHours)*Number(o.hourRate||0)):null,
 price:o=>Model.actual(o)??Model.planned(o),
 overlaps:(a,b)=>a.date===b.date&&a.start<b.end&&b.start<a.end,
 open:o=>!['Užbaigtas','Atšauktas'].includes(o.status),
 conflict:(o,all)=>!Model.open(o)?null:all.find(x=>x.id!==o.id&&Model.open(x)&&((o.vehicle&&x.vehicle===o.vehicle)||(o.driver&&x.driver===o.driver))&&Model.overlaps(o,x)),
 date:d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`,
 addDays:(str,n)=>{const d=new Date(str+'T12:00:00');d.setDate(d.getDate()+n);return Model.date(d)},
 minutes:t=>{const [h,m]=t.split(':').map(Number);return h*60+m},
 needsCrane:o=>!!(o.loading||o.unloading||o.installation||o.service==='Pervežimas su fiskaru'||o.service==='Montavimo darbai'),
 suitability:(o,v)=>{
   if(!v)return ['Nepasirinkta transporto priemonė'];
   const r=[];
   if(o.service==='Statybinės technikos nuoma'&&v.kind!=='equipment')r.push('Šiai paslaugai reikalinga statybinė technika');
   if(o.service!=='Statybinės technikos nuoma'&&v.kind==='equipment')r.push('Ši technika neskirta krovinio pervežimui');
   if(v.kind!=='equipment'){
     if(Number(o.weight)>v.payload)r.push('Viršijama demonstracinė krovinio masės riba');
     if(Number(o.length)>v.length||Number(o.width)>v.width)r.push('Krovinys viršija demonstracinius platformos matmenis');
   }
   if(Model.needsCrane(o)){
     if(!v.crane)r.push('Reikalingas kranas');
     else {if(Number(o.liftWeight)>v.lift)r.push('Viršijama nurodyta maksimali kėlimo galia');if(Number(o.reach)>v.reach)r.push('Viršijamas nurodytas strėlės siekis');}
   }
   if(o.trailerRequired&&!v.trailer)r.push('Reikalinga priekabos galimybė');
   return r;
 },
 next:o=>o.status==='Planuojamas'?'Vykdomas':o.status==='Vykdomas'?'Atvyko į objektą':o.status==='Atvyko į objektą'?(Model.needsCrane(o)||Number(o.hours)>0?'Dirba objekte':'Užbaigtas'):o.status==='Dirba objekte'?'Užbaigtas':null,
 validate:(o,all,vehicles)=>{
   if(!o.id.trim()||!o.client.trim()||!o.from.trim()||!o.to.trim())return 'Užpildykite užsakymo numerį, klientą ir maršrutą.';
   if(!o.date||!o.start||!o.end||o.start>=o.end)return 'Nurodykite datą ir tos pačios dienos intervalą: pabaiga turi būti vėlesnė už pradžią.';
   if(all.some(x=>x.id===o.id))return 'Toks užsakymo numeris jau naudojamas.';
   for(const k of ['km','rate','hours','hourRate','weight','length','width','height','liftWeight','reach'])if(!Number.isFinite(Number(o[k]))||Number(o[k])<0)return 'Skaičiai negali būti neigiami ar netinkamo formato.';
   if(!Number.isInteger(Number(o.quantity))||Number(o.quantity)<1)return 'Krovinio vienetų skaičius turi būti teigiamas sveikasis skaičius.';
   for(const k of ['actualKm','actualHours'])if(Model.present(o[k])&&Number(o[k])<0)return 'Faktinės reikšmės negali būti neigiamos.';
   if(Number(o.hours)>24||(Model.present(o.actualHours)&&Number(o.actualHours)>24))return 'Vienos dienos darbo valandos negali viršyti 24.';
   if(!!o.vehicle!==!!o.driver)return 'Priskirkite ir transportą, ir vairuotoją, arba abu laukus palikite nepriskirtus.';
   if(o.vehicle){const reasons=Model.suitability(o,vehicles.find(v=>v.id===o.vehicle));if(reasons.length)return reasons.join('. ')+'. Pakeiskite techniką arba palikite užsakymą nepriskirtą.';if(!o.reviewed||!o.reviewedBy.trim())return 'Prieš priskirdami patvirtinkite techninį suderinimą ir nurodykite atsakingą asmenį.';}
   if(!o.vehicle&&!['Planuojamas','Atšauktas'].includes(o.status))return 'Prieš pradėdami vykdyti priskirkite transportą ir vairuotoją.';
   const c=Model.conflict(o,all);if(c)return `Transportas arba vairuotojas užimtas: ${c.id}, ${c.start}–${c.end}.`;
   if(o.status==='Užbaigtas'&&Model.actual(o)===null)return 'Užbaigdami įrašykite faktinius kilometrus ir darbo valandas (jei darbo nebuvo – 0).';
   return '';
 }
};
if(typeof module!=='undefined')module.exports=Model;
