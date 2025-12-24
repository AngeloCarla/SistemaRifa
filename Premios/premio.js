const premios = JSON.parse(localStorage.getItem('premios')) || [];
const contenedor = document.getElementById('carouselContenido');

premios.forEach((premio, index) => {
  const div = document.createElement('div');
  div.className = `carousel-item ${index === 0 ? 'active' : ''}`;

  div.innerHTML = `
    <div class="d-flex flex-column align-items-center">
      <img src="${premio.imagen}" class="d-block w-50 rounded shadow">
      <h5 class="mt-3">${premio.nombre}</h5>
    </div>
  `;

  contenedor.appendChild(div);
});
