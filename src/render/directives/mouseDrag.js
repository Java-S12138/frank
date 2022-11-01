const MouseDragDirective = {
    mounted (el, binding) {
        const handler = binding.value
        let isDown = false
        let baseX = 0; let baseY = 0

        el.addEventListener('mousedown', function (e) {
            isDown = true
            baseX = e.x
            baseY = e.y
        })

        document.addEventListener('mousemove', function (e) {
            if (isDown) {
                const x = e.screenX - baseX
                const y = e.screenY - baseY
                handler({ x, y })
            }
        })

        document.addEventListener('mouseup', function () {
            isDown = false
        })
    }
}

export default MouseDragDirective
