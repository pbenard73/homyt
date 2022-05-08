import { useMemo } from "react";
import { useSelector } from "react-redux";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { useApp } from "../../../redux/appSlice";

const Artist = () => {
    const app = useApp()
    const artist = useSelector(state => state.app.mpdStatus?.current?.artist);
    const title = useSelector(state => state.app.mpdStatus?.current?.title);
    const file = useSelector(state => state.app.mpdStatus?.current?.file);
    const servers = useSelector(state => state.app.config?.servers) || []

    const actualServer = servers.find(server => server.default === true && server.internal === true);
    
    const normalTitle = (!artist && !title && file && file.split('/').reverse()[0]) || '';

    const isRadio = (file || '').indexOf('http') === 0;

    const radioName = isRadio ? file.split('#').reverse()[0] : null;  

    const finalTitle = radioName ? `${radioName}${normalTitle !== '' ? ` - ${normalTitle}` : ''}` : normalTitle

    const memoArtist = useMemo(() => (
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <div style={{display:'flex', flexDirection:'column', fontSize:'12px'}}>
                {<span>{finalTitle}</span>}
                <span>{artist}</span>
                <span>{title}</span>
            </div> 
            {actualServer && title && (
                <span onClick={() => app.downloadActual(title)} style={{cursor:'pointer', marginLeft:'20px'}}>
                    <CloudDownloadIcon style={{height:'0.6em'}}/>
                </span>
            )}
        </div>
    ), [artist, title, file])

    return memoArtist;
}

export default Artist;