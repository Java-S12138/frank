export const MouseDragDirective = {
  mounted (el:any, binding:any) {
    const handler = binding.value
    let isDown:boolean = false
    let baseX:number = 0; let baseY:number = 0

    el.addEventListener('mousedown', function (e:any) {
      isDown = true
      baseX = e.x
      baseY = e.y
    })

    document.addEventListener('mousemove', function (e:MouseEvent) {
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