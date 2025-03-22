/// <reference types="vite/client" />
/// <reference types="@dcloudio/types" />

declare module "*.vue" {
    import type { DefineComponent } from "vue"
    const vueComponent: DefineComponent<{}, {}, any>
    export default vueComponent
}