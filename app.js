const $=s=>document.querySelector(s);
const keys={students:'amal_students',teachers:'amal_teachers',classes:'amal_classes',attendance:'amal_attendance',grades:'amal_grades',schedule:'amal_schedule',announcements:'amal_announcements'};
const titles={dashboard:'لوحة التحكم',students:'إدارة الطلاب',teachers:'إدارة المعلمين',classes:'الصفوف والفصول',attendance:'الحضور والغياب',grades:'الدرجات والنتائج',schedule:'الجدول الدراسي',announcements:'الإعلانات'};
let page='dashboard', editId=null, currentUser=null;
titles.accounts='حسابات المعلمين';titles.parentAccounts='حسابات أولياء الأمور';titles.contact='تواصل معنا';
const accountKey='amal_accounts';
const parentKey='amal_parent_accounts';
function parentAccounts(){try{return JSON.parse(localStorage.getItem(parentKey)||'[]')}catch{return []}}
function saveParentAccounts(a){localStorage.setItem(parentKey,JSON.stringify(a))}
const noticeKey='amal_parent_notices';
function notices(){try{return JSON.parse(localStorage.getItem(noticeKey)||'[]')}catch{return []}}
function saveNotices(a){localStorage.setItem(noticeKey,JSON.stringify(a))}
function notifyParentsForStudent(studentName,title,body){
 const student=data('students').find(s=>s.name===studentName);
 if(!student)return;
 const linked=parentAccounts().filter(a=>String(a.studentNumber)===String(student.number));
 if(!linked.length)return;
 const all=notices();
 linked.forEach(a=>all.push({id:Date.now()+Math.random(),studentNumber:student.number,title,body,date:new Date().toLocaleString('ar-YE')}));
 saveNotices(all);
}
function accounts(){try{return JSON.parse(localStorage.getItem(accountKey)||'[]')}catch{return []}}
function saveAccounts(a){localStorage.setItem(accountKey,JSON.stringify(a))}
const teacherPages=['dashboard','students','attendance','grades','schedule'];
function allowed(p){
 if(p==='contact')return !!currentUser;
 if(currentUser?.role==='admin')return true;
 if(currentUser?.role==='parent')return p==='dashboard';
 return teacherPages.includes(p);
}
const seed={
 students:[{id:1,name:'أحمد محمد',number:'1001',stage:'إعدادي',grade:'السابع',phone:'777000001'},{id:2,name:'سارة علي',number:'1002',stage:'إعدادي',grade:'الثامن',phone:'777000002'}],
 teachers:[{id:1,name:'محمد عبدالله',subject:'الرياضيات',phone:'777111111'},{id:2,name:'فاطمة حسن',subject:'اللغة العربية',phone:'777222222'}],
 classes:[{id:1,stage:'ابتدائي',name:'الأول',section:'أ',room:'1'},{id:2,stage:'إعدادي',name:'السابع',section:'أ',room:'2'}],
 attendance:[],grades:[],schedule:[],announcements:[{id:1,title:'مرحباً بكم في مدارس فجر الاتحاد الحديثة',body:'نتمنى لجميع الطلاب عاماً دراسياً مليئاً بالنجاح.',date:new Date().toISOString().slice(0,10)}]
};
function data(k){let v=localStorage.getItem(keys[k]);if(v===null){localStorage.setItem(keys[k],JSON.stringify(seed[k]||[]));return seed[k]||[]}try{return JSON.parse(v)}catch{return []}}
function save(k,v){localStorage.setItem(keys[k],JSON.stringify(v))}
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function toast(t){let x=$('#toast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),2200)}
function enter(){ $('#login').classList.add('hidden');$('#app').classList.remove('hidden');render(); }
$('#loginForm').addEventListener('submit',e=>{e.preventDefault();const u=$('#username').value.trim(),pw=$('#password').value; if(u==='admin'&&pw==='1234'){currentUser={username:'admin',name:'مدير النظام',role:'admin'};enter();return}const found=accounts().find(a=>a.username===u&&a.password===pw&&a.active!==false);if(found){currentUser={...found};enter();return}const parent=parentAccounts().find(a=>a.username===u&&a.password===pw&&a.active!==false);if(parent){currentUser={...parent,role:'parent'};enter();return}toast('اسم المستخدم أو كلمة المرور غير صحيحة')});
$('#logout').onclick=()=>{currentUser=null;page='dashboard';$('#app').classList.add('hidden');$('#login').classList.remove('hidden')};
$('#menuBtn').onclick=()=>$('.sidebar').classList.toggle('open');
$('#nav').addEventListener('click',e=>{let b=e.target.closest('[data-page]');if(!b)return;page=b.dataset.page;$('.sidebar').classList.remove('open');render()});
$('#today').textContent=new Intl.DateTimeFormat('ar-YE',{dateStyle:'full'}).format(new Date());
function render(){if(!allowed(page))page='dashboard';$('#pageTitle').textContent=titles[page];document.querySelectorAll('.nav').forEach(b=>{b.classList.toggle('active',b.dataset.page===page);b.classList.toggle('hidden',!allowed(b.dataset.page))});document.querySelectorAll('.admin-only').forEach(b=>b.classList.toggle('hidden',currentUser?.role!=='admin'));$('.user').innerHTML=`${esc(currentUser?.name||'مستخدم')} <span>${currentUser?.role==='admin'?'م':'ع'}</span>`;let c=$('#content');if(page==='dashboard')return dashboard(c);if(page==='accounts')return accountsPage(c);
if(page==='parentAccounts')return parentAccountsPage(c);
if(page==='contact')return contactPage(c);
if(currentUser?.role==='parent')return parentPortal(c);
tablePage(c,page)}
function contactPage(c){
 c.innerHTML=`<div class="welcome"><div><h2>تواصل مع مدارس فجر الاتحاد الحديثة</h2><p>نسعد باستفساراتكم وملاحظاتكم</p></div><div class="cap"><i class="fa-solid fa-school"></i></div></div>
 <div class="grid2" style="margin-top:18px"><div class="panel"><h3>بيانات التواصل</h3>
 <p><i class="fa-solid fa-location-dot"></i> صنعاء – سعوان – شارع الأربعين عند الدوار</p>
 <p><i class="fa-solid fa-envelope"></i> <a href="mailto:fajr123ff@gmail.com">fajr123ff@gmail.com</a></p>
 <p><i class="fa-solid fa-graduation-cap"></i> المرحلتان الابتدائية والإعدادية</p>
 <p><i class="fa-brands fa-whatsapp"></i> للاستفسار عبر البريد الإلكتروني أو إدارة المدرسة</p>
 </div><div class="panel"><h3>أرسل رسالة</h3><form id="contactForm"><label>الاسم<input name="name" required minlength="2"></label><label>البريد الإلكتروني<input name="email" type="email" required></label><label>موضوع الرسالة<input name="subject" required></label><label>الرسالة<textarea name="message" rows="4" required minlength="10"></textarea></label><button class="primary">إرسال عبر البريد</button></form></div></div>`;
 $('#contactForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);const subject=encodeURIComponent(f.get('subject'));const body=encodeURIComponent(`الاسم: ${f.get('name')}\nالبريد: ${f.get('email')}\n\n${f.get('message')}`);location.href=`mailto:fajr123ff@gmail.com?subject=${subject}&body=${body}`};
}
function dashboard(c){let count=k=>data(k).length;c.innerHTML=`
<div class="welcome"><div><h2>مرحباً بك في نظام مدارس فجر الاتحاد الحديثة 👋</h2><p>إدارة مدرستك ومتابعة العملية التعليمية من مكان واحد.</p></div><div class="cap">🏫</div></div>
<div id="schoolGallery" class="carousel slide mb-4" data-bs-ride="carousel" aria-label="معرض صور المدرسة">
 <div class="carousel-inner rounded-4 overflow-hidden">
  <div class="carousel-item active"><img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&auto=format&fit=crop" class="d-block w-100" style="height:250px;object-fit:cover" alt="طلاب في بيئة تعليمية"><div class="carousel-caption"><h5>بيئة تعليمية ملهمة</h5></div></div>
  <div class="carousel-item"><img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop" class="d-block w-100" style="height:250px;object-fit:cover" alt="فصل دراسي"><div class="carousel-caption"><h5>نتعلم لنصنع المستقبل</h5></div></div>
  <div class="carousel-item"><img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80" class="d-block w-100" style="height:250px;object-fit:cover" alt="أنشطة تعليمية"><div class="carousel-caption"><h5>مدارس فجر الاتحاد الحديثة</h5></div></div>
 </div><button class="carousel-control-prev" type="button" data-bs-target="#schoolGallery" data-bs-slide="prev"><span class="carousel-control-prev-icon"></span><span class="visually-hidden">السابق</span></button><button class="carousel-control-next" type="button" data-bs-target="#schoolGallery" data-bs-slide="next"><span class="carousel-control-next-icon"></span><span class="visually-hidden">التالي</span></button>
</div>
<div class="stats">${[['الطلاب','students','♟'],['المعلمون','teachers','♙'],['الصفوف','classes','▤'],['الإعلانات','announcements','◉']].map(x=>`<div class="stat"><div class="label">${x[2]} ${x[0]}</div><strong>${count(x[1])}</strong></div>`).join('')}</div>
<div class="grid2"><div class="panel"><h3>الوصول السريع</h3><div class="quick">${Object.keys(titles).filter(k=>k!=='dashboard'&&allowed(k)).map(k=>`<button data-go="${k}">＋ ${titles[k]}</button>`).join('')}</div></div><div class="panel"><h3>آخر الإعلانات</h3>${data('announcements').slice().reverse().slice(0,4).map(a=>`<p><b>${esc(a.title)}</b><br><small>${esc(a.date||'')}</small></p>`).join('')||'<p class="empty">لا توجد إعلانات بعد</p>'}</div></div>`;
c.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{page=b.dataset.go;render()})}
const configs={
 students:{singular:'طالب',fields:[['name','اسم الطالب','text'],['number','رقم الطالب','text'],['stage','المرحلة','select'],['grade','الصف','select'],['phone','رقم ولي الأمر','tel']],cols:[['name','اسم الطالب'],['number','رقم الطالب'],['stage','المرحلة'],['grade','الصف'],['phone','رقم ولي الأمر']]},
 teachers:{singular:'معلم',fields:[['name','اسم المعلم','text'],['subject','المادة','text'],['phone','رقم الهاتف','tel']],cols:[['name','اسم المعلم'],['subject','المادة'],['phone','الهاتف']]},
 classes:{singular:'صف',fields:[['stage','المرحلة','select'],['name','الصف','select'],['section','الشعبة','text'],['room','رقم الفصل','text']],cols:[['stage','المرحلة'],['name','الصف'],['section','الشعبة'],['room','الفصل']]},
 attendance:{singular:'سجل حضور',fields:[['student','اسم الطالب','text'],['date','التاريخ','date'],['status','الحالة','select']],cols:[['student','الطالب'],['date','التاريخ'],['status','الحالة']]},
 grades:{singular:'درجة',fields:[['student','اسم الطالب','text'],['subject','المادة','text'],['term','الفصل الدراسي','text'],['score','الدرجة','number']],cols:[['student','الطالب'],['subject','المادة'],['term','الفصل'],['score','الدرجة']]},
 schedule:{singular:'حصة',fields:[['grade','الصف','text'],['day','اليوم','select'],['period','الحصة','text'],['subject','المادة','text'],['teacher','المعلم','text']],cols:[['grade','الصف'],['day','اليوم'],['period','الحصة'],['subject','المادة'],['teacher','المعلم']]},
 announcements:{singular:'إعلان',fields:[['title','عنوان الإعلان','text'],['body','تفاصيل الإعلان','textarea'],['date','التاريخ','date']],cols:[['title','العنوان'],['body','التفاصيل'],['date','التاريخ']]}
};
function tablePage(c,k){let cfg=configs[k],rows=data(k);c.innerHTML=`<div class="section-head"><h2>${titles[k]}</h2><div class="tools"><input id="search" placeholder="ابحث..."><button class="primary" id="add">＋ إضافة ${cfg.singular}</button></div></div><div class="table-wrap"><table><thead><tr>${cfg.cols.map(x=>`<th>${x[1]}</th>`).join('')}<th>الإجراءات</th></tr></thead><tbody id="tbody"></tbody></table></div>`;
function fill(q=''){let filtered=rows.filter(r=>cfg.cols.some(col=>String(r[col[0]]||'').toLowerCase().includes(q.toLowerCase())));$('#tbody').innerHTML=filtered.length?filtered.map(r=>`<tr>${cfg.cols.map(col=>`<td>${esc(r[col[0]])}</td>`).join('')}<td><div class="actions"><button class="secondary" data-edit="${r.id}">تعديل</button><button class="danger" data-del="${r.id}">حذف</button></div></td></tr>`).join(''):`<tr><td colspan="${cfg.cols.length+1}" class="empty">لا توجد بيانات. اضغط إضافة للبدء.</td></tr>`}
fill();$('#search').oninput=e=>fill(e.target.value);$('#add').onclick=()=>openForm(k,null);
$('#tbody').onclick=e=>{let ed=e.target.closest('[data-edit]'),del=e.target.closest('[data-del]');if(ed)openForm(k,Number(ed.dataset.edit));if(del&&confirm('هل تريد حذف هذا السجل؟')){rows=rows.filter(r=>r.id!==Number(del.dataset.del));save(k,rows);fill();toast('تم الحذف')}};
}
function openForm(k,id){let cfg=configs[k],rows=data(k),old=rows.find(r=>r.id===id)||{};let fields=cfg.fields.map(([key,label,type])=>{let val=old[key]|| (type==='date'?new Date().toISOString().slice(0,10):'');if(type==='select'){let opts;
if(key==='status')opts=['حاضر','غائب','متأخر'];
else if(key==='day')opts=['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس'];
else if(key==='stage')opts=['ابتدائي','إعدادي'];
else if(key==='grade'||key==='name'&&k==='classes')opts=['الأول','الثاني','الثالث','الرابع','الخامس','السادس','السابع','الثامن','التاسع'];
else opts=[];
return `<label>${label}<select name="${key}">${opts.map(o=>`<option ${val===o?'selected':''}>${o}</option>`).join('')}</select></label>`}if(type==='textarea')return `<label style="grid-column:1/-1">${label}<textarea name="${key}" rows="4">${esc(val)}</textarea></label>`;return `<label>${label}<input name="${key}" type="${type}" value="${esc(val)}" ${key==='score'?'min="0" max="100"':''} required></label>`}).join('');
let back=document.createElement('div');back.className='modal-back';back.innerHTML=`<form class="modal"><h3>${id?'تعديل':'إضافة'} ${cfg.singular}</h3><div class="form-grid">${fields}</div><div class="form-actions"><button class="primary">حفظ</button><button type="button" class="secondary" id="cancel">إلغاء</button></div></form>`;document.body.append(back);back.querySelector('#cancel').onclick=()=>back.remove();back.onclick=e=>{if(e.target===back)back.remove()};back.querySelector('form').onsubmit=e=>{e.preventDefault();let obj=Object.fromEntries(new FormData(e.target).entries());if(k==='grades'){obj.score=Number(obj.score);if(obj.score<0||obj.score>100){toast('الدرجة يجب أن تكون بين 0 و100');return}}if(id){rows=rows.map(r=>r.id===id?{...r,...obj}:r)}else{obj.id=Date.now();rows.push(obj)}save(k,rows);
if(k==='attendance'&&obj.status==='غائب')notifyParentsForStudent(obj.student,'تنبيه غياب الطالب',`تم تسجيل غياب ${obj.student} بتاريخ ${obj.date}.`);
if(k==='grades')notifyParentsForStudent(obj.student,'تمت إضافة درجة جديدة',`تم تسجيل درجة ${obj.score} في مادة ${obj.subject} للفصل ${obj.term}.`);
back.remove();render();toast('تم حفظ البيانات بنجاح')}}
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));


function parentPortal(c){
 const st=data('students').find(s=>String(s.number)===String(currentUser.studentNumber));
 if(!st){c.innerHTML=`<div class="panel"><h2>حساب ولي الأمر</h2><p>لم يتم العثور على الطالب المرتبط بهذا الحساب. يرجى مراجعة إدارة المدرسة.</p></div>`;return}
 const attendance=data('attendance').filter(a=>a.student===st.name);
 const grades=data('grades').filter(g=>g.student===st.name);
 const present=attendance.filter(a=>a.status==='حاضر').length;
 const absent=attendance.filter(a=>a.status==='غائب').length;
 const studentNotices=notices().filter(n=>String(n.studentNumber)===String(st.number)).slice().reverse();
 c.innerHTML=`<div class="welcome"><div><h2>مرحباً ${esc(currentUser.name)} 👋</h2><p>بوابة ولي الأمر – متابعة الطالب</p></div><div class="cap">👨‍👩‍👧</div></div>
 <div class="panel" style="margin:18px 0"><h3>بيانات الطالب</h3><div class="stats"><div class="stat"><div class="label">اسم الطالب</div><strong style="font-size:20px">${esc(st.name)}</strong></div><div class="stat"><div class="label">المرحلة</div><strong style="font-size:20px">${esc(st.stage||'—')}</strong></div><div class="stat"><div class="label">الصف</div><strong style="font-size:20px">${esc(st.grade)}</strong></div><div class="stat"><div class="label">رقم الطالب</div><strong style="font-size:20px">${esc(st.number)}</strong></div></div></div>
 <div class="stats"><div class="stat"><div class="label">أيام الحضور المسجلة</div><strong>${present}</strong></div><div class="stat"><div class="label">أيام الغياب المسجلة</div><strong>${absent}</strong></div></div>
 <div class="panel" style="margin:18px 0"><h3>تنبيهات المدرسة</h3>${studentNotices.length?studentNotices.map(n=>`<div style="padding:10px 0;border-bottom:1px solid #e5ebf2"><b>${esc(n.title)}</b><p style="margin:4px 0">${esc(n.body)}</p><small style="color:#718198">${esc(n.date)}</small></div>`).join(''):'<p class="empty">لا توجد تنبيهات جديدة حالياً.</p>'}</div>
 <div class="grid2"><div class="panel"><h3>الدرجات والنتائج</h3>${grades.length?`<div class="table-wrap"><table><thead><tr><th>المادة</th><th>الفصل</th><th>الدرجة</th></tr></thead><tbody>${grades.map(g=>`<tr><td>${esc(g.subject)}</td><td>${esc(g.term)}</td><td>${esc(g.score)}</td></tr>`).join('')}</tbody></table></div>`:'<p class="empty">لا توجد درجات مسجلة حالياً.</p>'}</div>
 <div class="panel"><h3>سجل الحضور والغياب</h3>${attendance.length?`<div class="table-wrap"><table><thead><tr><th>التاريخ</th><th>الحالة</th></tr></thead><tbody>${attendance.slice().reverse().map(a=>`<tr><td>${esc(a.date)}</td><td>${esc(a.status)}</td></tr>`).join('')}</tbody></table></div>`:'<p class="empty">لا يوجد سجل حضور حتى الآن.</p>'}</div></div>`;
}
function parentAccountsPage(c){
 if(currentUser?.role!=='admin'){page='dashboard';return render()}
 const list=parentAccounts();
 c.innerHTML=`<div class="section-head"><h2>حسابات أولياء الأمور</h2><div class="tools"><button class="primary" id="newParent">＋ إنشاء حساب ولي أمر</button></div></div>
 <div class="panel" style="margin-bottom:15px"><b>طريقة الربط:</b> يجب إدخال رقم الطالب المسجل في النظام لربط ولي الأمر بملف ابنه.</div>
 <div class="table-wrap"><table><thead><tr><th>اسم ولي الأمر</th><th>اسم المستخدم</th><th>رقم الطالب</th><th>الحالة</th><th>الإجراءات</th></tr></thead><tbody>${list.length?list.map(a=>`<tr><td>${esc(a.name)}</td><td>${esc(a.username)}</td><td>${esc(a.studentNumber)}</td><td><span class="badge">${a.active===false?'موقوف':'نشط'}</span></td><td><div class="actions"><button class="secondary" data-toggle-parent="${a.id}">${a.active===false?'تفعيل':'إيقاف'}</button><button class="danger" data-remove-parent="${a.id}">حذف</button></div></td></tr>`).join(''):'<tr><td colspan="5" class="empty">لا توجد حسابات لأولياء الأمور.</td></tr>'}</tbody></table></div>`;
 $('#newParent').onclick=()=>parentAccountForm();
 c.querySelectorAll('[data-toggle-parent]').forEach(b=>b.onclick=()=>{saveParentAccounts(parentAccounts().map(x=>x.id===Number(b.dataset.toggleParent)?{...x,active:x.active===false}:x));parentAccountsPage(c);toast('تم تحديث حالة الحساب')});
 c.querySelectorAll('[data-remove-parent]').forEach(b=>b.onclick=()=>{if(confirm('حذف حساب ولي الأمر؟')){saveParentAccounts(parentAccounts().filter(x=>x.id!==Number(b.dataset.removeParent)));parentAccountsPage(c);toast('تم حذف الحساب')}});
}
function parentAccountForm(){
 const students=data('students');
 if(!students.length){toast('أضف الطالب أولاً قبل إنشاء حساب ولي أمر');return}
 let back=document.createElement('div');back.className='modal-back';
 back.innerHTML=`<form class="modal"><h3>إنشاء حساب ولي أمر</h3><label>اسم ولي الأمر<input name="name" required></label><label>اختر الطالب المرتبط بالحساب<select name="studentNumber" required>${students.map(s=>`<option value="${esc(s.number)}">${esc(s.name)} – ${esc(s.number)} (${esc(s.grade)})</option>`).join('')}</select></label><label>اسم المستخدم<input name="username" required minlength="4"></label><label>كلمة المرور<input name="password" type="password" required minlength="6"></label><div class="form-actions"><button class="primary">إنشاء الحساب</button><button type="button" class="secondary" id="cancel">إلغاء</button></div></form>`;
 document.body.append(back);back.querySelector('#cancel').onclick=()=>back.remove();back.onclick=e=>{if(e.target===back)back.remove()};
 back.querySelector('form').onsubmit=e=>{e.preventDefault();let obj=Object.fromEntries(new FormData(e.target).entries());let all=parentAccounts();if(all.some(a=>a.username.toLowerCase()===obj.username.trim().toLowerCase())||accounts().some(a=>a.username.toLowerCase()===obj.username.trim().toLowerCase())||obj.username.trim()==='admin'){toast('اسم المستخدم مستخدم مسبقاً');return}obj.id=Date.now();obj.username=obj.username.trim();obj.active=true;all.push(obj);saveParentAccounts(all);back.remove();parentAccountsPage($('#content'));toast('تم إنشاء حساب ولي الأمر بنجاح')};
}

function accountsPage(c){
 if(currentUser?.role!=='admin'){page='dashboard';return render()}
 const list=accounts();
 c.innerHTML=`<div class="section-head"><h2>حسابات المعلمين</h2><div class="tools"><button class="primary" id="newAccount">＋ إنشاء حساب معلم</button></div></div>
 <div class="panel" style="margin-bottom:15px"><b>ملاحظة:</b> أنشئ حساباً لكل معلم، وأرسل له اسم المستخدم وكلمة المرور بشكل آمن.</div>
 <div class="table-wrap"><table><thead><tr><th>اسم المعلم</th><th>اسم المستخدم</th><th>المادة</th><th>الحالة</th><th>الإجراءات</th></tr></thead><tbody>${list.length?list.map(a=>`<tr><td>${esc(a.name)}</td><td>${esc(a.username)}</td><td>${esc(a.subject||'—')}</td><td><span class="badge">${a.active===false?'موقوف':'نشط'}</span></td><td><div class="actions"><button class="secondary" data-toggle="${a.id}">${a.active===false?'تفعيل':'إيقاف'}</button><button class="danger" data-remove="${a.id}">حذف</button></div></td></tr>`).join(''):'<tr><td colspan="5" class="empty">لا توجد حسابات معلمين حتى الآن.</td></tr>'}</tbody></table></div>`;
 $('#newAccount').onclick=()=>accountForm();
 c.querySelectorAll('[data-toggle]').forEach(b=>b.onclick=()=>{let a=accounts().map(x=>x.id===Number(b.dataset.toggle)?{...x,active:x.active===false}:x);saveAccounts(a);accountsPage(c);toast('تم تحديث حالة الحساب')});
 c.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{if(confirm('حذف حساب المعلم نهائياً؟')){saveAccounts(accounts().filter(x=>x.id!==Number(b.dataset.remove)));accountsPage(c);toast('تم حذف الحساب')}});
}
function accountForm(){
 let back=document.createElement('div');back.className='modal-back';
 back.innerHTML=`<form class="modal"><h3>إنشاء حساب معلم</h3><label>اسم المعلم<input name="name" required></label><label>المادة الدراسية<input name="subject" required></label><label>اسم المستخدم<input name="username" required minlength="4"></label><label>كلمة المرور<input name="password" type="password" required minlength="6"></label><div class="form-actions"><button class="primary">إنشاء الحساب</button><button type="button" class="secondary" id="cancel">إلغاء</button></div></form>`;
 document.body.append(back);back.querySelector('#cancel').onclick=()=>back.remove();back.onclick=e=>{if(e.target===back)back.remove()};
 back.querySelector('form').onsubmit=e=>{e.preventDefault();let obj=Object.fromEntries(new FormData(e.target).entries());let all=accounts();if(all.some(a=>a.username.toLowerCase()===obj.username.trim().toLowerCase())){toast('اسم المستخدم مستخدم مسبقاً');return}obj.id=Date.now();obj.username=obj.username.trim();obj.role='teacher';obj.active=true;all.push(obj);saveAccounts(all);back.remove();accountsPage($('#content'));toast('تم إنشاء حساب المعلم بنجاح')};
}
