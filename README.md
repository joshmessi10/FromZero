# 🎮 FROM ZERO
## Proyecto FSM: Máquina Caza Muñecos

Este proyecto simula el funcionamiento de una máquina caza muñecos (tipo "claw machine") implementada con JavaScript, siguiendo el **paradigma de programación orientada a objetos (POO)** y una arquitectura **Modelo-Vista-Controlador (MVC)**.

Para ejecutarlo, descarga el proyecto y abre el archivo index.html.

![Image](https://github.com/user-attachments/assets/d2ee005f-f1c4-4c64-8ffb-985785ed50b8)

---

## 🧩 Estructura del Proyecto

El código está organizado en tres paquetes principales:

### 1. 📦 Modelo (`modelo`)
Contiene la lógica interna y los datos del sistema:

- `Area`: Representa una de las 5 áreas de la máquina (4 para jugar, 1 de salida). Puede contener un muñeco o estar vacía.
- `Maquina`: Gestiona la lógica de intentos, estado general de la máquina, captura de muñecos, y recarga de áreas.

### 2. 🖼️ Vista (`vista`)
Encargada de la interfaz visual:

- `Vista`: Renderiza el estado de la máquina y las áreas en el navegador. Actualiza la UI, maneja los botones, pinta la pinza y muestra los estados.

### 3. 🧠 Controlador (`controlador`)
Orquesta la interacción entre la lógica y la interfaz:

- `Controlador`: Captura eventos del usuario (teclado, botones), coordina los cambios de estado, y gestiona la animación de la pinza.

---

## 🎮 Comportamiento y Reglas

### ▶️ Flujo Inicial
1. Al iniciar, la máquina realiza una **verificación inicial**.
2. Si hay muñecos disponibles, queda lista para jugar.
3. Si no hay muñecos, entra en **modo de recarga automática**.

### 💰 Inserción de Moneda
- Al insertar una moneda, se activan **3 intentos**.
- El jugador puede mover la pinza con teclas `W`, `A`, `S`, `D`.

### 🕹️ Modo de Juego
- Al presionar `espacio`, se intenta atrapar el muñeco bajo la pinza.
- Si se captura un muñeco, el jugador debe llevarlo al área de salida y presionar `espacio` para soltarlo.
- Luego, se debe presionar el botón "Recoger Peluche" para finalizar.

### 🔄 Recarga
- Cuando ya no hay más muñecos en el tablero, la máquina entra en **modo de recarga automática**.

---

## Créditos

Desarrollado por Josh Sebastián López Murcia 
