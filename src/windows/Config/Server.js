import { useState } from "react";
import { useSelector } from "react-redux";
import { addServer, setDefaultServer } from "../../apis/configApi";

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
        <p>Servers</p>
        <button onClick={() => setNewServer({...defaultServer})}>+ server</button>

        {newServer && (
            <form onSubmit={e => createNewServer(e)}>
                <input value={newServer.host} onChange={e => setNewServer({...newServer, host: e.target.value})} />
                <input value={newServer.port} onChange={e => setNewServer({...newServer, port: e.target.value})} />
                <input type='submit' value="save" />
            </form>
        )}

        {servers.map((server, serverIndex) => (
            <div key={`${server.host}:${server.port}`}>
                <p onClick={() => setDefaultServer({}, {index: serverIndex})}>{server.host} - {server.port} => {server.default === true ? 'O' : '-'}</p>
            </div>
        ))}
        </div>
    )
}

export default Servers