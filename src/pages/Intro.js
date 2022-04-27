import React from 'react'
import App from '../App'
import { AwesomeButton } from "react-awesome-button";
import { useState } from 'react';

const Intro = () => {
    const [open, setOpen] = useState(false)

    const openMp3 = () => {
        window.location.href = "/mp3"
    }

    const openRadio = () => {
        window.location.href = "/radio"
    }

    if (open) {
        return <App />
    }

    return (
        <div>
                            <AwesomeButton
                className="nodrag"
                type="instagram"
                style={{marginRight:'20px'}}
                onPress={openMp3}
                >
                    Ecouter Sortie Son
                </AwesomeButton>  
                <AwesomeButton
                className="nodrag"
                type="instagram"
                style={{marginRight:'20px'}}
                onPress={openRadio}
                >
                    Ecouter Sortie Radio
                </AwesomeButton>  
                <AwesomeButton
                className="nodrag"
                type="instagram"
                style={{marginRight:'20px'}}
                onPress={() => setOpen(true)}
                >
                    Admin Area
                </AwesomeButton>  
        </div>
    )
}

export default Intro