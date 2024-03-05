
/**
 * 定时触发器 =》 间隔时间相同
 * @param func 
 * @param delay 
 */
export const mySetInterval = (func: Function, delay: number) => {

    let timer

    function intervalFunc() {
        func();
        setTimeout(intervalFunc, delay)
    }

    timer = setTimeout(intervalFunc, delay)

    return timer
}