import { cTop, HStack, State, Text, TForm, UIController, UIScene, VStack } from '@tuval/forms';
import {SvelteView} from '../../View/SvelteView'
import MyView from '../../MyView.svelte';
import App from 'src/App.svelte';

export class AppController extends UIController {

    @State()
    private menu_text: string;

    protected InitController() {
        this.menu_text = 'About';
    }

    public OnBindModel(form: TForm) {

    }
    public LoadView() {
        return UIScene(
            VStack({ alignment: cTop })(
                SvelteView().svelteComponent(MyView),
                SvelteView().svelteComponent(App)
            )

        )
    }
}