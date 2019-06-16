// let animationWorker = null
// self.onmessage = function(e) {
//   switch (e.data.msg) {
//     case 'start':
//       if (!animationWorker) {
//         importScripts(
//           e.data.origin + '/animation.js'
//         )
//         animationWorker = new ThemedAnimation(
//           e.data.canvas.getContext('2d')
//         )
//       }
//       animationWorker.start()
//       break
//     case 'stop':
//       if (!animationWorker) {
//         return
//       }
//       animationWorker.stop()
//       break
//   }
// }