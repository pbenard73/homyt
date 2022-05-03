import React from 'react'
import { useState } from 'react';
import StorageIcon from '@mui/icons-material/Storage';
import InfoIcon from '@mui/icons-material/Info';
import { softwareUpdate } from '../../api';
import Button from '../../components/Button';
import { IconButton } from '@mui/material';
import Servers from './Server';

const Config = () => {
    const [tabIndex, setTabindex] = useState(0)

    const tabulation = index => () => {
        if (tabIndex !== index) {
            setTabindex(index)
        }
    }

    return (
        <div style={{display:'flex', flexDirection:'row', width:'100%'}} className="nodrag">
            <div style={{width:'60px', display:'flex', flexDirection:'column'}}>
                <IconButton onClick={tabulation(0)} style={{color: tabIndex === 0 ? 'white' : undefined}}>
                    <StorageIcon />
                </IconButton>
                <IconButton onClick={tabulation(1)} style={{color: tabIndex === 1 ? 'white' : undefined}}>
                    <InfoIcon />
                </IconButton>
            </div>
            
            <div style={{width:'100%', padding:'10px'}}>               
                {tabIndex === 0 && <Servers />}

                {tabIndex === 1 && (
                    <Button
                    style={{marginRight:'20px'}}
                    onClick={() => softwareUpdate()}
                    >
                        {"UPGRADE"}
                    </Button>  
                )}
               
            </div>
        </div>
    )
}
export default Config