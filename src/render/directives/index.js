import MouseDrag from './mouseDrag'

export default {
    install (app) {
        app.directive('mouse-drag', MouseDrag)
    }
}
