const Subtitle = ({text, isLink}:{text:string, isLink?:boolean}) => {
  return (
    <span className={`font-semibold text-[1.2rem] ${isLink && 'hover:text-blue-600 hover:underline'}`} >{text}</span>
  )
}

export default Subtitle