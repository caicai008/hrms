import router from './router'

// const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  next()
})

router.afterEach(() => {

})
