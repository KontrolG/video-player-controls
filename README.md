# Video Player
Un reproductor para archivos de video, que muestre subtitulos en pantalla y tenga atajos de teclado.
## Lista de deseos
- [x] Funcionalidades basicas
- [x] Controlar tiempo con barra de progreso
- [x] Pantalla completa
- [x] Manejar velocidad
- [x] Atajos de teclado
- [x] Controlar volumen
- [] Mostrar subtitulos en formato srt.
- [] Saltar a...
- [] Ocultar flecha del mouse.
- [] Prefixes en los metodos de pantalla completa.
- [] Botón de volumen y silencio
- [] Manejo de errores
- [] Loader
- [] Por ver...
## Lo que aprendí
- Los navegadores ofrecen distintas interfaces para manipular sus funcionalidades, una de ellas es la HTMLMediaElement, que permite controlar archivos multimedia en el documento web.
- Funcionamiento basico de KeyboardEvents y otros eventos de la interface UIEvent para crear atajos de teclado.
- Uso de la Fullscreen API para controlar el modo de pantalla completa.
- El elemento <track> sirve para mostrar subtitulos en conjunto con la API WebVTT, pero se necesita el formato WebVTT para poder usar los subtitulos.
- Hay dos tipos de secuencia de fin de linea, LF y CRLF, dependiendo de el tipo, los subtitulos deben ser parseados de forma diferente.
## Errores 
- Cuando se alterna con F11 y el boton no funciona correctamente.
- No muestra el tiempo actual cuando llega hasta la duracion maxima del video (en algunos, probablemente por el redondeo).
- Los controles no se muestran correctamente.
- la barra de progreso no permite llegar hasta el final del video.
## Por buscar
- Media buffering, seeking, and time ranges. MDN.
- base64 image encoding.