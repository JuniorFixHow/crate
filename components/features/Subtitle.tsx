import { ComponentProps } from "react"

type SubtitleProps = {
  text:string,
  isLink?:boolean,
} & ComponentProps<'span'>
const Subtitle = ({text, isLink, className, ...props}:SubtitleProps) => {
  return (
    <span {...props}  className={`${className} font-semibold text-[1.2rem] ${isLink && 'hover:text-blue-600 hover:underline'}`} >{text}</span>
  )
}

export default Subtitle