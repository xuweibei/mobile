/*
* 下拉刷新动画，canvas绘图
* */

import './Animation.less';

const {getPixelRatio} = Utils;

class Animation extends React.PureComponent {
    componentDidMount() {
        this.draw();
    }

    componentWillUnmount() {
        console.log('卸载组件');
        this.clear();
    }

    // canvas绘制下拉动画
    draw = (canvas = this.canvas) => {
        if (!canvas) return;
        //获取canvas上下文
        const ctx = canvas.getContext('2d');
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const img = new Image();
        let x = 0;
        let y = 0;
        let num = 0;
        img.src = '../../../../src/assets/images/all.png';
        img.onload = () => {
            const ratio = getPixelRatio(ctx) > 2 ? 2 : getPixelRatio(ctx);
            const animate = () => {
                num++;
                if (num % 2 === 0) {
                    ctx.clearRect(0, 0, canvasWidth * ratio, canvasHeight * ratio);
                    ctx.drawImage(img, x * 240, y * 240, 120 * ratio, 120 * ratio, 100, 100, 120, 120);
                    x++;
                    if (x % 7 === 0) {
                        y++;
                        x = 0;
                    }
                    if (y > 6) {
                        x = 0;
                        y = 0;
                    }
                }
                this.timer = requestAnimationFrame(animate);
            };
            animate();
        };
    };

    // 清除动画缓存
    clear= () => {
        window.cancelAnimationFrame(this.timer);
        console.log('清理');
    };

    render() {
        return (
            <canvas
                ref={(el) => { this.canvas = el }}
                className="canvas-drawing"
                height="330"
                width="330"
            />
        );
    }
}

export default Animation;
