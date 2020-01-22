import React, { useEffect, useState } from "react";
import { Typography, LinearProgress, makeStyles, createStyles, Theme, Table, TableRow, TableCell, TableHead, TableBody, Button, IconButton } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        },
        all: {
            flexGrow: 1,
            overflowY: 'hidden',
            userSelect: 'none',
            padding: '10px 10px 10px 10px',
            width: '500px'
        },
        Table: {
            userSelect: 'none',
            width: '60vw',
        }        
    }));


export function RenderAutoChecks() {
    const classes = useStyles(1);
    const [certs, setCerts] = useState(null);

    useEffect(() => {
        const getCerts = async () => {
            const checkCerts = await fetch('http://localhost:9999/checkCerts');
            checkCerts.json().then(function (data) {
                setCerts(data);
            })
        };
        getCerts();
    }, []);

    if (certs === null) {
        return (
            <div className={classes.root}>
                <header><LinearProgress color="secondary" /></header>
                <div className={classes.all}>
                    <Typography variant="h4">SITE CERTIFICATE CHECKER</Typography>
                    <Typography variant="body1">This was last refreshed: "Server probably offline"<br />
                        2 days, just so its not constantly doing refreshing the data. We may still be loading, or the server's offline.</Typography>
                </div>
                <header><LinearProgress color="secondary" style={{ width: '500px', height: '25px' }} /></header>
            </div>
        )
    }

    const getCertificates = (certificate) => {
        if (certificate.dayleft === '0') {
            return (
                <>
                    <TableCell>{certificate.name}</TableCell>
                    <TableCell>{certificate.port}</TableCell>
                    <TableCell>{certificate.valid.toString()}</TableCell>
                    <TableCell style={{ backgroundColor: 'rgba(255, 0, 0, 0.3)' }}>Unknown/No Certificate</TableCell>
                    <TableCell>{certificate.dayleft}</TableCell>
                </>
            );
        } else
            if (certificate.dayleft < 30) {
                return (
                    <>
                        <TableCell>{certificate.name}</TableCell>
                        <TableCell>{certificate.port}</TableCell>
                        <TableCell>{certificate.valid.toString()}</TableCell>
                        <TableCell style={{ backgroundColor: 'rgba(255, 0, 0, 0.3)' }}>{new Date(certificate.valid_to).toUTCString()}</TableCell>
                        <TableCell>{certificate.dayleft}</TableCell>
                    </>
                );
            } else if (certificate.dayleft > 30 && certificate.dayleft < 60) {
                return (
                    <>
                        <TableCell>{certificate.name}</TableCell>
                        <TableCell>{certificate.port}</TableCell>
                        <TableCell>{certificate.valid.toString()}</TableCell>
                        <TableCell style={{ backgroundColor: 'rgba(255, 255, 0, 0.3)' }}>{new Date(certificate.valid_to).toUTCString()}</TableCell>
                        <TableCell>{certificate.dayleft}</TableCell>
                    </>
                );
            } else if (certificate.dayleft > 60) {
                return (
                    <>
                        <TableCell>{certificate.name}</TableCell>
                        <TableCell>{certificate.port}</TableCell>
                        <TableCell>{certificate.valid.toString()}</TableCell>
                        <TableCell style={{ backgroundColor: 'rgba(0, 255, 0, 0.3)' }}>{new Date(certificate.valid_to).toUTCString()}</TableCell>
                        <TableCell>{certificate.dayleft}</TableCell>
                    </>
                );
            }
    };

    return (
        <>
            <Table className={classes.Table}>
                <TableHead>
                    <TableRow>
                        <TableCell>URL</TableCell>
                        <TableCell>PORT</TableCell>
                        <TableCell>VALID</TableCell>
                        <TableCell>VALID TO</TableCell>
                        <TableCell>DAYS REMAINING</TableCell>
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