import { IconButton } from '@mui/material';
import React from 'react'
import { useState } from 'react';

const Tabular = ({icons, children}) => {
    const [tabIndex, setTabindex] = useState(0)

    const tabulation = index => () => {
        if (tabIndex !== index) {
            setTabindex(index)
        }
    }

    return (
        <div style={{display:'flex', flexDirection:'row', width:'100%'}} className="nodrag">
            <div style={{width:'60px', display:'flex', flexDirection:'column'}}>
                {icons.map((Icon, index) => (
                    <IconButton key={index} onClick={tabulation(index)} style={{color: tabIndex === index ? 'white' : undefined}}>
                        <Icon />
                    </IconButton>
                ))}
            </div>
            
            <div style={{width:'100%', padding:'10px'}}> 
                {children.map((child, index) => tabIndex === index && child)}    
            </div>
        </div>
    )
}
export default Tabular
