import React from 'react'
import StorageIcon from '@mui/icons-material/Storage';
import InfoIcon from '@mui/icons-material/Info';
import { softwareUpdate } from '../../api';
import Button from '../../components/Button';
import Servers from './Server';
import Tabular from '../../containers/Tabular';

const Config = () =>  (
    <Tabular icons={[StorageIcon, InfoIcon]}>
        <Servers />
        <div>
            <Button
                style={{marginRight:'20px'}}
                onClick={() => softwareUpdate()}
            >
                {"UPGRADE"}
            </Button>
        </div>
    </Tabular>
)
    
export default Config