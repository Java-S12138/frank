// @ts-ignore
cube.profile.subscriptions.getDetailedActivePlans('1588508786787356673').then(subsDetailType => {
  localStorage.setItem('isSubscribe','f')
  cube.profile.getCurrentUser().then(value => {
    if (value.userId === "U202108121313410404"){
      localStorage.setItem('isSubscribe','t')
      localStorage.setItem('remainSub','')
    }else {
      if (subsDetailType.length === 0){
        return
      }
      for (const subItem of subsDetailType) {
        if (subItem.status === 1){
          localStorage.setItem('isSubscribe','t')
          const date = new Date(Number(subItem.expireTime) * 1000)
          const today = new Date()
          const remainDay = date.getDate()-today.getDate()
          if (today.getMonth() === date.getMonth() && remainDay <=3){
            localStorage.setItem('remainSub',`${remainDay}`)
          }else {
            localStorage.setItem('remainSub','')
          }
          return
        }
      }
    }
  })
}).catch(() => {
  localStorage.setItem('isSubscribe','f')
})


