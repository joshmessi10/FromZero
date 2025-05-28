// Modelo

// Clase que representa un área de la máquina (puede tener un muñeco o estar vacía)
class Area {
  constructor(id, label) {
    this.id = id;
    this.label = label;
    this.state = 'empty'; // 'empty', 'muneco', 'pickup', 'reload'
    this.pelucheTipo = null; // Tipo de peluche presente
  }

  setState(state) {
    this.state = state;
  }
}

// Clase principal que modela la lógica de la máquina de muñecos
class Maquina {
  constructor() {
    this.pelucheAtrapado = null; // Guarda el peluche atrapado por la pinza
    this.areas = [];
    // Crear 5 áreas: 4 para muñecos y 1 para la salida
    for (let i = 1; i <= 4; i++) {
      this.areas.push(new Area(i, `Área ${i}`));
    }
    this.areas.push(new Area(5, 'Salida'));

    this.attemptsLeft = 0; // Intentos restantes
    this.maxAttempts = 3;  // Máximo de intentos por moneda

    this.coinInserted = false; // Indica si hay moneda insertada
    this.state = 'verificando'; // Estado inicial de la máquina

    // Inicializar áreas con estados aleatorios (algunos con muñeco, otros vacíos)
    this.randomizeAreas();
  }

  // Asigna aleatoriamente muñecos a las áreas de juego
  randomizeAreas() {
    for (let i = 0; i < 4; i++) {
      const rand = Math.random();
      this.areas[i].setState(rand < 0.5 ? 'muneco' : 'empty');
      this.areas[i].pelucheTipo = rand < 0.5 ? `peluche${Math.floor(Math.random() * 3) + 1}` : null;
    }
    this.areas[4].setState('empty'); // área salida siempre vacía
  }

  // Inserta una moneda y habilita los intentos
  insertCoin() {
    if (this.state === 'idle') {
      this.coinInserted = true;
      this.attemptsLeft = this.maxAttempts;
      this.state = 'waiting';
    }
  }

  // Comienza un intento de atrapar muñeco
  startAttempt() {
    if (this.state === 'waiting' && this.attemptsLeft > 0) {
      this.state = 'attempting';
    }
  }

  // Lógica para intentar atrapar un muñeco en un área específica
  attemptCatch(areaIndex) {
    if (this.state !== 'attempting') return false;

    let result = false;

    if (areaIndex == -1){
      result = false
    }
    else{
      const area = this.areas[areaIndex];
      this.pinzaPosition = areaIndex;
      
      if (area.state === 'muneco') {
        this.pelucheAtrapado = area.pelucheTipo || 'peluche1';
        area.setState('empty');
        area.pelucheTipo = null;
        result = true;
      }
    }
    this.attemptsLeft--;
    
    if (result) {
        this.state = 'won'; // Si atrapó, pasa a estado de premio
    } else if (this.attemptsLeft <= 0) {
        this.state = 'idle'; // Si se acabaron los intentos, vuelve a esperar moneda
    } else {
        this.state = 'waiting'; // Si quedan intentos, espera el siguiente
    }
    return result;
  }

  // Lógica para recoger el muñeco de la salida
  recogerMuneco() {
    const salida = this.areas[4];

    // Si el área de salida tiene un peluche listo para recoger
    if (salida.state === 'pickup') {
        salida.setState('empty');
        this.attemptsLeft = 0
        this.state = 'idle';
        this.coinInserted = false;
    }
  }

  // Llena todas las áreas de juego con muñecos aleatorios
  fillAllAreasWithMunecos() {
    const tipos = ['peluche1', 'peluche2', 'peluche3'];
    for (let i = 0; i < 4; i++) {
      this.areas[i].setState('muneco');
      const randomTipo = tipos[Math.floor(Math.random() * tipos.length)];
      this.areas[i].pelucheTipo = randomTipo;
    }
    this.areas[4].setState('empty');
    this.areas[4].pelucheTipo = null;
  }
}

// Vista

// Clase que maneja la interfaz gráfica y la interacción con el usuario
class Vista {
  constructor(maquina, controlador) {
    this.maquina = maquina;
    this.controlador = controlador;

    // Referencias a elementos del DOM
    this.areasContainer = document.getElementById('areas-container');
    this.machineStatus = document.getElementById('machine-status');
    this.areasStatusList = document.getElementById('areas-status-list');
    this.attemptsLeftSpan = document.getElementById('attempts-left');
    this.insertCoinBtn = document.getElementById('insert-coin-btn');
    this.fillAreasBtn = document.getElementById('fill-areas-btn');
    this.pickupBtn = document.getElementById('pickup-btn');
    this.pinza = document.getElementById('pinza');

    this.selectedAreaIndex = null;

    this.renderAreas();
    this.bindEvents();
    this.render();
  }

  // Dibuja las áreas de la máquina en pantalla
  renderAreas() {
    this.areasContainer.innerHTML = '';
    this.areaDivs = [];

    this.maquina.areas.forEach((area, idx) => {
      const div = document.createElement('div');
      div.classList.add('area');
      div.dataset.index = idx;
      div.style.position = 'relative'; // por si no lo tienes

      const label = document.createElement('div');
      label.classList.add('area-label');
      label.textContent = area.label;
      div.appendChild(label);

      // Si hay muñeco o está listo para recoger, muestra la imagen
      if (area.state === 'muneco' || area.state === 'pickup') {
        const img = document.createElement('img');
        img.src = `assets/${area.pelucheTipo || 'peluche1'}.png`; // fallback por si acaso
        img.alt = 'Muñeco';
        img.classList.add('imagen-muneco');
        div.appendChild(img);
      }

      div.classList.remove('state-empty');
      if (area.state === 'empty') div.classList.add('state-empty');

      if (idx === 4) {
        div.style.gridColumn = '1 / span 2';
        div.id = 'exit-area';
      }

      this.areasContainer.appendChild(div);
      this.areaDivs.push(div); // Guardar referencia
    });
  }

  // Asocia los eventos de los botones a funciones del controlador
  bindEvents() {
    this.insertCoinBtn.onclick = () => this.controlador.handleInsertCoin();
    this.fillAreasBtn.onclick = () => this.controlador.handleFillAreas();
    this.pickupBtn.onclick = () => this.controlador.handleRecogerMuneco();
  }

  // Resalta el área seleccionada (opcional)
  highlightSelectedArea() {
    [...this.areasContainer.children].forEach((div, i) => {
      if (i === this.selectedAreaIndex) div.style.borderColor = '#ff0000';
      else div.style.borderColor = '';
    });
  }

  // Muestra el estado de la máquina y de cada área en la interfaz
  renderStatus() {
    this.machineStatus.textContent = this.getEstadoTexto();
    this.attemptsLeftSpan.textContent = this.maquina.attemptsLeft;

    // Mostrar estado de áreas en la lista
    this.areasStatusList.innerHTML = '';
    this.maquina.areas.forEach((area) => {
      const li = document.createElement('li');
      let estadoTexto = '';
      switch (area.state) {
        case 'empty': estadoTexto = 'Vacío'; break;
        case 'muneco': estadoTexto = 'Muñeco presente'; break;
        case 'pickup': estadoTexto = 'Peluche listo para recogerse'; break;
        case 'reload': estadoTexto = 'Recargando área...'; break;
      }
      li.textContent = `${area.label}: ${estadoTexto}`;
      this.areasStatusList.appendChild(li);
    });
  }

  // Traduce el estado interno de la máquina a un texto amigable
  getEstadoTexto() {
    switch (this.maquina.state) {
      case 'verificando': return 'Verificación inicial...';
      case 'idle': return 'Esperando moneda...';
      case 'waiting': return 'Moneda insertada, esperando intento.';
      case 'attempting': return 'Intentando atrapar muñeco...';
      case 'won': return '¡Muñeco atrapado! Lleva tu premio a la salida.';
      case 'reloading': return 'Recargando muñecos, espera por favor...';
      default: return 'Estado desconocido';
    }
  }

  // Dibuja la pinza en la posición indicada y cambia su imagen si tiene un muñeco
  renderPinza(x = this.controlador.pinzaX, y = this.controlador.pinzaY) {
    const pinzaImg = this.pinza.querySelector('img');
    const atrapado = this.maquina.pelucheAtrapado;
    const tieneMuneco = this.maquina.state === 'won' && atrapado;
    const nuevoSrc = tieneMuneco
      ? `assets/pinza-${atrapado}.png`  // pinza-peluche1.png, etc.
      : 'assets/pinza.png';

    // Si ya existe la imagen, cambiar su src según el estado
    if (pinzaImg) {
      pinzaImg.src = nuevoSrc;
    } else {
      // Si no existe, crearla
      const img = document.createElement('img');
      img.src = this.maquina.state === 'won' ? 'assets/pinza-peluche1.png' : 'assets/pinza.png';
      img.alt = 'Pinza';
      img.style.width = '150%';
      img.style.height = '150%';
      this.pinza.appendChild(img);
    }

    const containerWidth = 600;
    const containerHeight = 600;

    // Limita la posición de la pinza dentro del área visible
    x = Math.min(Math.max(0, x), containerWidth - this.pinza.clientWidth);
    y = Math.min(Math.max(0, y), containerHeight - this.pinza.clientHeight);

    this.pinza.style.left = `${x}px`;
    this.pinza.style.top = `${y}px`;
  }

  // Redibuja toda la interfaz
  render() {
    this.renderAreas();
    this.renderStatus();
    this.renderPinza();

    // Control de botones según el estado de la máquina
    this.insertCoinBtn.disabled = this.maquina.state !== 'idle';
    this.fillAreasBtn.disabled = this.maquina.state !== 'idle';
    this.pickupBtn.disabled = (this.maquina.areas[4].state !== 'pickup');
  }
}

// Controlador

// Clase que conecta la lógica de la máquina con la vista y maneja los eventos
class Controlador {
  constructor() {
    this.maquina = new Maquina();
    this.vista = new Vista(this.maquina, this);
    document.addEventListener('keydown', (e) => this.handleKeydown(e));
    this.animando = false;

    // Posición inicial de la pinza
    this.pinzaX = 0;  // píxeles desde el borde izquierdo del contenedor
    this.pinzaY = 0;  // píxeles desde el borde superior del contenedor

    // Al iniciar, verifica si hay muñecos y ajusta el estado
    setTimeout(() => {
      const hayMunecos = this.maquina.areas.slice(0, 4).some(area => area.state === 'muneco');

      if (hayMunecos) {
        this.maquina.state = 'idle';
        this.vista.render();
      } else {
        this.handleReload(); // 🔁 iniciar recarga automática
      }
    }, 2000);

    this.initPinzaPos()
  }

  // Posiciona la pinza al inicio
  initPinzaPos() {
    this.vista.renderPinza(this.pinzaX, this.pinzaY);
  }

  // Llama a la recarga de áreas y actualiza la vista periódicamente
  handleFillAreas() {
    this.handleReload();
    this.vista.render();

    // Opcional: refrescar cada segundo para mostrar el cambio
    const interval = setInterval(() => {
      this.vista.render();
      if (this.maquina.state !== 'reloading') {
        clearInterval(interval);
      }
    }, 500);
  }

  // Maneja las teclas para mover la pinza y lanzar intentos
  handleKeydown(e) {
    const tecla = e.key.toLowerCase();
    const step = 10;  // pixeles que se mueve cada tecla

    if (tecla === ' ') {
      e.preventDefault();
      const areaIndex = this.getAreaBajoPinza();

      if (areaIndex === 4 && this.maquina.state === 'won') {
        this.handleSoltarMuneco();
        return;
      }

      if (this.maquina.state === 'waiting') {
        this.handleStartAttempt();
      }
      return;
    }

    // Movimiento de la pinza con WASD
    if (['w', 'a', 's', 'd'].includes(tecla)) {
      if (['waiting', 'attempting', 'won'].includes(this.maquina.state)) {
        const maxX = 600 - this.vista.pinza.clientWidth *2;
        const maxY = 600 - this.vista.pinza.clientHeight *2;

        switch (tecla) {
          case 'a': // izquierda
            this.pinzaX = Math.max(0, this.pinzaX - step);
            break;
          case 'd': // derecha
            this.pinzaX = Math.min(maxX, this.pinzaX + step);
            break;
          case 'w': // arriba
            this.pinzaY = Math.max(0, this.pinzaY - step);
            break;
          case 's': // abajo
            this.pinzaY = Math.min(maxY, this.pinzaY + step);
            break;
        }

        this.vista.renderPinza(this.pinzaX, this.pinzaY);
      }
    }
  }

  // Inserta moneda y actualiza la vista
  handleInsertCoin() {
    this.maquina.insertCoin();
    this.vista.selectedAreaIndex = null;
    this.vista.highlightSelectedArea();
    this.vista.render();
  }

  // Inicia un intento de atrapar muñeco
  handleStartAttempt() {
    if (this.animando) return;

    const areaI = this.getAreaBajoPinza();
    const areaIndex = (areaI !== null && areaI >= 0 && areaI <= 3) ? areaI : -1;

    this.maquina.startAttempt();
    this.vista.render();

    // Animación de la pinza bajando y subiendo
    this.animarPinza(areaIndex).then(() => {
      const exito = this.maquina.attemptCatch(areaIndex);
      this.vista.render();

      if (exito) {
        alert('¡Felicidades! Has atrapado un muñeco.');
      } else if (this.maquina.attemptsLeft <= 0) {
        alert('Se acabaron los intentos. Inserta una moneda para continuar.');
      }
    });
  }

  // Recoge el muñeco de la salida y recarga si ya no quedan más
  handleRecogerMuneco() {
    this.maquina.recogerMuneco();
    const quedanMunecos = this.maquina.areas.slice(0, 4).some(area => area.state === 'muneco');
    if (!quedanMunecos) {
      this.handleReload();
    }

    this.vista.selectedAreaIndex = null;
    this.vista.highlightSelectedArea();
    this.vista.render();
  }

  // Suelta el muñeco atrapado en el área de salida
  handleSoltarMuneco() {
    const salida = this.maquina.areas[4];

    if (salida.state === 'empty') {
      salida.setState('pickup');         // colocarlo en salida
      salida.pelucheTipo = this.maquina.pelucheAtrapado;
      this.maquina.pelucheAtrapado = null; // limpiar el muñeco atrapado
      this.vista.render();
    }
  }

  // Animación simple de la pinza moviéndose al área y bajando y subiendo
  animarPinza(areaIndex) {
    return new Promise((resolve) => {
      this.animando = true;

      // Guarda la posición Y original para regresar
      const originalY = this.pinzaY;

      this.vista.renderPinza(this.pinzaX, this.pinzaY);

      const pinza = this.vista.pinza;

      // Animar bajada (por ejemplo 25px abajo)
      pinza.style.transition = 'top 0.5s ease';
      pinza.style.top = (originalY + 25) + 'px';

      setTimeout(() => {
        // Animar subida a la posición original Y guardada
        pinza.style.top = originalY + 'px';

        setTimeout(() => {
          this.animando = false;
          resolve();
        }, 600);
      }, 700);
    });
  }

  // Determina qué área está debajo de la pinza (colisión)
  getAreaBajoPinza() {
    const pinzaRecta = this.vista.pinza.getBoundingClientRect();
    
    const margen = 80;
    const pinzaRect = {
        top: pinzaRecta.top+margen,
        left: pinzaRecta.left+margen*3/4,
        right: pinzaRecta.right-margen*1/4,
        bottom: pinzaRecta.bottom,
        width: pinzaRecta.width - margen,
        height: pinzaRecta.height - margen
    };

    
    for (let i = 0; i < this.vista.areaDivs.length; i++) {
      const areaDiv = this.vista.areaDivs[i];
      const areaRect = areaDiv.getBoundingClientRect();

      // Crear un sub-rectángulo más pequeño dentro del área
      const margen = 40; // Reduce 20px de cada lado
      const areaReducida = {
        top: areaRect.top + 1.5 * margen,
        left: areaRect.left + 2 * margen,
        bottom: areaRect.bottom - 1.5 * margen,
        right: areaRect.right - 2 * margen,
        width: areaRect.width - 4 * margen,
        height: areaRect.height - 3 * margen,
      };

      const overlap = !(
        pinzaRect.right < areaReducida.left ||
        pinzaRect.left > areaReducida.right ||
        pinzaRect.bottom < areaReducida.top ||
        pinzaRect.top > areaReducida.bottom
      );

      
      if (overlap) return i;
    }

    return null;
  }

  // Recarga las áreas vacías con muñecos nuevos
  handleReload() {
    for (let i = 0; i < 4; i++) {
      if (this.maquina.areas[i].state === 'empty') {
        this.maquina.areas[i].setState('reload');
      }
    }

    this.maquina.state = 'reloading';
    this.vista.render();

    setTimeout(() => {
      // 🧸 Llenar nuevamente con muñecos
      this.maquina.fillAllAreasWithMunecos();
      this.maquina.state = 'idle';
      this.maquina.coinInserted = false;
      this.maquina.attemptsLeft = 0;
      this.vista.render();
    }, 3000);
  }
}

// Inicialización: crea el controlador al cargar la página
window.onload = () => {
  new Controlador();
};

