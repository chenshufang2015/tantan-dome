import React, {
  Component,
} from 'react'
import {
  data,
} from './index.json'
import './App.css'

class App extends Component {
  state = {
    num: 0,
    pre: 0,
    next: 1,
    load: true,
    run: true,
    lists: data,
    zIndex: 0,
  }

  /* 元素位置 */
  site = {
    x_start: 0,
    y_start: 0,
    x_move: 0,
    y_move: 0,
    x_end: 0,
    y_end: 0,
    top_val: 0,
    left_val: 0,
  }

  /* 初始化 */
  init = () => {
    this.activeEl(this.preImg)
  }

  // /* 激活层 */
  activeEl = el => {
    el.style.zIndex = 2
    // console.log(el.style)
  }

  /* 图片HTML */
  imgHtml = (pre, lists) => {
    console.log('pre', pre)
    if (pre >= lists.length - 1) {
      return (
        <div>
          <div className='no-list'>
        没有数据了
            {' '}
          </div>
        </div>
      )
    } else {
      return (
        // style={{ transform: [`translate3d(100px,100px,0)`] }}
        <div id={`ind-${pre}`} ref={preImg => this.preImg = preImg}>
          <div className="div1">
            <img src={`${lists[pre].url}`} alt='avatar' />
            <p className='info'>
              <span>
                {' '}
                {
                  `${lists[pre].name}`
                }
                {' '}

              </span>
              {' '}
              <span>
                {' '}
                {
                  `${lists[pre].age}`
                }
                {' '}

              </span>
              {' '}

            </p>
            {' '}

          </div>
          {' '}

        </div>
      )
    }
  }

  /* 图片HTML */
  imgHtml1 = (index, lists) => {
    if (index >= lists.length - 1) {
      return (
        <div>
          <div className='no-list'>
           没有数据了
          </div>
        </div>
      )
    } else {
      return (
        <div id={
          `ind-${index}`
        }>
          <div className="div1">
            <img src={`${lists[index].url}`} alt='avatar' />
            <p className='info'>
              <span>
                {`${lists[index].name}`}
              </span>
              <span>
                { `${lists[index].age}`}
              </span>
            </p>
          </div>
        </div>
      )
    }
  }

  // // /* 移动动画 */
  animateMove = (el, val) => {
    let {
      run,
      pre,
      next,
      lists,
    } = this.state
    const DOC_WIDTH = document.body.clientWidth
    if (!run || next > lists.length - 1) {
      return
    }

    /* CSS3动画方式 */
    el.style.transform = [`translate3d(${DOC_WIDTH * val}px,${this.site.top_val * 2.2}px,0px)`]
    el.style.transitionDuration = 'transitionDuration:0.5s'
    pre += 1
    next += 1
    this.setState({
      pre,
      next,
      run: true,
      load: true,
    }, () => {
      el.style.transform = [`translate3d(0px,0px,0px)`]
      this.activeEl(el)
    })
  }

  /* 复位动画 */
  animateReset = el => {
    /* CSS3动画方式 */
    el.style.transform = [`translate3d(0px,0px,0px)`]
    el.style.transitionDuration = 'transitionDuration:0.5s'
    setTimeout(() => {
      el.style.transitionDuration = 'transitionDuration:0s'
    }, 1000)
  }

  start = e => {
    const {
      load,
      run,
      lists,
      pre,
    } = this.state
    // 判断默认行为是否可以被禁用
    if (e.cancelable) {
      // 判断默认行为是否已经被禁用
      if (!e.defaultPrevented) {
        e.preventDefault()
      }
    }
    e.stopPropagation()

    if (!load || !run || pre >= lists.length - 1) {
      return
    }
    const ev = e || window.event
    this.site.x_start = ev.touches[0].pageX
    this.site.y_start = ev.touches[0].pageY
  }

  move = e => {
    // 判断默认行为是否可以被禁用
    if (e.cancelable) {
      // 判断默认行为是否已经被禁用
      if (!e.defaultPrevented) {
        e.preventDefault()
      }
    }
    e.stopPropagation()

    const {
      load,
      run,
      lists,
      pre,
    } = this.state
    if (!load || !run || pre >= lists.length - 1) {
      return
    }

    const ev = window.event
    // console.log('ev.touches[0].pageX',ev.touches)
    this.site.x_move = ev.touches[0].pageX
    this.site.y_move = ev.touches[0].pageY

    this.site.top_val = parseFloat(this.site.y_move) - parseFloat(this.site.y_start)
    this.site.left_val = parseFloat(this.site.x_move) - parseFloat(this.site.x_start)

    const Img = document.getElementById(`ind-${pre}`)
    console.log('moveImg', Img)

    Img.style.transform = `translate3d(${this.site.left_val}px,${this.site.top_val}px,0px)`
  }

  end = e => {
    // 判断默认行为是否可以被禁用
    if (e.cancelable) {
      // 判断默认行为是否已经被禁用
      if (!e.defaultPrevented) {
        e.preventDefault()
      }
    }
    e.stopPropagation()
    const DOC_WIDTH = document.body.clientWidth
    const {
      load,
      run,
      index,
      lists,
      pre,
    } = this.state
    const Img = document.getElementById(`ind-${pre}`)
    if (!load || !run || index >= lists.length - 1) {
      return
    }
    const ev = e || window.event
    this.site._x_end = ev.changedTouches[0].pageX
    this.site._y_end = ev.changedTouches[0].pageY
    if (this.site.left_val > 0 && this.site.left_val > DOC_WIDTH / 2 - DOC_WIDTH / 4.5) {
      // 右滑
      this.animateMove(Img, 1)
    } else if (this.site.left_val < 0 && this.site.left_val < -DOC_WIDTH / 2 + DOC_WIDTH / 4.5) {
      // 左滑
      this.animateMove(Img, -1)
    } else {
      this.animateReset(Img)
    }
  }

  componentDidMount() {
    this.init()
  }

  render() {
    const {
      pre,
      next,
      lists,
    } = this.state
    return (<div className="App">
      <div
        id="photo_box"
        ref={
          photoBox => {
            this.photoBox = photoBox
          }
        }
        onTouchStart={
          e => this.start(e)
        }
        onTouchMove={
          e => this.move(e)
        }
        onTouchEnd={
          e => this.end(e)
        }>
        <div>
          <div ref={
            box => {
              this.box = box
            }
          }>
            {' '}
            {
              this.imgHtml(pre, lists)
            }
            {' '}
            {
              this.imgHtml1(next, lists)
            }
            {' '}

          </div>
          {' '}

        </div>
        {' '}

      </div>
      {' '}

    </div>
    )
  }
}

export default App