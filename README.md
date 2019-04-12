# vue2-toast-plugin
A simple toast plugin for vue2.

## Usage
#### Use vue-cli
Install:
```
npm install vue2-toast-plugin --save

```
Import:
```javascript
import Toast from "vue2-toast-plugin";
import "vue2-toast-plugin/dist/style.css";

Vue.use(Toast);
```
#### Direct &lt;script&gt; include
It dispose the global variable:
```javascript
Vue.use(VueToast)
```

You can set the configuration：

```javascript
Vue.use(Toast, {
    position: 'center',
    duration: 3000,
    wordWrap: true,
    width: '100px'
});
```

In the component:
```javascript
export default {
    methods:{
        openCenter(){
            this.$toast('hello'); //default potision center
        },
        openTop(){
            this.$toast('hello', {
              position: 'top', //or bottom
              duration: 2000
            });
        },
        openWithIcon(){
            this.$toast('hello', {
              position: 'top',
              duration: 2000,
              icon: 'success' //or error
            });
        },
        loading(){
            this.$loading('getting data...');
            let t = this;
            setTimeout(function () {
              t.$loading.close();
            }, 2000)
        }
    }
}
```

## options
    Vue.use(Toast, [options])

| key    | type |  value  | default |
| :----: |:----:   | :----: | :----: |
| position |  string  | "top" &Iota; "center" &Iota; "bottom" | "center"|
| duration |  number  |  2000 | 2000|
| wordWrap |   boolean    |  true &Iota; false | false|
| width | string | "100px" | "auto" |
