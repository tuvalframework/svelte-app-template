import { UIController, UIView } from "@tuval/forms";
import {StelveRenderer} from './StelveRenderer'


export class SvelteClass extends UIView {

    public setController(controller: UIController): this {
        super.setController(controller);
         this.Renderer = new StelveRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });

        return this;
    }
    public constructor() {
        super();

        this.Appearance.Width = '100%';
        this.Appearance.Height = '100%';
    }
}