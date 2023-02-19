import LazyImage from "../LazyImage";

import Loading_Image from '../../assets/images/loading.jpg'

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
    uri:string
}

export default function ImgFromUri({uri, ...props}:Props){
    const json = atob(uri.substring(29));
    const result = JSON.parse(json);
    const image = result.image.replace(/^(ipfs:\/\/)/g, 'https://ipfs.io/ipfs/')
    return (
        <LazyImage 
        src={image}
        placeholderImg={Loading_Image}
        alt="Image Alt"
        {...props}
        />
    )
}