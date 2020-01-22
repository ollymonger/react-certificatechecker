import React, { useEffect, useState } from "react";
import { Typography, makeStyles, createStyles, Theme, Table, TableRow, TableCell, TableHead, TableBody, Button, IconButton } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        },
        all: {
            flexGrow: 1,
            overflowY: 'hidden',
            userSelect: 'none',
            padding: '10px 10px 10px 10px',
            width: '30vw'
        },
        Table: {
            userSelect: 'none',
            width: '30vw',
            marginTop: '-200px'
        }
    }));


export function RenderManualChecks() {
    const classes = useStyles(1);
    const [certs, setCerts] = useState(null);

    useEffect(() => {
        const getCerts = async () => {
            const checkCerts = await fetch('http://localhost:9999/getManualChecks');
            checkCerts.json().then(function (data) {
                setCerts(data);
            })
        };
        getCerts();
    }, []);

    if (certs === null) {
        return (
            <div className={classes.root}>
                <Typography variant="body2">Waiting for manual checks to be returned!</Typography>
            </div>
        )
    }

    const getCertificates = (certificate) => {
        return (
            <>
                <TableCell>{certificate.name}</TableCell>
                <TableCell>{certificate.valid.toString()}</TableCell>
                <TableCell style={{ backgroundColor: 'rgba(0, 255, 0, 0.3)' }}>{new Date(certificate.valid_to).toUTCString()}</TableCell>
                <TableCell>{certificate.description}</TableCell>
            </>
        );
    };

    return (
        <>
            <Table className={classes.Table}>
                <TableHead>
                    <TableRow>
                        <TableCell>URL</TableCell>
                        <TableCell>VALID</TableCell>
                        <TableCell>VALID TO</TableCell>
                        <TableCell>DESCRIPTION</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {certs.map((allCerts, id: number) => (
                        <TableRow key={id} selected={true} hover={true}>
                            {getCertificates(allCerts)}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </>
    );
}