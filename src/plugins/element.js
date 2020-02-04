import Vue from 'vue'
import { Button, Input, Form, FormItem, RadioButton, RadioGroup, ColorPicker } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

locale.use(lang)

Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(RadioButton)
Vue.use(RadioGroup)
Vue.use(ColorPicker)