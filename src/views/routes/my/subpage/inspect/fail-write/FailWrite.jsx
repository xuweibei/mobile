//核销失败，2019-12-19，楚小龙
import {Button} from 'antd-mobile';
import './FailWrite.less';

export default class FailWrite extends BaseComponent {
  render() {
    return (
      <div className="fail-write-container">
        <div className="item-container">
          <div className="item-code-wrong"/>
          <p className="wrong-desc">二维码出错</p>
          <Button>重新扫描</Button>
        </div>
        <div className="item-container">
          <div className="item-sys-wrong"/>
          <p className="wrong-desc">系统开小差了，请稍后再试</p>
          <Button>返回</Button>
        </div>
        <div className="item-container">
          <div className="item-order-wrong"/>
          <p className="wrong-desc">非本店订单</p>
          <Button>返回</Button>
        </div>
        <div className="item-container">
          <div className="item-order-timeout"/>
          <p className="wrong-desc">订单已过期</p>
          <Button>返回</Button>
        </div>
      </div>
    )
  }
}