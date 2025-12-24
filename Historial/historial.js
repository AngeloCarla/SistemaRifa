const lista = document.getElementById('listaHistorial');
let historial = JSON.parse(localStorage.getItem('historialRifas')) || [];

function mostrarHistorial() {
  lista.innerHTML = '';

  if (historial.length === 0) {
    lista.innerHTML = '<li>No hay rifas guardadas</li>';
    return;
  }

  historial.forEach((rifa, i) => {
    const li = document.createElement('li');

    let textoGanadores = 'Sin sorteo';
    if (rifa.ganadores && rifa.ganadores.length > 0) {
      textoGanadores = rifa.ganadores
        .map(g => `${g.nombre.nombre ?? g.nombre} (N° ${g.numero})`)
        .join('<br>');
    }

    li.innerHTML = `
      <strong>${rifa.nombre}</strong><br>
      Fecha: ${rifa.fecha}<br>
      Vendidos: ${Object.keys(rifa.compradores).length}<br>
      <strong>Ganadores:</strong><br>
      ${textoGanadores}<br><br>
      <button onclick="borrarRifa(${i})">Borrar 🗑️</button>
      <hr>
    `;

    lista.appendChild(li);
  });
}


function borrarRifa(index) {
    if (!confirm('¿Seguro que querés borrar esta rifa del historial?')) return;

    historial.splice(index, 1);
    localStorage.setItem('historialRifas', JSON.stringify(historial));
    mostrarHistorial();
}

mostrarHistorial();
