import { foreach, StringBuilder } from '@tuval/core';
import { ControlHtmlRenderer, Fragment, Teact } from '@tuval/forms';
import { SvelteClass } from './SvelteClass';




export class StelveRenderer extends ControlHtmlRenderer<SvelteClass> {
    private accordionRef;
    shadowDom: any;
    protected menu: any;

    protected OnComponentDidMount(ref: any, obj: SvelteClass): void {

        const app = new obj.vp_SvelteComponent({
            target: ref
        });
    }
    public GenerateElement(obj: SvelteClass): boolean {
        this.WriteStartFragment();
        return true;
    }

    public GenerateBody(obj: SvelteClass): void {
        this.WriteComponent(
            <div>Test</div>
        )
    }
}