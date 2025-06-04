# 🎮 FROM ZERO
## FSM Project: Claw Machine Simulator

This project simulates the behavior of a **claw machine** (also known as a "UFO catcher"), designed as a **Finite State Machine (FSM)** and implemented in **JavaScript**, following the **Object-Oriented Programming (OOP)** paradigm and an **Model-View-Controller (MVC)** architecture.

👉 [Try it live](https://joshmessi10.github.io/FromZero/)

![Image](https://github.com/user-attachments/assets/d2ee005f-f1c4-4c64-8ffb-985785ed50b8)

---

## 🧩 Project Structure

The code is organized into three main packages:

### 1. 📦 Model (`modelo`)
Contains the internal logic and system data:

- `Area`: Represents one of the 5 machine zones (4 playable zones, 1 drop-off zone). Each can hold a toy or be empty.
- `Maquina`: Manages attempts, general state, toy capturing, and automatic area reloads.

### 2. 🖼️ View (`vista`)
Handles the visual interface:

- `Vista`: Renders the machine's current state and areas in the browser. Updates the UI, manages button interactions, draws the claw, and displays state transitions.

### 3. 🧠 Controller (`controlador`)
Orchestrates the interaction between logic and interface:

- `Controlador`: Captures user events (keyboard, buttons), coordinates state changes, and manages claw animation.

---

## 🎮 Behavior & Game Rules

### ▶️ Initial Flow
1. On startup, the machine performs an **initial system check**.
2. If toys are available, the machine enters **ready-to-play** mode.
3. If no toys are left, it enters **auto-reload mode**.

### 💰 Coin Insertion
- Inserting a coin grants **3 attempts**.
- Players can move the claw using the keys `W`, `A`, `S`, `D`.

### 🕹️ Game Mode
- Pressing `space` triggers an attempt to grab a toy directly below the claw.
- If successful, the player must carry the toy to the drop-off area and press `space` again to release it.
- Then, click the "Pick Up Toy" button to complete the round.

### 🔄 Reload Mode
- Once all toys have been collected, the machine automatically reloads itself and resets the game.

---

## 👨‍💻 Credits

Developed by **Josh Sebastián López Murcia**
