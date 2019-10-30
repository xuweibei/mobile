import {FooterBar} from '../../common/foot-bar/FooterBar';
import Nothing from '../../common/nothing/Nothing';

const {FIELD} = Constants;
export default () => (
    <div>
        <Nothing
            text={FIELD.No_Goods}
        />
        <FooterBar active="shopCart"/>
    </div>
);