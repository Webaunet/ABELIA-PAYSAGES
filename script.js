(function(){
  'use strict';
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var toast=$('#toast'), tt;
  function say(msg){
    if(!toast)return;
    toast.textContent=msg;toast.classList.add('is-on');
    clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('is-on')},3200);
  }

  /* Menu mobile */
  var burger=$('#burger'), nav=$('#nav');
  function setMenu(open){
    nav.classList.toggle('is-open',open);
    burger.setAttribute('aria-expanded',String(open));
    burger.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');
  }
  if(burger&&nav){
    burger.addEventListener('click',function(){setMenu(!nav.classList.contains('is-open'))});
    nav.addEventListener('click',function(e){if(e.target.closest('a'))setMenu(false)});
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'&&nav.classList.contains('is-open')){setMenu(false);burger.focus()}
    });
    var mq=window.matchMedia('(min-width:981px)');
    var onMq=function(e){if(e.matches)setMenu(false)};
    if(mq.addEventListener)mq.addEventListener('change',onMq);else mq.addListener(onMq);
  }

  /* Copie dans le presse-papiers */
  function copyText(txt,done){
    function fallback(){
      try{
        var t=document.createElement('textarea');t.value=txt;t.setAttribute('readonly','');
        t.style.cssText='position:fixed;opacity:0;top:0;left:0';document.body.appendChild(t);t.select();
        var ok=document.execCommand('copy');document.body.removeChild(t);done(ok);
      }catch(_){done(false)}
    }
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(txt).then(function(){done(true)},fallback);
    }else fallback();
  }
  $$('[data-copy]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var txt=btn.getAttribute('data-copy'), span=$('span',btn);
      copyText(txt,function(ok){
        span.textContent=ok?'Copié':'Copie impossible';
        say(ok?'Copié : '+txt:'Copie impossible ici : sélectionnez le texte à la main.');
        setTimeout(function(){span.textContent=btn.getAttribute('data-label')},1800);
      });
    });
  });

  /* Galerie filtrable */
  var fbtns=$$('[data-filter]'), items=$$('[data-cat]'), gcount=$('#gcount');
  function applyFilter(f){
    var n=0;
    items.forEach(function(i){
      var show=f==='all'||i.getAttribute('data-cat').split(' ').indexOf(f)>-1;
      i.hidden=!show; if(show)n++;
    });
    fbtns.forEach(function(b){b.setAttribute('aria-pressed',String(b.getAttribute('data-filter')===f))});
    if(gcount)gcount.textContent=n+(n>1?' images affichées':' image affichée');
  }
  if(fbtns.length){
    fbtns.forEach(function(b){b.addEventListener('click',function(){applyFilter(b.getAttribute('data-filter'))})});
    $$('[data-filter-link]').forEach(function(a){a.addEventListener('click',function(){applyFilter(a.getAttribute('data-filter-link'))})});
    applyFilter('all');
  }

  /* Formulaire de contact */
  var form=$('#devis');
  if(form){
    var PHONE=/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.\-]*\d{2}){4}$/, MAIL=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var recap=$('#recap'), recapTxt=$('#recap-txt');
    var rules={
      nom:function(v){return v.length<2?'Indiquez votre nom (2 caractères minimum).':''},
      tel:function(v){return !v?'Indiquez un numéro de téléphone.':(PHONE.test(v)?'':'Numéro invalide. Exemple : 06 12 34 56 78.')},
      email:function(v){return v&&!MAIL.test(v)?'Adresse e-mail invalide. Exemple : nom@exemple.fr.':''},
      commune:function(v){return v.length<2?'Indiquez la commune du chantier.':''},
      projet:function(v){return v?'':'Choisissez le type de projet.'},
      message:function(v){return v.length<10?'Décrivez votre demande en quelques mots (10 caractères minimum).':''}
    };
    function check(name,focus){
      var el=form.elements[name], err=$('#err-'+name), msg=rules[name](el.value.trim());
      err.textContent=msg;
      if(msg){el.setAttribute('aria-invalid','true')}else{el.removeAttribute('aria-invalid')}
      return !msg;
    }
    Object.keys(rules).forEach(function(n){
      form.elements[n].addEventListener('blur',function(){check(n)});
      form.elements[n].addEventListener('input',function(){if(form.elements[n].getAttribute('aria-invalid'))check(n)});
    });
    function build(){
      var v=function(n){return form.elements[n].value.trim()};
      var lines=['Bonjour,','Je souhaite un devis auprès d’Abelia Paysages.','',
        'Nom : '+v('nom'),'Téléphone : '+v('tel')];
      if(v('email'))lines.push('E-mail : '+v('email'));
      lines.push('Commune du chantier : '+v('commune'));
      if(v('client'))lines.push('Je suis : '+v('client'));
      lines.push('Projet : '+form.elements.projet.options[form.elements.projet.selectedIndex].text,'','Message :',v('message'),'','Merci de me recontacter.');
      return lines.join('\n');
    }
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var first=null;
      Object.keys(rules).forEach(function(n){if(!check(n)&&!first)first=form.elements[n]});
      if(first){first.focus();recap.hidden=true;return}
      var txt=build();
      recapTxt.value=txt;
      var enc=encodeURIComponent(txt);
      $('#act-sms').href='sms:+33607560091?&body='+enc;
      $('#act-mail').href='mailto:abelia-paysage@hotmail.fr?subject='+encodeURIComponent('Demande de devis')+'&body='+enc;
      recap.hidden=false;
      recap.scrollIntoView({behavior:'smooth',block:'nearest'});
      recapTxt.focus({preventScroll:true});
    });
    var cbtn=$('#act-copy');
    cbtn.addEventListener('click',function(){
      var span=$('span',cbtn);
      copyText(recapTxt.value,function(ok){
        span.textContent=ok?'Message copié':'Copie impossible';
        say(ok?'Message copié dans le presse-papiers.':'Copie impossible ici : sélectionnez le message à la main.');
        setTimeout(function(){span.textContent='Copier le message'},2000);
      });
    });
    form.addEventListener('reset',function(){
      Object.keys(rules).forEach(function(n){$('#err-'+n).textContent='';form.elements[n].removeAttribute('aria-invalid')});
      recap.hidden=true;
    });
  }
})();
