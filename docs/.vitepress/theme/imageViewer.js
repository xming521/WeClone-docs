import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.min.css'

const IMAGE_URL = /\.(png|jpe?g|gif|webp|avif|svg)([?#].*)?$/i

// A picture opens in the viewer unless it sits in a link to a page;
// a link to an image file supplies the full-size source.
function sourceFor(img) {
  const link = img.closest('a')
  if (!link) return img.currentSrc || img.src
  return IMAGE_URL.test(link.getAttribute('href') || '') ? link.href : null
}

function open(src, alt) {
  const holder = document.createElement('div')
  const img = document.createElement('img')
  img.src = src
  img.alt = alt
  holder.append(img)
  const viewer = new Viewer(holder, {
    navbar: false,
    title: false,
    toolbar: { zoomIn: true, zoomOut: true, oneToOne: true, reset: true },
    hidden: () => viewer.destroy()
  })
  viewer.show()
}

export function setupImageViewer() {
  document.addEventListener('click', (event) => {
    const img = event.target.closest?.('.vp-doc img')
    if (!img || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return
    const src = sourceFor(img)
    if (!src) return
    event.preventDefault()
    open(src, img.alt)
  })
}
