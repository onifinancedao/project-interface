import ReactMarkdown from "react-markdown";

export default function Markdown({children}:{children:string}){
    function MarkdownLink({ ...rest }) {
        return <a {...rest} target="_blank" rel="noopener noreferrer" />
      }
      function MarkdownImage({ ...rest }) {
        return <img {...rest} style={{ width: '100%', height: '100$', objectFit: 'cover' }} alt="" />
      }
    return(
        <ReactMarkdown components={{
            a: ({node, ...props}) => <MarkdownLink {...props} />,
            img: ({node, ...props}) => <MarkdownImage {...props} />
          }} children={children}/>
    )
}