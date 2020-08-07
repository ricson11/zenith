var alerts = document.querySelector('#alerts');

var preloader = document.querySelector('.preloader');


setTimeout(function(){
    alerts.style.display='none';
}, 5000)



window.addEventListener('load', ()=>{
    preloader.classList.add('hide-preloader');
},)
