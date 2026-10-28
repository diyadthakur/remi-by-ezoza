const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const STORE = "remi-companion-v2";
const defaults = {
  name: "",
  voice: "browser",
  role: "patient",
  patientCode: "DEMO-001",
  moods: [],
  careNotes: [],
  routines: [
    {id:1,name:"Have a glass of water",time:"09:00",note:"Your favourite cup is ready.",done:false},
    {id:2,name:"Have something to eat",time:"12:30",note:"Take your time and enjoy your meal.",done:false},
    {id:3,name:"Take my medicine",time:"18:00",note:"Please follow the medicine plan from your care team.",done:false},
    {id:4,name:"Call someone I love",time:"19:00",note:"A familiar voice can make the day feel brighter.",done:false}
  ],
  memories:[
    {id:11,name:"People who love me",type:"Someone I love",note:"My family and friends care about me. I can ask them for help whenever I need it."},
    {id:12,name:"A place that feels like home",type:"A favourite place",note:"I can take a breath and look at my memory notes if I need a reminder."}
  ],
  trusted:[]
};
let state = load();
let dialogMode = "routine";
let toastTimer;
function load(){try{return {...structuredClone(defaults),...JSON.parse(localStorage.getItem(STORE)||"{}")}}catch{return structuredClone(defaults)}}
function save(){try{localStorage.setItem(STORE,JSON.stringify(state))}catch{showToast("This browser could not save your changes.")}}
function esc(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function showToast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2600)}
function today(){return new Intl.DateTimeFormat(undefined,{weekday:"long",month:"long",day:"numeric"}).format(new Date())}
function greet(){const h=new Date().getHours();return h<12?"Good morning":h<17?"Good afternoon":"Good evening"}
function renderHeader(){$("#greeting").innerHTML=`${greet()}${state.name?", "+esc(state.name):", there"} <span>♡</span>`;$("#dateLine").textContent=today();$("#todayLabel").textContent="A LITTLE AT A TIME";$("#userName").value=state.name||"";$("#voicePreference").value=state.voice||"browser"}
function renderRoutines(){
 const list=$("#routineList");
 list.innerHTML=state.routines.length?state.routines.map(r=>`<article class="routine-item ${r.done?"done":""}"><button class="routine-check" data-check="${r.id}" aria-label="${r.done?"Mark incomplete":"Mark complete"}">${r.done?"✓":""}</button><div class="routine-copy"><strong>${esc(r.name)}</strong><p>${esc(r.note||"One small step at a time.")}</p></div>${r.time?`<span class="routine-time">${esc(r.time)}</span>`:""}<button class="delete-item" data-delete-routine="${r.id}" aria-label="Delete reminder">×</button></article>`).join(""):`<div class="panel" style="padding:20px;color:#7f8579;font-size:13px">No reminders yet. You can add one whenever you like.</div>`;
 const done=state.routines.filter(r=>r.done).length;$("#progressPill").textContent=`${done} of ${state.routines.length} done`;
 $$("[data-check]").forEach(b=>b.onclick=()=>{const r=state.routines.find(x=>x.id===Number(b.dataset.check));if(r){r.done=!r.done;save();renderRoutines();if(r.done)showToast("Well done. One little thing taken care of. ♡")}});
 $$("[data-delete-routine]").forEach(b=>b.onclick=()=>{state.routines=state.routines.filter(x=>x.id!==Number(b.dataset.deleteRoutine));save();renderRoutines();showToast("Reminder removed.")});
}
function renderMemories(){$("#memoryList").innerHTML=state.memories.length?state.memories.map(m=>`<article class="memory-card panel"><div class="memory-type">${esc(m.type)}</div><h3>${esc(m.name)}</h3><p>${esc(m.note||"A memory to keep close.")}</p></article>`).join(""):`<div class="panel" style="padding:20px;color:#7f8579;font-size:13px">Your story can grow here, one memory at a time.</div>`}
function renderTrusted(){$("#trustedList").innerHTML=state.trusted.length?state.trusted.map((p,i)=>`<div class="trusted-row"><div class="trusted-avatar">♡</div><div class="trusted-copy"><strong>${esc(p.name)}</strong><small>${esc([p.relation,p.phone].filter(Boolean).join(" · ")||"Trusted person")}</small></div>${p.phone?`<a href="tel:${esc(p.phone.replace(/[^\d+*#]/g,""))}" aria-label="Call ${esc(p.name)}">Call</a>`:""}<button class="delete-item" data-delete-trusted="${i}" aria-label="Remove trusted person">×</button></div>`).join(""):`<p class="quiet-note">No trusted people added yet.</p>`;$$("[data-delete-trusted]").forEach(b=>b.onclick=()=>{state.trusted.splice(Number(b.dataset.deleteTrusted),1);save();renderTrusted()})}
function switchView(name){$$(".tab").forEach(b=>b.classList.toggle("active",b.dataset.view===name));$$(".view").forEach(v=>{const active=v.id===`view-${name}`;v.classList.toggle("active",active);v.hidden=!active});if(name==="care")renderCare()}
function openDialog(mode){dialogMode=mode;$("#itemForm").reset();$("#routineFields").hidden=mode!=="routine";$("#memoryFields").hidden=mode!=="memory";$("#trustedFields").hidden=mode!=="trusted";$("#dialogTitle").textContent=mode==="routine"?"Add a reminder":mode==="memory"?"Add a memory":"Add a trusted person";$("#dialogEyebrow").textContent=mode==="routine"?"A LITTLE REMINDER":mode==="memory"?"MY STORY":"PEOPLE WHO CARE";$("#itemDialog").showModal()}
$("#itemForm").addEventListener("submit",e=>{e.preventDefault();if(dialogMode==="routine"){const name=$("#routineName").value.trim();if(!name)return;state.routines.push({id:Date.now(),name,time:$("#routineTime").value,note:$("#routineNote").value.trim(),done:false});renderRoutines();showToast("Your reminder has been added.")}else if(dialogMode==="memory"){const name=$("#memoryName").value.trim();if(!name)return;state.memories.push({id:Date.now(),name,type:$("#memoryType").value,note:$("#memoryNote").value.trim()});renderMemories();showToast("Your memory has been saved on this device.")}else{const name=$("#trustedName").value.trim();if(!name)return;state.trusted.push({name,phone:$("#trustedPhone").value.trim(),relation:$("#trustedRelation").value.trim()});renderTrusted();showToast("Trusted person added on this device.")}save();$("#itemDialog").close()});
$("#addRoutine").onclick=()=>openDialog("routine");$("#addMemory").onclick=()=>openDialog("memory");$("#addTrusted").onclick=()=>openDialog("trusted");
$$(".tab").forEach(b=>b.onclick=()=>switchView(b.dataset.view));
const moodMessages={Lovely:"That’s lovely to hear. Hold on to this little moment. ♡",Okay:"Okay is a perfectly good place to be. We can take today slowly.",Worried:"I’m sorry things feel worrying. Try one slow breath. Would it help to contact someone you trust?",Sad:"I’m sorry you’re feeling sad. You deserve kindness. Is there someone you’d like to talk to?"};
$$(".mood").forEach(b=>b.onclick=()=>{$$(".mood").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");$("#moodResponse").textContent=moodMessages[b.dataset.mood];state.moods=state.moods||[];state.moods.unshift({mood:b.dataset.mood,at:new Date().toISOString()});state.moods=state.moods.slice(0,30);save();showToast("Thank you for checking in with yourself.")});
const calming=["You are here, in this moment. There is no rush.","Let your shoulders soften. Take one gentle breath in, and slowly breathe out.","You are a person who matters. It is okay to ask for help.","We can do one small thing at a time. You do not have to remember everything right now.","You are not alone. Someone who cares about you can help."];
function newCalm(){const msg=calming[Math.floor(Math.random()*calming.length)];$("#voiceText").textContent=msg;return msg}
$("#calmButton").onclick=()=>{const msg=newCalm();speak(msg)};
$("#speakButton").onclick=()=>speak($("#voiceText").textContent);
function speak(text){if(state.voice==="silent"){showToast("Voice is turned off in settings.");return}if(!("speechSynthesis" in window)){showToast("This device does not offer spoken messages. You can read the message above.");return}window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.rate=.84;utterance.pitch=1.02;utterance.lang=navigator.language||"en-US";window.speechSynthesis.speak(utterance)}
$("#settingsOpen").onclick=()=>$("#settingsDialog").showModal();
$("#settingsForm").addEventListener("submit",e=>{e.preventDefault();state.name=$("#userName").value.trim();state.voice=$("#voicePreference").value;save();renderHeader();$("#settingsDialog").close();showToast("Your settings have been saved.")});
$("#clearData").onclick=()=>{if(confirm("Clear all Remi data saved in this browser? This cannot be undone.")){localStorage.removeItem(STORE);state=structuredClone(defaults);save();renderAll();$("#settingsDialog").close();showToast("Local app data cleared.")}};
$("#locationButton").onclick=()=>{const result=$("#locationResult");if(!navigator.geolocation){result.textContent="Location is not supported by this browser.";return}result.textContent="Waiting for your permission…";navigator.geolocation.getCurrentPosition(pos=>{const lat=pos.coords.latitude.toFixed(4),lon=pos.coords.longitude.toFixed(4);result.innerHTML=`Your device shared this location with the app: <strong>${lat}, ${lon}</strong><br><a target="_blank" rel="noopener noreferrer" href="https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}">Open map</a><br><small>This is a one-time location check, not continuous tracking.</small>`},err=>{result.textContent=err.code===1?"Location permission was not given. That is okay.": "We couldn’t get your location just now. Try again when you feel ready."},{enableHighAccuracy:false,timeout:10000,maximumAge:60000})};
$("#emergencyInfo").onclick=()=>{$("#emergencyResult").hidden=!$("#emergencyResult").hidden};

function fmtTime(iso){try{return new Date(iso).toLocaleString([], {month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}catch{return ""}}
function renderCare(){
 state.moods=state.moods||[];state.careNotes=state.careNotes||[];
 $("#moodCount").textContent=state.moods.length;
 $("#openRoutineCount").textContent=state.routines.filter(r=>!r.done).length;
 $("#alertCount").textContent=state.careNotes.length;
 $("#carePatientName").value=state.name||"";
 $("#carePatientCode").value=state.patientCode||"DEMO-001";
 $("#careRole").value=state.role||"patient";
 $("#connectionPill").textContent="Local demo";
 $("#careMoodList").innerHTML=state.moods.length?state.moods.slice(0,8).map(m=>`<div class="care-feed-row"><span class="feed-dot"></span><div><strong>${esc(m.mood)} check-in</strong><small>${esc(fmtTime(m.at))}</small></div></div>`).join(""):'<p class="quiet-note">No check-ins yet. Mood check-ins made in Today will appear here on this device.</p>';
 $("#careNoteList").innerHTML=state.careNotes.length?state.careNotes.slice().reverse().map(n=>`<div class="care-feed-row"><span class="feed-dot note-dot"></span><div><strong>${esc(n.text)}</strong><small>${esc(fmtTime(n.at))}</small></div><button class="delete-item" data-care-delete="${n.id}" aria-label="Delete note">×</button></div>`).join(""):'<p class="quiet-note">No demo notes have been added.</p>';
 $$("[data-care-delete]").forEach(b=>b.onclick=()=>{state.careNotes=state.careNotes.filter(n=>n.id!==Number(b.dataset.careDelete));save();renderCare()});
}
$("#saveCareProfile").onclick=()=>{state.name=$("#carePatientName").value.trim();state.patientCode=$("#carePatientCode").value.trim()||"DEMO-001";state.role=$("#careRole").value;save();renderHeader();renderCare();showToast("Demo profile saved on this device.")};
$("#careNoteForm").addEventListener("submit",e=>{e.preventDefault();const input=$("#careNoteInput");const text=input.value.trim();if(!text)return;state.careNotes=state.careNotes||[];state.careNotes.push({id:Date.now(),text,at:new Date().toISOString()});input.value="";save();renderCare();showToast("Demo note saved locally.")});
$("#exportData").onclick=()=>{const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),notice:"Local prototype export; not a clinical record.",data:state},null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="remi-demo-data.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
function renderAll(){renderHeader();renderRoutines();renderMemories();renderTrusted();if($("#view-care"))renderCare()}
renderAll();
if("serviceWorker" in navigator && (location.protocol==="https:"||location.hostname==="localhost"))window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
