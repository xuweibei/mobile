/*
* 6位密码框
* */
import PropTypes from 'prop-types';
import './InputGrid.less';

// TODO: 考虑用Immutable数据结构
class InputGrid extends React.PureComponent {
    static propTypes = {
        onInputGrid: PropTypes.func.isRequired
    };

    state = {
        valueGrid: [],
        value: ''
    }

    componentDidMount() {
        this.numInput.focus();
    }

    inputGrid = (e) => {
        console.log(e, '了水电费进口量');
        const {valueGrid} = this.state;
        const val = e.target.value;
        const str = e.target;
        const aa = val.charAt(val.length - 1);
        const bb = [];
        for (let i = 0;  i < val.length; i++) {
            bb.push('*');
        }
        if (valueGrid.length > val.length) {
            valueGrid.pop();
            this.setState({
                value: bb.join(''),
                valueGrid: valueGrid
            });
        } else {
            this.setState(prevState => ({
                value: bb.join(''),
                valueGrid: prevState.valueGrid.splice(val.length - 1, 1, aa).concat(valueGrid)
            }), () => {
                if (valueGrid.length === 6) {
                    str.blur();
                    this.props.onInputGrid(valueGrid.join(''));
                }
            });
        }
    }

    clearInput = () => {
        this.setState({
            value: '',
            valueGrid: []
        });
    }

    //渲染函数
    render() {
        const {value} = this.state;
        return (
            <div className="frame">
                <div className="frame-biu">
                    <div className="frame-biu-one"/>
                    <div className="frame-biu-one"/>
                    <div className="frame-biu-one"/>
                    <div className="frame-biu-one"/>
                    <div className="frame-biu-one"/>
                </div>
                <input className="input-pws" maxLength="6" value={value} type="test" ref={number => { this.numInput = number }} onChange={this.inputGrid} onClick={this.clearInput}/>
            </div>
        );
    }
}

export {InputGrid};
