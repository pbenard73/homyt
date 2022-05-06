import Button from "../../components/Button"
import { Checkbox, FormControlLabel, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, TextField } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useState, useEffect } from "react"
import { createUser, deleteUser, editUser, getUsers } from "../../apis/authApi"
import Form from "../../components/Form";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [userForm, setUserForm] = useState(null)

    const defaultUser = {
        username: '',
        password: '',
        token: '',
        isAdmin: false,
    }

    const getUsersList = async () => {
        const {valid, users: dbUsers} = await getUsers()

        if (valid === true) {
            setUsers(dbUsers)
        }
    }

    useEffect(() => {
        getUsersList()

        return () => {
            console.log('Dechargement ')
        }
    }, [])

    const changeValue = field => ({
        onChange: e => setUserForm({...userForm, [field]: e.target.value}),
        value: userForm[field],
        label: field
    })

    const onSubmit = async e => {
        e.preventDefault?.()

        const data = {...userForm, isAdmin: undefined};
        data.role = userForm.isAdmin ? 'ADMIN' : null;
        delete data.isAdmin

        if (userForm.id === undefined) {
            const { valid } = await createUser({}, data);
            if (valid === true) {
                getUsersList();

                setUserForm(null)
            }
        } else {
            const { valid } = await editUser({id: userForm.id}, userForm)

            if (valid === true) {
                getUsersList();

                setUserForm(null)
            }
        }
    }

    const deleteUserById = async userId => {
        const result = await deleteUser({id: userId})

        if (result.valid === true) {
            getUsersList();
        }
    }

    return (
        <>
            <div style={{textAlign: 'right'}}>
                <Button onClick={() => setUserForm(o => o === null ? {...defaultUser} : null)}>
                    {userForm === null ? <AddIcon /> : <CloseIcon />}
                </Button>
            </div>
            {userForm && (
                <Form onSubmit={onSubmit}>
                    <div>
                        <TextField {...changeValue('username')} />
                        <TextField {...changeValue('password')} />
                        <TextField {...changeValue('token')} />
                        <FormControlLabel
                            label='Is admin'
                            control={<Checkbox checked={userForm.isAdmin} onChange={() => setUserForm({...userForm, isAdmin: !userForm.isAdmin})} />}
                        />
                        <Button type="submit">save</Button>
                    </div>
                </Form>
            )}
            <List>
                {users.map(user => (
                    <ListItem key={user.id}>
                        <ListItemText primary={user.username} secondary={user.role} />
                        <ListItemSecondaryAction>
                            <IconButton onClick={() => deleteUserById(user.id)}>
                                <DeleteForeverIcon />
                            </IconButton>
                            <IconButton onClick={() => setUserForm({...user, isAdmin: user.role === 'ADMIN'})}>
                                <EditIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </>
    )
}

export default Users;