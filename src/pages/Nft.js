import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    CardMedia,
    CardActionArea,
    Grid,
} from '@mui/material';
import { getAPI, putAPI, deleteAPI, postAPI } from '../utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../login.css';
import axios from 'axios';

const Nft = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUserInfo = async () => {
            const response = await getAPI("/user/me/")
            console.log(response.data)
            setUser(response.data)
        }

        getUserInfo();
    }, []);

    const mintNFT = async () => {
        const response = await axios.post(
            'http://10.4.23.144:3000/api/uploadImage',
            {
              'title': 'long',
              'description': 'Longgg'
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
        console.log(response)
    }

    const NFTs = user?.nfts.map(nft => {
        return <Grid item md={3}>
            <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        image={nft.image_url}
                        alt={nft.identifier}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {nft.identifier}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Access key
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    })

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" align="center" gutterBottom>
                Keys
            </Typography>

            <Grid container spacing={2}>
                {NFTs}
            </Grid>

            <br></br>

            <Button variant="contained" color="primary" onClick={mintNFT}>
                Mint new key
            </Button>
            <ToastContainer />
        </Container>
    );
};

export default Nft;
