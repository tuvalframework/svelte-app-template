import { viewFunc } from "@tuval/forms";
import { SvelteClass } from "./SvelteClass";


export function SvelteView(): SvelteClass {
        return new SvelteClass().setController(null);

}