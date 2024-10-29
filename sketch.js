let osc1, osc2, osc3;
let envelope;
let whiteNotes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]; // Frecuencias de las teclas blancas (C4 a C5)
whiteNotes.push(587.33, 659.25, 698.46, 783.99, 880.00, 987.77); // D5 a B5
let blackNotes = [277.18, 311.13, 369.99, 415.30, 466.16]; // Frecuencias de las teclas negras (C#4, D#4, F#4, G#4, A#4)
blackNotes.push(554.37, 622.25, 739.99, 830.61, 932.33);
let blackKeyPositions = [0.75, 1.75, 3.75, 4.75, 5.75, 7.75, 8.75, 10.75, 11.75, 12.75];
let whiteKeyWidth, blackKeyWidth;
let currentOscillatorNote = null; // Para rastrear la nota actual

function setup() {
  createCanvas(400 * 2, 200);

  // Osciladores para crear un sonido más rico
  osc1 = new p5.Oscillator('sine');
  osc2 = new p5.Oscillator('triangle');
  osc3 = new p5.Oscillator('square');
  
    // Envolvente para suavizar el sonido
  envelope = new p5.Envelope();
  envelope.setADSR(0.1, 0.4, 0.6, 0.5);
  envelope.setRange(0.8, 0); // Amplitud inicial y final

  whiteKeyWidth = (width / whiteNotes.length);
  blackKeyWidth = whiteKeyWidth / 2; // Teclas negras son más angostas

  drawPiano();
}

function draw() {
  background(255);
  drawPiano();

  // Detectar si se presiona una tecla en el rango de las coordenadas del mouse
  if (mouseIsPressed) {
    let noteIndex = getNoteFromMouse();
    if (noteIndex !== null && noteIndex !== currentOscillatorNote) {
      playNote(noteIndex);
      currentOscillatorNote = noteIndex; // Actualiza la nota actual
    }
  }
}

function drawPiano() {
  // Dibujar teclas blancas
  for (let i = 0; i < whiteNotes.length; i++) {
    fill(255); // Color blanco
    rect(i * whiteKeyWidth, 0, whiteKeyWidth, height);
  }

  // Dibujar teclas negras en posiciones específicas
  for (let i = 0; i < blackNotes.length; i++) {
    fill(0); // Color negro
    let xOffset = blackKeyPositions[i] * whiteKeyWidth;
    rect(xOffset, 0, blackKeyWidth, height * 0.6); // Teclas negras son más cortas
  }
}

// Determina qué tecla se presionó según la posición del mouse
function getNoteFromMouse() {
  // Primero verifica si el clic está sobre una tecla negra
  for (let i = 0; i < blackKeyPositions.length; i++) {
    let xOffset = blackKeyPositions[i] * whiteKeyWidth;
    if (mouseX > xOffset && mouseX < xOffset + blackKeyWidth && mouseY < height * 0.6) {
      return blackNotes[i];
    }
  }

  // Si no es una tecla negra, verifica teclas blancas
  let noteIndex = floor(map(mouseX, 0, width, 0, whiteNotes.length));
  if (noteIndex >= 0 && noteIndex < whiteNotes.length) {
    return whiteNotes[noteIndex];
  }
  
  return null;
}

function playNote(noteFreq) {
  
  osc1.freq(noteFreq);
  osc2.freq(noteFreq * 2);
  osc3.freq(noteFreq * 0.5);
  
  osc1.amp(0.5);
  osc2.amp(0.5);
  osc3.amp(0.5);
  
  osc1.start();
  osc2.start();
  // osc3.start();
  
  envelope.play(osc1, 0, 0.1); // Aplicar envolvente
  envelope.play(osc2, 0, 0.2); // Aplicar envolvente
  // envelope.play(osc3, 0, 0.1); // Aplicar envolvente
}

function mouseReleased() {
  osc1.stop(); // Detener el oscilador al soltar el mouse
  osc2.stop();
  osc3.stop();
  currentOscillatorNote = null; // Reiniciar la nota actual
}

