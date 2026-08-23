const PARES = Array.from({ length: 19 }, (_, i) => (i + 1) * 2);      // [2, 4, ..., 38]
const IMPARES = Array.from({ length: 20 }, (_, i) => i * 2 + 1);      // [1, 3, ..., 39]

let cantidadApuestas = 3;

function muestrearAleatorio(arreglo, n) {
  const copia = [...arreglo];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia.slice(0, n);
}

function generarCombinaciones(cantidad = 3, sumaMin = 100, sumaMax = 140, minAltos = 2) {
  const combinaciones = [];
  let intentos = 0;
  const maxIntentos = 50000;

  while (combinaciones.length < cantidad && intentos < maxIntentos) {
    intentos++;

    // 1. Paridad estricta 3P - 3I
    const muestraPares = muestrearAleatorio(PARES, 3);
    const muestraImpares = muestrearAleatorio(IMPARES, 3);
    const jugada = [...muestraPares, ...muestraImpares].sort((a, b) => a - b);

    // 2. Control de Suma [100 - 140]
    const suma = jugada.reduce((acc, val) => acc + val, 0);
    if (suma < sumaMin || suma > sumaMax) continue;

    // 3. Anti-sesgo de cumpleaños (>= 32)
    const altos = jugada.filter(n => n >= 32).length;
    if (altos < minAltos) continue;

    // 4. Distribución por docenas
    const d1 = jugada.filter(n => n >= 1 && n <= 12).length;
    const d2 = jugada.filter(n => n >= 13 && n <= 24).length;
    const d3 = jugada.filter(n => n >= 25 && n <= 36).length;
    const d4 = jugada.filter(n => n >= 37).length;

    if (Math.max(d1, d2, d3) > 3) continue;
    if ((d1 === 0 && d2 === 0) || (d2 === 0 && d3 === 0)) continue;

    const id = jugada.join('-');
    if (!combinaciones.some(c => c.numeros.join('-') === id)) {
      combinaciones.push({
        numeros: jugada,
        suma,
        altos,
        docenas: { d1, d2, d3, d4 }
      });
    }
  }

  return combinaciones;
}

function renderizarResultados() {
  const container = document.getElementById('results');
  const countBadge = document.getElementById('generatedCountBadge');
  const betDisplay = document.getElementById('betCountDisplay');

  betDisplay.textContent = cantidadApuestas;
  countBadge.textContent = `${cantidadApuestas} ${cantidadApuestas === 1 ? 'jugada' : 'jugadas'}`;

  const jugadas = generarCombinaciones(cantidadApuestas);
  container.innerHTML = '';

  jugadas.forEach((jugada, idx) => {
    const card = document.createElement('div');
    card.className = 'ticket-entry bg-white border border-app-border rounded-2xl p-4 shadow-sm flex flex-col gap-3';

    // Encabezado del boleto
    const headerRow = document.createElement('div');
    headerRow.className = 'flex items-center justify-between pb-2 border-b border-slate-100 text-xs';
    headerRow.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-app-green"></span>
        <span class="font-bold text-slate-800">MELATE RETRO</span>
      </div>
      <span class="text-slate-500 font-medium">Boleto #${idx + 1}</span>
    `;

    // Visualización de Números
    const numbersRow = document.createElement('div');
    numbersRow.className = 'flex items-center justify-start gap-2 sm:gap-3 py-1';

    jugada.numeros.forEach(num => {
      const numStr = num < 10 ? `0${num}` : num;
      const span = document.createElement('span');
      span.className = 'text-xl sm:text-2xl font-black tracking-tight text-slate-900';
      span.textContent = numStr;
      numbersRow.appendChild(span);
    });

    const subtext = document.createElement('div');
    subtext.className = 'text-xs text-slate-500 font-medium';
    subtext.textContent = 'Boleto con 1 apuesta';

    // Métricas estadísticas
    const footer = document.createElement('div');
    footer.className = 'flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500';
    footer.innerHTML = `
      <span class="bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md">Suma: <strong class="text-slate-700 font-bold">${jugada.suma}</strong></span>
      <span class="bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md">Paridad: <strong class="text-slate-700 font-bold">3P - 3I</strong></span>
      <span class="bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md">≥32: <strong class="text-slate-700 font-bold">${jugada.altos}</strong></span>
      <span class="bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md hidden sm:inline-block">Docenas: [${jugada.docenas.d1}, ${jugada.docenas.d2}, ${jugada.docenas.d3}, ${jugada.docenas.d4}]</span>
    `;

    card.appendChild(headerRow);
    card.appendChild(numbersRow);
    card.appendChild(subtext);
    card.appendChild(footer);
    container.appendChild(card);
  });
}

// Botones de incremento / decremento
document.getElementById('btnMinus').addEventListener('click', () => {
  if (cantidadApuestas > 1) {
    cantidadApuestas--;
    renderizarResultados();
  }
});

document.getElementById('btnPlus').addEventListener('click', () => {
  if (cantidadApuestas < 10) {
    cantidadApuestas++;
    renderizarResultados();
  }
});

document.getElementById('generateBtn').addEventListener('click', renderizarResultados);
window.addEventListener('DOMContentLoaded', renderizarResultados);