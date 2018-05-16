class Observable {

    constructor(subscriber) {
        this.subscriber = subscriber
    }

    subscribe(observer) {
        if (typeof observer === 'function') observer = {next: observer}
        if (!observer.next)     observer.next     = () => {}
        if (!observer.complete) observer.complete = () => {}
        if (!observer.error)    observer.error    = () => {}
        return {unsubscribe: this.subscriber(observer) || (() => {})}
    }

    static fromEvent(object, event) {
        return new Observable(observer => {
            const handler = event => observer.next(event)
            object.addEventListener(event, handler)
            return () => object.removeEventListener(event, handler)
        })
    }

    do(cb) {
        return new Observable(observer => {
            const subscription = this.subscribe({
                next: value => {
                    cb(value)
                    observer.next(value)
                },
                complete: () => observer.complete(),
                error: err => observer.error(err),
            })
            return () => subscription.unsubscribe()
        })
    }

    map(cb) {
        return new Observable(observer => {
            const subscription = this.subscribe({
                next: value => observer.next(cb(value)),
                complete: () => observer.complete(),
                error: err => observer.error(err),
            })
            return () => subscription.unsubscribe()
        })
    }

    filter(cb) {
        return new Observable(observer => {
            const subscription = this.subscribe({
                next: value => { if (cb(value)) observer.next(value) },
                complete: () => observer.complete(),
                error: err => observer.error(err),
            })
            return () => subscription.unsubscribe()
        })
    }

    filterMap(cb) {
        return new Observable(observer => {
            const subscription = this.subscribe({
                next: value => {
                    value = cb(value)
                    if (value) observer.next(value)
                },
                complete: () => observer.complete(),
                error: err => observer.error(err),
            })
            return () => subscription.unsubscribe()
        })
    }

    debounceTime(time) {
        return new Observable(observer => {
            let i
            const subscription = this.subscribe({
                next: value => {
                    if (i) clearTimeout(i)
                    i = setTimeout(() => observer.next(value), time)
                },
                complete: () => setTimeout(() => observer.complete(), time),
                error: err => setTimeout(() => observer.error(err), time),
            })
            return () => subscription.unsubscribe()
        })
    }

    distinctUntilChanged() {
        return new Observable(observer => {
            let last = null
            const subscription = this.subscribe({
                next: value => {
                    if (value == last) return
                    last = value
                    observer.next(value)
                },
                complete: () => observer.complete(),
                error: err => observer.error(err),
            })
            return () => subscription.unsubscribe()
        })
    }

}
