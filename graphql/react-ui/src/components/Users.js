import React, {useState} from 'react';
import {useQuery, useMutation} from "@apollo/react-hooks";
import {Button, Table, TableBody, TableCell, TableHead, TableRow, TextField} from '@material-ui/core';
import {GET_ALL_USERS,CREATE_USER} from '../utils/queries';
import {useUsersStyles} from '../utils/styles';
import Title from './Title';

export default function Users({handleUserLogin}) {
    const classes = useUsersStyles();
    const {loading, error, data, refetch} = useQuery(GET_ALL_USERS);
    const [createUser] = useMutation(CREATE_USER);
    const [values, setValues] = useState({
        name: '',
    });

    if (error) {
        console.log(error);
        return <div>Error loading users</div>;
    }

    if (loading) {
        return <div>Loading users...</div>;
    }

    const handleChange = (name) => (event) => {
        setValues({ ...values, [name]: event.target.value });
    };

    const handleCreateUser = () => {
        if (values.name.length > 3) {
            createUser({variables: {name: values.name}}).then(() => {
                refetch();
                setValues({name: ''})
            });
        } else {
            alert("Name must be longer than 3 characters.")
        }
    };

    return (
        <React.Fragment>
            <Title>Users</Title>
            <form className={classes.container} noValidate autoComplete="off">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.users && data.users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleUserLogin(user.id)}
                                        className={classes.button}
                                    >
                                        <span>Login</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!data || !data.users || !data.users.length) && (
                            <TableRow>
                                <TableCell>No users found</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        )}
                        <TableRow>
                            <TableCell>
                                <TextField
                                    id="standard-name"
                                    label="Name"
                                    className={classes.textField}
                                    value={values.name}
                                    onChange={handleChange('name')}
                                    margin="normal"
                                />
                            </TableCell>
                            <TableCell align="right">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleCreateUser}
                                    className={classes.button}
                                >
                                    <span>Create</span>
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </form>
        </React.Fragment>
    );
}
