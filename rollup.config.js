
import fs from 'fs'
import replace from 'rollup-plugin-replace'

const styles = fs.readFileSync('dist/objectView.css', 'utf8')

export default {
  plugins: [
    replace({
      OBJECT_VIEW_STYLES: `"${styles.replace(/"/g, '\\"').replace('\n', '')}"`
    })
  ]
}
