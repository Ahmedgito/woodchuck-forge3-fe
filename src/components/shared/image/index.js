import Image from 'next/image'

// const imageLoader = ({ src, width, quality }) => {
//   return `https://example.com/${src}?w=${width}&q=${quality || 75}`
// }

const ImageComponent = (props) => {
  return (
    <Image
      src={props.src || ''}
      alt={props.alt}
      width={props.width || 0}
      height={props.height || 0}
      sizes={props.sizes || '100vw'}
      priority={props.priority || false}
      className={props.className || ''}
      // fill={true}
      // placeholder='blur'
    />
  )
}

export default ImageComponent
