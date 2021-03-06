import React from 'react'
import StorageIcon from '@mui/icons-material/Storage';
import InfoIcon from '@mui/icons-material/Info';
import GroupIcon from '@mui/icons-material/Group';
import { softwareUpdate } from '../../api';
import Button from '../../components/Button';
import Servers from './Server';
import Tabular from '../../containers/Tabular';
import Users from './Users';
import { useTranslation } from 'react-i18next';

const Config = () =>  {
    const { t } = useTranslation();

    return (
        <Tabular icons={[StorageIcon, GroupIcon, InfoIcon]}>
            <Servers />
            <Users />
            <div>
                <Button
                    style={{marginRight:'20px'}}
                    onClick={() => softwareUpdate()}
                >
                    {t("upgrade")}
                </Button>
            </div>
        </Tabular>
    )
}
    
export default Config