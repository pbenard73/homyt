import { useMemo } from "react";
import { useSelector } from "react-redux";

const Artist = () => {
    const artist = useSelector(state => state.app.mpdStatus?.current?.artist);
    const title = useSelector(state => state.app.mpdStatus?.current?.title);
    const file = useSelector(state => state.app.mpdStatus?.current?.file);
    
    const normalTitle = (!artist && !title && file && file.split('/').reverse()[0]) || '';

    const isRadio = (file || '').indexOf('http') === 0;

    const radioName = isRadio ? file.split('#').reverse()[0] : null;  

    const finalTitle = radioName ? `${radioName}${normalTitle !== '' ? ` - ${normalTitle}` : ''}` : normalTitle

    const memoArtist = useMemo(() => (
        <div style={{display:'flex', flexDirection:'column', fontSize:'12px'}}>
            {<span>{finalTitle}</span>}
            <span>{artist}</span>
            <span>{title}</span>
        </div> 
    ), [artist, title, file])

    return memoArtist;
}

export default Artist;