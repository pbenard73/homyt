import { useState } from "react";
import { useSelector } from "react-redux";
import StorageIcon from '@mui/icons-material/Storage';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import BadgeIcon from '@mui/icons-material/Badge';
import styled from 'styled-components'
import { addServer, setDefaultServer } from "../../apis/configApi";
import Button from "../../components/Button";
import Form from "../../components/Form";
import TextField from "../../components/TextField";
import { useTranslation } from "react-i18next";

const ServerBox = styled.div`
    display:flex;
    width: 200px;
    padding:10px;
    flex-direction: column;
    border: 1px solid white;
    &.active{
        border-color: #007ed7;
    }
    &:not(.active) {
        cursor:pointer;
    }
    > div {
        display:flex;
        align-items:center;
        width:100%;
        svg {
            height: .75em;
            margin-right: 10px;
        }
        span {
            text-overflow: ellipsis;
            overflow: hidden;
            display:inline-block;
            font-size:.75em;
            &:before{
                content: attr(title);
            }
        }
    }
`

const SmallField = styled(TextField)`
    margin-bottom: 15px !important;
    input{
        padding: 5px 14px;
    }
    .MuiInputLabel-root:not(.Mui-focused):not(.MuiFormLabel-filled){
        top: -10px;
    }
`

const ServerForm = ({value: initialValue, onSubmit}) => {
    const { t } = useTranslation()
    const [value, setValue] = useState(initialValue)

    const changeValue = field => e => setValue({...value, [field]: e.target.value})

    return (
        <Form onSubmit={e => onSubmit(e, value)}>
            <div>
                <SmallField label={t("server_name")} value={value.name} onChange={changeValue('name')} />
                <SmallField label={t("server_host")} value={value.host} onChange={changeValue('host')} />
                <SmallField label={t("server_port")} value={value.port} onChange={changeValue('port')} />
                <SmallField label={t("server_audio_url")} value={value.audioUrl} onChange={changeValue('audioUrl')} />
                <Button type="submit">{t('save')}</Button>
            </div>
        </Form>
    )
}

const Servers = () => {
    const [newServer, setNewServer] = useState(null);
    const servers = useSelector(state => state.app.config?.servers) || []  ;
     const defaultServer = {
        host: '',
        port:6600,
    }
    
    const ToggleIcon = newServer === null ? AddIcon : CloseIcon;

    const toggleNewServer = () => {
        setNewServer(oldValue => oldValue === null ? {...defaultServer} : null);
    }

    const createNewServer = async (e, value) => {
        e.preventDefault()

        const data = await addServer({}, value) 

        if (data.valid === true) {
            setNewServer(null)
        }
    }

    
    return (
        <div style={{width:'100%'}}>
        <div style={{textAlign:'right', marginBottom: '20px'}}>
            <Button onClick={toggleNewServer}>
                <ToggleIcon style={{color:'white'}} />
            </Button>
        </div>

        {newServer && <ServerForm value={newServer} onSubmit={createNewServer} />}

        <div style={{display:'flex', flexWrap:'wrap', gap:'10px'}}>
        {servers.map((server, serverIndex) => (
            <ServerBox 
            key={`${server.host}:${server.port}`}
             className={server.default === true ? 'active' : ''}
             onClick={() => server.default !== true && setDefaultServer({}, {index: serverIndex})}

             >
             <div>
                 <BadgeIcon /> <span title={server.name}>{server.name ? server.name : server.internal ? 'Internal' : null}</span>
             </div>
             <div>
                 <StorageIcon /> <span title={`${server.host}:${server.port}`}></span>
             </div>
             <div>
                 <MusicNoteIcon /> <span title={server.audioUrl}></span>
             </div>
            </ServerBox>
        ))}
        </div>
        </div>
    )
}

export default Servers