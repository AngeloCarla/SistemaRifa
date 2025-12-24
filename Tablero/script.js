// Referencias
const tablero = document.getElementById('tablero');
const lista = document.getElementById('listaCompradores');
const form = document.getElementById('formRifa');
const config = document.getElementById('configuracion');
const seccionTablero = document.getElementById('seccionTablero');
const tituloRifa = document.getElementById('tituloRifa');
const botonNueva = document.getElementById('nuevaRifa');

const modal = new bootstrap.Modal(document.getElementById('modalComprador'));
const inputNumero = document.getElementById('numeroSeleccionado');
const inputNombre = document.getElementById('inputNombre');
const inputApodo = document.getElementById('inputApodo');
const inputMonto = document.getElementById('inputMonto');
const inputPromo = document.getElementById('inputPromo');


// Datos
let rifa = JSON.parse(localStorage.getItem('rifa')) || {};
let rifaActual = JSON.parse(localStorage.getItem('rifaActual'));

// Si hay rifa, carga la actual
if (rifaActual) {
  iniciarRifa(rifaActual);
}

// Crear rifa 
form.addEventListener('submit', (e) => {
  e.preventDefault();

  rifaActual = {
    nombre: document.getElementById('nombreRifa').value,
    total: parseInt(document.getElementById('totalNumeros').value),
    ganadores: parseInt(document.getElementById('cantidadGanadores').value)
  };

  localStorage.setItem('rifaActual', JSON.stringify(rifaActual));
  localStorage.removeItem('rifa');
  rifa = {};

  iniciarRifa(rifaActual);

  guardarPremios();
});

// Iniciar Rifa
function iniciarRifa(rifaActual) {
  config.classList.add('oculto');
  seccionTablero.classList.remove('oculto');

  tituloRifa.textContent = rifaActual.nombre;

  crearTablero(rifaActual.total);
  actualizarLista();
}

// Crear Tablero
function crearTablero(total) {
  tablero.innerHTML = '';

  // crear números en el tablero
  for (let i = 1; i <= total; i++) {
    const div = document.createElement('div');
    div.classList.add('numero');
    if (!rifa[i]) {
      div.textContent = i;
    }

    // si ya estaba vendido
    if (rifa[i]) {
      div.classList.add('vendido');
      div.title = `${rifa[i].nombre} (${rifa[i].apodo})`;
    }

    div.addEventListener('click', () => {
      if (rifa[i]) return;

      inputNumero.value = i;
      inputNombre.value = '';
      inputApodo.value = '';
      inputMonto.value = '';
      inputPromo.checked = false;

      modal.show();

      crearTablero(total);
      actualizarLista();
    });

    tablero.appendChild(div);
  }
}

// función para actualizar lista de compradores
function actualizarLista() {
  lista.innerHTML = '';

  const compradores = {};

  for (let numero in rifa) {
    const c = rifa[numero];
    const key = c.nombre + c.apodo;

    if (!compradores[key]) {
      compradores[key] = {
        ...c,
        numeros: []
      };
    }
    compradores[key].numeros.push(numero);
  }

  Object.values(compradores).forEach(c => {
    const li = document.createElement('li');
    li.className = 'list-group-item';

    li.innerHTML = `
      <strong>${c.nombre} ${c.apodo ? '(' + c.apodo + ')' : ''}</strong><br>
      ${c.numeros.map(n => `<span class="badge bg-success me-1">#${n}</span>`).join('')}
    `;

    li.onclick = () => mostrarDetalle(c);

    lista.appendChild(li);
  });
}


botonNueva.addEventListener('click', () => {
  if (!rifaActual) return;

  if (confirm('¿Guardar esta rifa y crear una nueva?')) {

    let historial = JSON.parse(localStorage.getItem('historialRifas')) || [];

    const rifaGuardada = {
      nombre: rifaActual.nombre,
      fecha: new Date().toLocaleDateString(),
      compradores: rifa,
      total: rifaActual.total,
      ganadores: JSON.parse(localStorage.getItem('ganadores')) || []
    };

    historial.push(rifaGuardada);
    localStorage.setItem('historialRifas', JSON.stringify(historial));

    localStorage.removeItem('rifa');
    localStorage.removeItem('rifaActual');
    localStorage.removeItem('ganadores');

    location.reload();
  }
});

document.getElementById('guardarComprador').addEventListener('click', () => {
  const numero = inputNumero.value;
  const nombre = inputNombre.value.trim();

  if (!nombre) return alert('Poné un nombre 😠');

  rifa[numero] = {
    nombre,
    apodo: inputApodo.value.trim(),
    monto: parseInt(inputMonto.value) || 0,
    promo: inputPromo.checked
  };

  localStorage.setItem('rifa', JSON.stringify(rifa));

  modal.hide();
  crearTablero(rifaActual.total);
  actualizarLista();
});

function mostrarDetalle(c) {
  document.getElementById('detalleComprador').classList.remove('d-none');
  document.getElementById('detalleNombre').textContent =
    `${c.nombre} ${c.apodo ? '(' + c.apodo + ')' : ''}`;

  document.getElementById('detalleNumeros').textContent =
    `Números: ${c.numeros.join(', ')}`;

  const total = c.numeros.length * c.monto;

  document.getElementById('detalleMonto').textContent =
    `Monto total: $${total}`;

  document.getElementById('detallePromo').textContent =
    `Promo: ${c.promo ? 'Sí' : 'No'}`;
}

document.getElementById('agregarPremio').addEventListener('click', () => {
  const contenedor = document.getElementById('premiosContainer');

  const div = document.createElement('div');
  div.className = 'premio-item';

  div.innerHTML = `
    <input type="text" class="form-control mb-1 premio-nombre" placeholder="Nombre del premio">
    <input type="file" class="form-control premio-imagen" accept="image/*">
  `;

  contenedor.appendChild(div);
});

const pasos = document.querySelectorAll('.paso');

function mostrarPaso(num) {
  pasos.forEach(p => {
    p.classList.remove('activo');
    p.classList.add('oculto');
  });

  const pasoActual = document.querySelector(`.paso[data-paso="${num}"]`);
  pasoActual.classList.add('activo');
  pasoActual.classList.remove('oculto');
}

document.getElementById('btnPaso2').onclick = () => {
  mostrarPaso(2);
};

document.getElementById('btnVolver1').onclick = () => {
  mostrarPaso(1);
};

document.getElementById('btnPaso3').onclick = () => {
  // completar resumen
  document.getElementById('resumenNombre').textContent =
    document.getElementById('nombreRifa').value;

  document.getElementById('resumenTotal').textContent =
    document.getElementById('totalNumeros').value;

  document.getElementById('resumenGanadores').textContent =
    document.getElementById('cantidadGanadores').value;

  mostrarPaso(3);
};

document.getElementById('btnVolver2').onclick = () => {
  mostrarPaso(2);
};

function guardarPremios() {
  const premios = [];
  const items = document.querySelectorAll('.premio-item');
  let procesados = 0;

  items.forEach(item => {
    const nombre = item.querySelector('.premio-nombre').value;
    const imagenInput = item.querySelector('.premio-imagen');

    if (!nombre || imagenInput.files.length === 0) {
      procesados++;
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      premios.push({
        nombre,
        imagen: reader.result
      });

      procesados++;

      if (procesados === items.length) {
        localStorage.setItem('premios', JSON.stringify(premios));
        console.log('Premios guardados:', premios);
      }
    };

    reader.readAsDataURL(imagenInput.files[0]);
  });
}

// mostrar compradores al cargar
actualizarLista();
