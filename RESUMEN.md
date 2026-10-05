# resumen_dashboard_caps3y4.md

# 🖥️ DASHBOARD DE ESTUDIO: REDES NEURONALES
> **Ruta de aprendizaje:** Inteligencia Artificial > Modelos de Clasificación > Caps. 3 y 4
> **Modo de compilación:** Exhaustivo (0% omisión de datos)

---
### 📑 MENÚ DE NAVEGACIÓN
*   🟦 **MÓDULO 1:** Redes de una capa (Discriminantes y Separabilidad)
*   🟨 **MÓDULO 2:** Optimización (Mínimos Cuadrados y Fisher)
*   🟥 **MÓDULO 3:** El Perceptrón Clásico (Auge y límites)
*   🟩 **MÓDULO 4:** Perceptrón Multicapa (MLP y Topologías)
*   🗂️ **HERRAMIENTAS:** Flashcards y Consola de Errores Frecuentes

---

## 🟦 MÓDULO 1: Redes de una capa (Bases)
*Unidad dedicada a los modelos con una única capa de pesos adaptativos entre entradas y salidas[cite: 95].*

### 📦 Panel A: Discriminantes Lineales
Una función discriminante asigna un vector a una clase sin estimar primero las densidades de probabilidad[cite: 95].

| Tipo de Problema | Fórmula / Modelo Matemático | Interpretación Geométrica / Lógica |
| :--- | :--- | :--- |
| **Dos Clases** | $y(x) = w^T x + w_0$ | Frontera de decisión $y(x)=0$ es un hiperplano de $(d-1)$ dimensiones[cite: 96]. **$w$** define la orientación; **$w_0$** (sesgo) define la distancia perpendicular al origen: $l = -w_0 / \Vert{}w\Vert{}$[cite: 96]. |
| **Multiclase ($c$ clases)** | $y_k(x) = w_k^T x + w_{k0}$[cite: 98] | Se asigna $x$ a la clase $k$ si $y_k(x) > y_j(x)$[cite: 98]. Las regiones resultantes son **siempre simplemente conectadas y convexas**[cite: 98]. |
| **Discriminación Logística** | $y = g(w^T x + w_0)$[cite: 100] | $g(\cdot)$ es la activación sigmoide: $g(a) = \frac{1}{1 + \exp(-a)}$[cite: 100]. **Dato clave:** Permite que la salida de la red se interprete como una *probabilidad posterior* $P(\mathcal{C}_1 \Vert{} x)$[cite: 100, 101]. |
| **Entradas Binarias** | $p(x\Vert{}\mathcal{C}_k) = \prod \mu_{ki}^{x_i} (1 - \mu_{ki})^{1 - x_i}$[cite: 102] | Distribución de Bernoulli[cite: 102]. La probabilidad posterior también toma la forma de una sigmoide logística[cite: 103]. |

> 💡 **Nota de Arquitectura:** Para simplificar, se añade una entrada ficticia $x_0 = 1$[cite: 97]. El vector de pesos absorbe el sesgo $\tilde{w} = (w_0, w)$, quedando la ecuación como $y(x) = \tilde{w}^T \tilde{x}$[cite: 96].

### 📦 Panel B: Separabilidad Lineal y Extensiones
*   **Definición:** Datos linealmente separables son aquellos donde un hiperplano puede clasificar el 100% de los puntos de entrenamiento sin error.
*   **El Problema XOR:** Cuatro puntos en 2D que no pueden ser separados por una línea recta[cite: 104]. Es la prueba de fuego que un discriminante lineal simple no puede pasar.
*   **Teorema de Cover:** Mide la probabilidad de separabilidad lineal de $N$ puntos aleatorios en $d$ dimensiones[cite: 104].
    *   *Fórmula:* $F(N, d) = \frac{2}{2^N} \sum_{i=0}^{d} \binom{N-1}{i}$ (para $N > d+1$)[cite: 105].
    *   *Límite exacto:* Si $N = 2(d+1)$, la probabilidad es exactamente 0.5[cite: 105].
*   **Discriminantes Lineales Generalizados:** En lugar de usar $x$ directamente, se transforma el espacio con $M$ funciones base **fijas** $\phi_j(x)$[cite: 106].
    *   *Ecuación:* $y(x) = \sum_{j=1}^{M} w_j \phi_j(x) + w_0$[cite: 106].
    *   *Ventaja:* La frontera es no lineal en el espacio original $x$, pero sigue siendo estrictamente lineal en el espacio transformado $\phi$[cite: 107].

---

## 🟨 MÓDULO 2: Optimización de Pesos

### 🛠️ Herramienta 1: Mínimos Cuadrados (Least-Squares)
Minimiza el error cuadrático entre la salida $y_k$ y el objetivo (target) $t_k^n$[cite: 107].
*   **Función de Error:** $E(w) = \frac{1}{2} \sum_{n=1}^{N} \sum_{k=1}^{c} (y_k(x^n) - t_k^n)^2$[cite: 107].
*   **Interpretación:** La solución es la proyección ortogonal del vector de objetivos $T$ sobre el subespacio formado por las funciones base $\Phi$[cite: 108, 109].
*   **Solución Analítica (Pseudo-inversa):** $W^T = \Phi^{\dagger} T$, donde $\Phi^{\dagger} \equiv (\Phi^T \Phi)^{-1} \Phi^T$[cite: 110].
    > ⚠️ **Manejo de Excepciones:** Si $\Phi^T \Phi$ es singular o hay menos patrones que funciones base ($N < M$), se debe usar **SVD (Descomposición en Valores Singulares)** para evitar pesos gigantes que causen cancelación numérica[cite: 111, 112].
*   **Descenso de Gradiente:** Para redes lineales, la actualización iterativa es la **Regla Delta (Widrow-Hoff)**: $\Delta w_{kj} = \eta (t_k^n - y_k^n) \phi_j^n$[cite: 115]. Si hay activación no lineal $g(a)$, se multiplica por la derivada $g'(a_k)$ usando la regla de la cadena[cite: 115, 116].

### 🛠️ Herramienta 2: Discriminante Lineal de Fisher
Técnica de reducción de dimensionalidad proyectando datos para maximizar la separación[cite: 124, 125].
*   **Objetivo:** Maximizar varianza entre clases ($S_B$) y minimizar la varianza intra-clase ($S_W$)[cite: 126].
*   **Criterio:** $J(w) = \frac{w^T S_B w}{w^T S_W w}$  $\rightarrow$ Vector óptimo: $w \propto S_W^{-1} (m_2 - m_1)$[cite: 126].
*   **Límite Multiclase:** Para $c$ clases, la matriz $S_B$ tiene rango máximo $(c-1)$. Por ende, Fisher no puede extraer más de $(c-1)$ características[cite: 130].
*   **Sincronización:** Si en Mínimos Cuadrados usamos valores objetivo específicos ($N/N_1$ para $\mathcal{C}_1$ y $-N/N_2$ para $\mathcal{C}_2$), la dirección de los pesos será matemáticamente equivalente a la del discriminante de Fisher[cite: 127, 128].

---

## 🟥 MÓDULO 3: El Perceptrón Clásico
*El modelo histórico de Rosenblatt (1962). Funciones base fijas + activación Heaviside (umbral)[cite: 116, 117].*

### 📜 Algoritmo de Aprendizaje (Criterio del Perceptrón)
No se usa mínimos cuadrados, sino una función de error que suma la distancia de los patrones *mal clasificados* ($\mathcal{M}$)[cite: 117]: $E^{perc}(w) = -\sum_{\phi^n \in \mathcal{M}} w^T (\phi^n t^n)$[cite: 117].

```text
ENTRENAMIENTO ESTOCÁSTICO:
1. Presentar vector x_n.
2. Si se clasifica CORRECTAMENTE -> w no cambia.
3. Si pertenece a C1 pero es mal clasificado -> Sumar patrón a los pesos[cite: 118]:
   w(nuevo) = w(viejo) + η * φ_n[cite: 118]
4. Si pertenece a C2 pero es mal clasificado -> Restar patrón a los pesos[cite: 118]:
   w(nuevo) = w(viejo) - η * φ_n[cite: 118]
