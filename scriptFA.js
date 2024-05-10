"use strict"

//elementos
let botonRojo = document.querySelector("div.red");
let botonAzul = document.querySelector("div.blue");
let botonAmarillo = document.querySelector("div.yellow");
let botonVerde = document.querySelector("div.green");
let botonInicioN = document.querySelector("button#inicioN");
let botonTutorial = document.querySelector("button#howtoplay");
let puntuacion = document.querySelector("p.puntos");
let ronda = document.getElementById("round");
let rank = document.querySelector(".ranking");
let audio_rojo = document.getElementById("sound_rojo");
let audio_verde = document.getElementById("sound_verde");
let audio_amarillo = document.getElementById("sound_amarillo");
let audio_azul = document.getElementById("sound_azul");
let audio2 = document.getElementById("sound2");

let icono1 = document.getElementById("uno");
let icono2 = document.getElementById("dos");
let audio_quack = document.getElementById("sound_quack");
let audio_hurt = document.getElementById("sound_hurt");

//variables
let random = 0;
let contador = 0;
let contadorRonda = 1;
let colores = ["rojo", "azul", "amarillo", "verde", "diablo", "fantasma"];
let secuenciaJugador = [];
let secuenciaSimon = [];

//variables de control
let juegoIniciado = false;
let turnoJugador = false;

//funciones
function pulsaBoton(color) {
    switch (color) {
        case "rojo":
            botonRojo.style.transform = "scale(1.1)";
            audio_rojo.play();
            setTimeout(() => {
                botonRojo.style.transform = "scale(1)";
            }, 200);
            break;
        case "azul":
            botonAzul.style.transform = "scale(1.1)";
            audio_azul.play();
            setTimeout(() => {
                botonAzul.style.transform = "scale(1)";
            }, 200);
            break;
        case "amarillo":
            botonAmarillo.style.transform = "scale(1.1)";
            audio_amarillo.play();
            setTimeout(() => {
                botonAmarillo.style.transform = "scale(1)";
            }, 200);
            break;
        case "verde":
            botonVerde.style.transform = "scale(1.1)";
            audio_verde.play();
            setTimeout(() => {
                botonVerde.style.transform = "scale(1)";
            }, 200);
            break;
        case "diablo":
            icono1.style.transform = "scale(1.7)";
            audio_hurt.play();
            setTimeout(() => {
                icono1.style.transform = "scale(1)";
            }, 200);
            break;
        case "fantasma":
            icono2.style.transform = "scale(1.7)";
            audio_quack.play();
            setTimeout(() => {
                icono2.style.transform = "scale(1)";
            }, 200);
            break;
    }
}

function accionSimon() {
    if (juegoIniciado) {
        random = Math.floor(Math.random() * 6);
        secuenciaSimon.push(colores[random]); //añade un nuevo color a la secuencia
        for (let i = 0; i < secuenciaSimon.length; i++) {
            setTimeout(() => pulsaBoton(secuenciaSimon[i]),
                i * 700); // por cada color en la secuencia, añade segundos equivalentes para que se vea su pulsación y no se superpongan (de lo contrario, visualmente los pulsaria a la vez, aunque haya un orden)
        }
    }
    setTimeout(() => {
        turnoJugador = true;
    }, secuenciaSimon.length * 600); //esto hace que el turno del jugador se active al acabar la secuencia de simon.

}

function compararSecuencias(secuenciaSimon, secuenciaJugador) {
    if (secuenciaSimon.length !== secuenciaJugador.length) {
        return false;
    }

    for (let i = 0; i < secuenciaSimon.length; i++) {
        if (secuenciaSimon[i] !== secuenciaJugador[i]) {
            return false;
        }
    }
    return true;
}

function pulsarColor(color) {
    if (turnoJugador) {
        secuenciaJugador.push(color);
        pulsaBoton(color);


        if (secuenciaJugador.length === secuenciaSimon.length) {  //la primera vez siempre será la misma longitud, nunca saltará a la comprobación. 
            turnoJugador = false; //esto evita que en la primera ronda, el jugador pueda pulsar varias veces el mismo botón, y mantiene la funcionalidad como al estar al incio de accionSimon
            if (compararSecuencias(secuenciaJugador, secuenciaSimon)) { //si compararSecuencias retorna true continua el juego.
                contadorRonda++;
                ronda.innerText = `Ronda ${contadorRonda}`;
                if (contadorRonda > 10) {
                    contador = contador * 2;
                } else {
                    contador += secuenciaSimon.length;
                }
                puntuacion.innerText = contador;
                secuenciaJugador = [];
                setTimeout(accionSimon, 1000); // Espera 1 segundo antes de que Simon comience su turno
            } else {
                finJuego();
            }
        }
        else {
            compararPulsacion();
        }
    }
}

function compararPulsacion() {
    for (let i = 0; i < secuenciaJugador.length; i++) {
        if (secuenciaJugador[i] !== secuenciaSimon[i]) {
            finJuego();
        }
    }
}

function finJuego() {
    audio2.play();
    botonInicioN.innerText = "Reiniciar";
    juegoIniciado = false;
    botonInicioN.disabled = false;
    turnoJugador = false;
    icono1.classList.remove("animacionUno");
    icono2.classList.remove("animacionDos");
    swal("Te has equivocado", "Has perdido", "error");
    contadorRonda = 1;
    contador = 0;
    ronda.innerText = `Ronda ${contadorRonda}`;
    puntuacion.innerText = contador;
}

//eventos
botonInicioN.addEventListener("click", () => {
    secuenciaJugador = [];
    secuenciaSimon = [];
    juegoIniciado = true;
    icono1.classList.add("animacionUno");
    icono2.classList.add("animacionDos");
    accionSimon();
    botonInicioN.style.transform = "scale(0.9)";
    botonInicioN.style.boxShadow = "0 0 10px rgba(41, 41, 41, 0.3)";
    setTimeout(() => {
        botonInicioN.style.transform = "scale(1)";
        botonInicioN.style.boxShadow = "";
    }, 400);
    botonInicioN.disabled = true;
});

botonRojo.addEventListener("click", () => {
    if (turnoJugador) {
        audio_rojo.play();
        pulsarColor("rojo");
    }
});

botonAzul.addEventListener("click", () => {
    if (turnoJugador) {
        audio_azul.play();
        pulsarColor("azul");
    }
});

botonAmarillo.addEventListener("click", () => {
    if (turnoJugador) {
        audio_amarillo.play();
        pulsarColor("amarillo");
    }
});

botonVerde.addEventListener("click", () => {
    if (turnoJugador) {
        audio_verde.play();
        pulsarColor("verde");
    }
});

icono1.addEventListener("click", () => {
    if (turnoJugador) {
        audio_hurt.play();
        pulsarColor("diablo");
    }
});

icono2.addEventListener("click", () => {
    if (turnoJugador) {
        audio_quack.play();
        pulsarColor("fantasma");
    }
});

botonTutorial.addEventListener("click", ()=>{
    swal({
        title: "Modo Fullmetal Atlantida",
        text: "Como el Simon Dice tradicional, ¡pero añadiendo dos botones móviles extra!"
    })
});

//JSON
let rankingHTML = "<h1>Ranking</h1>";
for (let jugador of ranking["lista"]) {
    rankingHTML += `${jugador["posicion"]} ${jugador["iniciales"]}<br>
    ${jugador["puntuacion"]}<br><br>`
}

rank.innerHTML = rankingHTML;