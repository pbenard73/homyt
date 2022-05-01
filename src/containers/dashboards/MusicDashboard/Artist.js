import { useMemo } from "react";
import { useSelector } from "react-redux";

const Artist = () => {
    const artist = useSelector(state => state.app.mpdStatus?.current?.artist);
    const title= useSelector(state => state.app.mpdStatus?.current?.title);
    const file= useSelector(state => state.app.mpdStatus?.current?.file);
    
    const memoArtist = useMemo(() => (
        <div style={{display:'flex', flexDirection:'column', fontSize:'12px'}}>
            {!artist && !title && file && <span>{file.split('/').reverse()[0]}</span>}
            <span>{artist}</span>
            <span>{title}</span>
        </div> 
    ), [artist, title, file])

    return memoArtist;
}

export default Artist;