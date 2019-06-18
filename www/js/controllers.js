angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})
.controller('loginCtrl', function($scope) {})
.controller('Vid-aguaCtrl', function($scope) {})
.controller('TablaCtrl', function($scope) {})
.controller('InfografiaCtrl', function($scope) {})
.controller('VideoCtrl', function($scope) {})
  //LOGICA PRINCIPAL DEL JUEGO
  /*En caso de añadir una imagen al juego solo es necesario añadir un td en HTML nuevo y la imagen en arrayImagenes*/
.controller('JuegoCtrl', function($scope) {
 $scope.$on("$ionicView.loaded",function(){

 var contadorPruebas=0;
  var anterior=null;
  var imagenElegida;
  var contadorFallos = 0;
  var contadorAciertos = 0;

  var arrayImagenes = ["img/fresa.jpg", "img/fresa-0.jpg", "img/manzana.jpg","img/manzana-1.jpg",
                       "img/naranja.jpg", "img/naranja-2.jpg","img/banana.jpg","img/banana-3.jpg",
                        "img/mango.jpg", "img/mango-4.jpg",  "img/sandia.jpg", "img/sandia-5.jpg",
                        "img/pera.jpg",  "img/pera-6.jpg" , "img/uva.jpg", "img/uva-7.jpg",    
                        "img/pina.gif",  "img/pina-8.gif" , "img/cereza.jpg", "img/cereza-9.jpg" ];
                      
                                                                                                     
  // Los valores de este arrglo corresponden a las imagenes que hacen pareja en el arreglo anterior, 
  // asignandoles el mismo valor a las casillas correspondientes a la pareja de imagenes, con un valor unico para cada pareja
  var arrayParejas = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10];

  var cantidadImagenes = arrayImagenes.length;
  var arrayPosiciones = new Array(cantidadImagenes);
  var arrayPosicionesParejas = new Array(cantidadImagenes);

  $(document).ready(function(){
      //Crea las posiciones de la array
      var contadorPosiciones = 0;
      
      //VARIABLES CRONOMETRO DE TIEMPO
      var inicioConteo;
      var idTimeout;
      var cronometro = document.querySelector('#tiempo_juego');
      //botonReiniciar = document.querySelector('#botonReiniciar');
      var cronometro_active = 0;
      var fin_juego = 0;
      
      while(contadorPosiciones < cantidadImagenes){
          var imagenPonemos = Math.floor((Math.random()*cantidadImagenes));
          var contadorPosicionesRepetidas =0;

          //Verifica que la imagen no se haya asignado anteriormente
          for (var x=0; x<contadorPosiciones; x++){
              if (arrayPosiciones[x]==imagenPonemos) contadorPosicionesRepetidas++;
          }

          //Asigna la imagen a la casilla y el valor al arreglo de posiciones de parejas para poder encontrar la solución mas adelante
          if (contadorPosicionesRepetidas != 1){
              arrayPosiciones[contadorPosiciones] = imagenPonemos;
              arrayPosicionesParejas[contadorPosiciones] = arrayParejas[imagenPonemos];
              contadorPosiciones++;
          }
      }

      //Recogemos cuando clique en un td

      $(".casilla").click(function(){
          
          //Inicia el cronometro al dar click por primera vez en una casilla
          if(cronometro_active == 0){
              cronometro_active++;
              iniciar();
          }
          
          contadorPruebas++;
          //Recogemos la casilla
          var casilla = $(this).attr("id");

          if (contadorPruebas>1){
              imagenElegida = arrayPosiciones[casilla];

              //Hace la animación entre el fondo plano y la imagen de la segunda casilla seleccionada
              $("#"+casilla).animate({opacity: "toggle"}, 100);
              $("#"+casilla).animate({opacity: "toggle"}, 100);
              window.setTimeout(function(){
                  $("#"+casilla).css("background-image", "url("+arrayImagenes[imagenElegida]+")").css("background-color", "transparent");
              },100);

              console.log(arrayPosicionesParejas[anterior] + ":" + arrayPosicionesParejas[casilla]);

              //Comapara con el arreglo de posiciones de parejas si la imagen del deportista conside con el nombre de la jugada, 
              //si es asi la da por acertada y bloquea las acciones sobre las casillas correspondientes
              if (arrayPosicionesParejas[casilla]!=arrayPosicionesParejas[anterior]){
                  contadorFallos++;
                  $("#fallosN").html(contadorFallos);

                  //No permite clicks en las casillas mientras corre la animación
                  $(".casilla").css("pointer-events","none");

                  //Cuando las casillas no coinciden corre la animacion de la imagen de regreso al color plano
                  window.setTimeout(function(){
                      $("#"+casilla).animate({opacity: "toggle"}, 200);
                      $("#"+casilla).animate({opacity: "toggle"}, 200);
                      $("#"+anterior).animate({opacity: "toggle"}, 200);
                      $("#"+anterior).animate({opacity: "toggle"}, 200);
                      window.setTimeout(function(){
                          $("#"+casilla).css("background", "");
                          $("#"+anterior).css("background", "");

                          //Reactiva el click en las casillas cuando la animación termina
                          $(".casilla").css("pointer-events","auto");
                      },200);
                  },500);
              }else{ 
                  contadorAciertos++;
                  $("#aciertos").html(contadorAciertos);

                  //No permite que se vuelva a activar el click en las casillas que ya han sido acertadas y emparejadas
                  $("#"+casilla).addClass("acertado");
                  $("#"+anterior).addClass("acertado");
              }
              contadorPruebas = 0;
          }else{
              anterior = casilla;
              imagenElegida = arrayPosiciones[casilla];

              //Hace la animación entre el fondo plano y la imagen de la primera casilla seleccionada
              $("#"+casilla).animate({opacity: "toggle"}, 100);
              $("#"+casilla).animate({opacity: "toggle"}, 100);
              window.setTimeout(function(){
                  $("#"+casilla).css("background-image", "url("+arrayImagenes[imagenElegida]+")").css("background-color", "transparent");
              },100);
              contadorPruebas++;

              //Al ser esta la primera de las dos casillas donde se intenta emparejar, no permite que se de click hasta que se seleccione otra casilla más
              $(this).css("pointer-events","none");
          }
          
          if(contadorAciertos == 10){
              console.log("fin");
              fin_juego++;
              $(".tiempo_final").html(cronometro);
              $("#panel_resultados").fadeIn();
              $("html, body").stop().animate({
                  scrollTop: $("#juego_de_parejas").offset().top
              }, 500, 'swing');
          }
      });

      //CRONOMETRO DE TIEMPO
      function zeroIzq(n){
          return n.toString().replace(/^(\d)$/,'0$1');
      }
      function formatoSegundos(s){
  //        return zeroIzq(Math.floor(s / 3600))+':'+zeroIzq(Math.floor(s%3600 / 60))+':'+zeroIzq(Math.floor((s%3600)%60));
          return zeroIzq(Math.floor(s%3600 / 60))+':'+zeroIzq(Math.floor((s%3600)%60));
      }
      function actualizar(){
          if(fin_juego == 0){
              var dif = Date.now() - inicioConteo;
              dif = Math.round(dif / 1000);
              cronometro.innerHTML = formatoSegundos(dif);
              idTimeout = setTimeout(actualizar,1000);
          }
      }
      function iniciar(){
          clearTimeout(idTimeout);
          inicioConteo = Date.now();
          actualizar();
      }
      
      
      //PANEL DE RESULTADOS
      $("#btn_reiniciar").click(function(){
          location.reload(true);
      });
      
      $("#btn_inf_jugada_01").click(function(){
          $("#resultados").hide();
          $("#infografia_jugada").show();
          $(".inf_jugada").hide();
          $("#inf_jugada_01").show();
      });
      
      $("#btn_inf_jugada_02").click(function(){
          $("#resultados").hide();
          $("#infografia_jugada").show();
          $(".inf_jugada").hide();
          $("#inf_jugada_02").show();
      });
      
      $("#btn_inf_jugada_03").click(function(){
          $("#resultados").hide();
          $("#infografia_jugada").show();
          $(".inf_jugada").hide();
          $("#inf_jugada_03").show();
      });
      
      $("#btn_inf_jugada_04").click(function(){
          $("#resultados").hide();
          $("#infografia_jugada").show();
          $(".inf_jugada").hide();
          $("#inf_jugada_04").show();
      });
      
      $("#btn_inf_jugada_05").click(function(){
          $("#resultados").hide();
          $("#infografia_jugada").show();
          $(".inf_jugada").hide();
          $("#inf_jugada_05").show();
      });
      
      $("#btn_inf_jugada_06").click(function(){
          $("#resultados").hide();
          $("#infografia_jugada").show();
          $(".inf_jugada").hide();
          $("#inf_jugada_06").show();
      });
      
      $("#btn_inf_jugada_07").click(function(){
          $("#resultados").hide();
          $("#infografia_jugada").show();
          $(".inf_jugada").hide();
          $("#inf_jugada_07").show();
      });
      
      $("#btn_inf_jugada_08").click(function(){
          $("#resultados").hide();
          $("#infografia_jugada").show();
          $(".inf_jugada").hide();
          $("#inf_jugada_08").show();
      });
      
      $("#btn_inf_jugada_09").click(function(){
          $("#resultados").hide();
          $("#infografia_jugada").show();
          $(".inf_jugada").hide();
          $("#inf_jugada_09").show();
      });
      
      $("#btn_inf_jugada_10").click(function(){
          $("#resultados").hide();
          $("#infografia_jugada").show();
          $(".inf_jugada").hide();
          $("#inf_jugada_10").show();
      });
      
      $("#btn_volver").click(function(){
          $("#infografia_jugada").hide();
          $("#resultados").show();
      });

      $("#juego_de_parejas .flecha").click(function(){
          $("#juego_de_parejas .preguntas").stop().animate({
              scrollTop: $("#juego_de_parejas .preguntas").scrollTop() + 100
          }, 500, 'swing');
      });
      
      
      //COMPARTIR RESULTADOS EN REDES
      

      window.fbAsyncInit = function() {
          FB.init({
            appId            : '1928749157200161',
            autoLogAppEvents : true,
            xfbml            : true,
            version          : 'v2.12'
          });
      };

      (function(d, s, id){
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) {return;}
          js = d.createElement(s); js.id = id;
          js.src = "https://connect.facebook.net/en_US/sdk.js";
          fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));


      $("#btn_compartir_facebook").click(function(){
          var tiempo_juego;
          tiempo_juego = document.getElementById("tiempo_final").textContent;
          FB.ui({
              method: 'share',
              href: 'http://beta.eltiempo.com/deportes/las-10-mejores-jugadas-159307',
              quote:'Estas son las 10 mejores jugadas del Fútbol, mi tiempo fue de '+tiempo_juego+' http://www.eltiempo.com/deportes/futbol-internacional/especial-las-10-mejores-jugadas-futbol-196998',
          }, function(response){});
      });
      
      $("#btn_compartir_twitter").click(function(){
          var tiempo_juego;
          tiempo_juego = document.getElementById("tiempo_final").textContent;
          var url='http://twitter.com/home?status=Mi%20tiempo%20fue%20de%20'+tiempo_juego+'%20http://www.eltiempo.com/deportes/futbol-internacional/especial-las-10-mejores-jugadas-futbol-196998'; 
          window.open(url,'ventanacompartir', 'toolbar=0, status=0, width=650, height=450');
      });
  });


 })
})

.controller('AdnCtrl', function($scope) {
  
  $scope.$on("$ionicView.loaded", function() {

    //Put your script in here!
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const { width, height } = canvas;
const xCenter = width / 2; // centre de l'écran en x
const yStart = 50; // positionde la première hélice en y
const xMax = 80; // largeur des helices
const yMax = 50; // espace entre les helices
let angle = 0;
const speed = 0.02; // vitesse de rotation
const tAnglePI = [
  0,
  Math.PI / 6,
  Math.PI / 3,
  Math.PI / 2,
  2 * Math.PI / 3,
  5 * Math.PI / 6,
  Math.PI,
  7 * Math.PI / 6,
  4 * Math.PI / 3,
  -Math.PI / 2,
  5 * Math.PI / 3,
  11 * Math.PI / 6,
];
const tPI = [...tAnglePI, ...tAnglePI];
function render() {
  ctx.clearRect(0, 0, width, height);
  const tPositions = [];
  for (let i = 0; i < tPI.length; i++) {
    const positions = adn(tPI[i], (i * yMax));
    tPositions.push(positions);
  }
  angle += speed;
  requestAnimationFrame(render);
}
/**
 *
 * @param {*} startPhase phase de début en x
 * @param {*} yPos position de l'helice en y
 */
function adn(startPhase, yPos, colorLink = '#FFFFFF') {
  const angleSin = Math.sin(angle + startPhase);
  const angleCos = Math.cos(angle + startPhase);
  const xPos1 = angleSin * xMax;
  const xPos2 = -angleSin * xMax;
  const yPos1 = angleCos * 10 + yPos;
  const yPos2 = -angleCos * 10 + yPos;
  // Création des liens entre les cercles
  ctx.beginPath();
  ctx.strokeStyle = colorLink;
  ctx.lineWidth = 3;
  ctx.moveTo(xPos1 + xCenter, yPos1 + yStart);
  ctx.lineTo(xPos2 + xCenter, yPos2 + yStart);
  ctx.stroke();
  // On fait passer le cercle le plus loin derrière
  if (angleCos < 0) {
    drawADN(xPos1, yPos1, angleCos, 11342935);
    drawADN(xPos2, yPos2, -angleCos, 1668818);
  } else {
    drawADN(xPos2, yPos2, -angleCos, 1668818);
    drawADN(xPos1, yPos1, angleCos, 11342935);
  }
  return {
    xPos1, yPos1, xPos2, yPos2,
  };
}
/**
 * @param {*} xAngle position en x du cercle
 * @param {*} yAngle position en y du cercle
 * @param {*} radius largeur du cercle
 * @param {*} color couleur du cercle
 */
function drawADN(xPos, yPos, radius, color) {
  ctx.fillStyle = `#${(color).toString(16)}`;
  ctx.beginPath();
  ctx.arc(
    xPos + xCenter,
    yPos + yStart,
    10 + (radius * 3),
    0,
    2 * Math.PI,
  );
  ctx.closePath();
  ctx.fill();
}

render();
});
})


.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
