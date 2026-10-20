(()=> {
 const mount=document.getElementById("atlas-mount");
 if(!mount)return;
 const fields={name:document.getElementById("muscle-name"),region:document.getElementById("muscle-region"),fn:document.getElementById("muscle-function"),art:document.getElementById("muscle-art")};
 const status=document.getElementById("atlas-status");
 const viewButtons=[...document.querySelectorAll("[data-atlas-view]")];
 let gender="male", view="front", showMuscles=false;
 const labels={front:"FRONTAL",back:"POSTERIOR",side:"LATERAL",iso:"ISOMÉTRICA"};
 function fileFor(){
   const prefix=gender==="male"?"human-male":"human-female";
   return view==="iso" ? `assets/anatomy/${prefix}-iso.png` : `assets/anatomy/${prefix}-${view}.png`;
 }
 function overlayFile(){
   if(view!=="front"&&view!=="back") return null;
   return `assets/muscles/${gender}-${view}-muscles.png`;
 }
 function render(){
   const overlay=overlayFile();
   mount.innerHTML=`
     <div class="character-controls">
       <div class="character-control-group" aria-label="Modelo corporal">
         <button type="button" class="pixel-button ${gender==="male"?"is-active":""}" data-gender="male" aria-pressed="${gender==="male"}">MASCULINO</button>
         <button type="button" class="pixel-button ${gender==="female"?"is-active":""}" data-gender="female" aria-pressed="${gender==="female"}">FEMENINO</button>
       </div>
       <label class="character-overlay-toggle"><input type="checkbox" data-show-muscles ${showMuscles?"checked":""} ${overlay?"":"disabled"}> Mostrar referencia muscular</label>
     </div>
     <div class="character-stage">
       <div class="character-pixel-stack">
         <img class="character-base" src="${fileFor()}" alt="Personaje ${gender==="male"?"masculino":"femenino"}, vista ${labels[view].toLowerCase()}">
         ${showMuscles&&overlay?`<img class="character-muscles" src="${overlay}" alt="Referencia de grupos musculares">`:""}
       </div>
     </div>
     <p class="character-caption">${gender==="male"?"MODELO MASCULINO":"MODELO FEMENINO"} / ${labels[view]}${overlay?"":" / REFERENCIA MUSCULAR NO DISPONIBLE PARA ESTA VISTA"}</p>
     <p class="character-note">La referencia muscular se puede activar en frontal y posterior. La selección individual de músculos se habilitará cuando las máscaras estén codificadas por regiones y alineadas con cada sprite.</p>`;
   mount.querySelectorAll("[data-gender]").forEach(b=>b.addEventListener("click",()=>{gender=b.dataset.gender;render();}));
   const check=mount.querySelector("[data-show-muscles]");
   check?.addEventListener("change",()=>{showMuscles=check.checked;render();});
   const image=mount.querySelector(".character-base");
   image.addEventListener("error",()=>{status.textContent="NO SE PUDO CARGAR EL PNG";});
   status.textContent=`SPRITE ${gender.toUpperCase()} // ${labels[view]}`;
   viewButtons.forEach(b=>{const active=b.dataset.atlasView===view || (view==="iso"&&b.dataset.atlasView==="isometric");b.classList.toggle("is-active",active);b.setAttribute("aria-pressed",String(active));});
 }
 viewButtons.forEach(b=>b.addEventListener("click",()=>{view=b.dataset.atlasView==="isometric"?"iso":b.dataset.atlasView;showMuscles=false;render();}));
 fields.name.textContent="Personaje anatómico";
 fields.region.textContent="Selecciona una vista";
 fields.fn.textContent="Explora los modelos masculino y femenino en cuatro perspectivas.";
 fields.art.textContent="Compara silueta, proporciones y masas. Activa la referencia muscular en las vistas frontal y posterior.";
 render();
})();