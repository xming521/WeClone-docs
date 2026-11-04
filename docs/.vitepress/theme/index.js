import DefaultTheme from 'vitepress/theme'
import { inBrowser } from 'vitepress'
import Layout from './Layout.vue'
import { setupImageViewer } from './imageViewer'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp() {
    if (inBrowser) setupImageViewer()
  }
}
