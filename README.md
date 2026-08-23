# Melate Retro Optimizer

Generador probabilístico de combinaciones para **Melate Retro** con interfaz limpia inspirada en el portal oficial de pronósticos.

## Criterios del Algoritmo
* **Paridad Fija:** 3 Pares y 3 Impares (3P - 3I).
* **Suma Acotada:** Rango $[100, 140]$ centrado en la media histórica ($\mu \approx 120$).
* **Anti-Sesgo de Fechas:** Mínimo 2 números $\ge 32$.
* **Dispersión por Docenas:** Máximo 3 números por tercio.

## Despliegue en GitHub Pages
Página web: https://mretro6.arturylab.dev/

1. Sube `index.html`, `style.css` y `script.js` a la raíz de tu repositorio en GitHub.
2. En GitHub ve a **Settings** > **Pages**.
3. Selecciona la rama `main` en la raíz `/` y haz clic en **Save**.# mretro6
