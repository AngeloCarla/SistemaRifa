// Referendias
const bolillero = document.getElementById('bolillero');
const boton = document.getElementById('sortear');
const conteo = document.getElementById('conteo');
const listaGanadores = document.getElementById('ganadores');

let rifa = JSON.parse(localStorage.getItem('rifa')) || {};
let premios = JSON.parse(localStorage.getItem('rifaActual'))?.ganadores || 1;

let numeros = Object.keys(rifa);
let contador = {};
let ganadores = [];

let girando = false;

boton.addEventListener('click', () => {
    if (girando) return;

    if (ganadores.length >= premios) {
        alert('Ya salieron todos los ganadores');
        return;
    }
    if (numeros.length === 0) {
        bolillero.textContent = '';
        return;
    }

    girando = true;
    let vueltas = 0;

    const intervalo = setInterval(() => {
        const random = numeros[Math.floor(Math.random() * numeros.length)];
        bolillero.textContent = random;
        vueltas++;

        if (vueltas > 15) {
            clearInterval(intervalo);
            girando = false;

            contador[random] = (contador[random] || 0) + 1;

            actualizarConteo();

            if (contador[random] === 3) {
                const ganador = {
                    numero: random,
                    nombre: rifa[random]
                };
                ganadores.push(ganador);

                // quitar el número del sorteo
                numeros = numeros.filter(n => n !== random);

                mostrarGanadores();
                contador = {}; // reinicia conteo para el próximo premio
            }
        }
    }, 100);
});

function actualizarConteo() {
    conteo.innerHTML = '';
    for (let num in contador) {
        const li = document.createElement('li');
        li.textContent = `N° ${num}: ${contador[num]} veces`;
        conteo.appendChild(li);
    }
}

function mostrarGanadores() {
    listaGanadores.innerHTML = '';
    ganadores.forEach((g, i) => {
        const li = document.createElement('li');
        li.textContent = `Premio ${i + 1}: ${g.nombre} (N° ${g.numero})`;
        listaGanadores.appendChild(li);
    });

    if (ganadores.length === premios) {
        boton.disabled = true;
        localStorage.setItem('ganadores', JSON.stringify(ganadores));
        alert('Sorteo finalizado 🎉');
    }
}