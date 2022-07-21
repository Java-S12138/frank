import {MouseDragDirective} from './mouseDrag'

export default {
  install (app:any) {
    app.directive('mouse-drag', MouseDragDirective)
  }
}
