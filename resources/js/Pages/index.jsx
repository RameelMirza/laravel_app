import { Link, Head } from '@inertiajs/react';
import React, { useEffect, useState } from "react";
import { Inertia } from '@inertiajs/inertia-react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import axios from 'axios';


export default function Index({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document.getElementById('screenshot-container')?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document.getElementById('docs-card-content')?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };


    // const [articles, setArticles] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);

    // const apiKey = '27322642d3874c32bebe73433eff3d5d';
    // var url = 'https://newsapi.org/v2/top-headlines?' +
    //       'country=us&' +
    //       'apiKey=27322642d3874c32bebe73433eff3d5d';

    // useEffect(() => {
    //     const fetchNews = async () => {
    //     try {
    //         const response = await axios.get(url);
    //         setArticles(response.data.articles);
    //         setLoading(false);
    //     } catch (error) {
    //         setError(error);
    //         setLoading(false);
    //     }
    //     };

    //     fetchNews();
    // }, [url]);

    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error fetching news: {error.message}</p>;

    // var url = 'https://newsapi.org/v2/top-headlines?' +
    //       'sources=bbc-news&' +
    //       'apiKey=27322642d3874c32bebe73433eff3d5d';
    // var req = new Request(url);
    // fetch(req)
    //     .then(function(response) {
    //         console.log(response.json());
    //     })

    return (
        <>
            <Head title="Welcome" />
            <header>
                <Navbar bg="dark" data-bs-theme="dark" >
                    <Container>
                    <Navbar.Brand href="#home">Navbar</Navbar.Brand>
                    <Nav className="ml-auto flex justify-content-end py-2">
                    
                        {auth.user ? (
                                    <Nav.Link
                                        href={route('dashboard')}
                                        className="rounded-md px-3 py-2 ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                    >
                                        Dashboard
                                    </Nav.Link>
                                ) : (
                                    <>
                                        <Nav.Link
                                            href={route('login')}
                                            className="rounded-md px-3 py-2 ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Log in
                                        </Nav.Link>
                                        <Nav.Link
                                            href={route('register')}
                                            className="rounded-md px-3 py-2 ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Register
                                        </Nav.Link>
                                    </>
                                )}
                    </Nav>
                    </Container>
                </Navbar>
            </header>

            

            <main>
                <section className='main_banner_news_sec'>
                    <Container>
                        <Row>
                            <Col md={6}>
                                Hellow World
                            </Col>
                            <Col md={6}>
                                Hellow World
                            </Col>
                        </Row>
                    </Container>
                </section>
            </main>

        </>
    );
}
