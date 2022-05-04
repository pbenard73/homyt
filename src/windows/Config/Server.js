import { IconButton } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import AddIcon from '@mui/icons-material/Add';
import styled from 'styled-components'
import { addServer, setDefaultServer } from "../../apis/configApi";

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
`

const Servers = () => {
    const [newServer, setNewServer] = useState(null);
    const servers = useSelector(state => state.app.config?.servers) || []  ;
     const defaultServer = {
        host: '',
        port:6600,
    }
    
    const createNewServer = async (e) => {
        console.log(typeof e, e)
        e.preventDefault()

        const data = await addServer({}, newServer) 

        if (data.valid === true) {
            setNewServer(null)
        }
    }

    
    return (
        <div style={{width:'100%'}}>
        <h5>Servers</h5>
        <div style={{textAlign:'right', marginBottom: '20px'}}>
            <IconButton onClick={() => setNewServer({...defaultServer})}>
                <AddIcon style={{color:'white'}} />
            </IconButton>
        </div>

        {newServer && (
            <form onSubmit={e => createNewServer(e)}>
                <input value={newServer.host} onChange={e => setNewServer({...newServer, host: e.target.value})} />
                <input value={newServer.port} onChange={e => setNewServer({...newServer, port: e.target.value})} />
                <input type='submit' value="save" />
            </form>
        )}

        <div style={{display:'flex', flexWrap:'wrap', gap:'10px'}}>
        {servers.map((server, serverIndex) => (
            <ServerBox 
            key={`${server.host}:${server.port}`}
             className={server.default === true ? 'active' : ''}
             onClick={() => server.default !== true && setDefaultServer({}, {index: serverIndex})}

             >
             <p><b>{server.host}</b></p>
             <p><b>{server.port}</b></p>
            </ServerBox>
        ))}
        </div>
        </div>
    )
}

export default Servers