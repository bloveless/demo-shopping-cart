import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@material-ui/core';
import {GET_ALL_ITEMS} from '../utils/queries';
import Title from './Title';
import ItemRow from './ItemRow';

export default function Items({cart, setCart}) {
    const {loading, error, data} = useQuery(GET_ALL_ITEMS);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error {error}</div>;
    }

    return (
        <React.Fragment>
            <Title>Items</Title>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>SKU</TableCell>
                        <TableCell/>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data && data.items && data.items.map(item => (
                        <ItemRow key={item.id} item={item} cart={cart} setCart={setCart}/>
                    ))}
                </TableBody>
            </Table>
        </React.Fragment>
    );
}
