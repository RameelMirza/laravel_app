import { Link, Head } from '@inertiajs/react';
import React, { useEffect, useState } from "react";
// import { Inertia } from '@inertiajs/inertia-react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import moment from 'moment';
import $ from 'jquery';


export default function News({ auth }) {
    const handleImageError = () => {
        document.getElementById('screenshot-container')?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document.getElementById('docs-card-content')?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };


    $(document).on('click','.search_btn',function(){
        $('.search_filter_form').addClass('show');
        $(this).addClass('search_btn_open');
        $(this).removeClass('search_btn');
    });

    $(document).on('click','.search_btn_open',function(){
        $('.search_filter_form').removeClass('show');
        $(this).addClass('search_btn');
        $(this).removeClass('search_btn_open');
    });

    
    const [all, setAllNews] = useState([]);
    const [newsApi, setNewsApiNews] = useState([]);
    const [guardianNews, setGuardianNews] = useState([]);
    const [nytNews, setNytNews] = useState([]);
    const [filteredNews, setfilteredNews] = useState([]);

    const [query, setQuery] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [sortBy, setSortBy] = useState('popularity');
    // const [news, setNews] = useState([]);
    const [error, setError] = useState(null);
    
    const handleSearch = async () => {
        try {
            const response = await axios.get('/search-news', {
                params: {
                    q: query,
                    from: fromDate,
                    sortBy: sortBy
                }
            });
            setAllNews(response.data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching news:', err);
        }
    };

    const articlesByAuthor = all.reduce((acc, article) => {
        if (!article.author) return acc; // Skip articles without authors

        if (!acc[article.author]) {
            acc[article.author] = [];
        }
        acc[article.author].push(article);

        return acc;
    }, {});


    useEffect(() => {
        async function fetchAndSaveNews() {
            try {
                await axios.get('/fetch-news');

                const response = await axios.get('/get_news');
                const { all, newsApi, guardianNews, nytNews, filteredNews } = response.data;

                if (response.data) {
                    setAllNews(all || []);
                    setNewsApiNews(newsApi || []);
                    setGuardianNews(guardianNews || []);
                    setNytNews(nytNews || []);
                    setfilteredNews(filteredNews || []);
                } else {
                    setError('Unexpected data format');
                }
                // setLoading(false);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching news:', err);
                // setLoading(false);
            }
        }

        fetchAndSaveNews();

    }, []);


    const [visibleRowsNewsApi, setvisibleRowsNewsApi] = useState(2);
    const [visibleRowsGuardian, setvisibleRowsGuardian] = useState(2);
    const [visibleRowsNyt, setvisibleRowsNyt] = useState(2);

    const handleLoadMoreNewsApi = () => {
        setvisibleRowsNewsApi(prevVisibleRows => prevVisibleRows + 2);
    };

    const handleLoadMoreGuardian = () => {
        setvisibleRowsGuardian(prevVisibleRows => prevVisibleRows + 2);
    };

    const handleLoadMoreNyt = () => {
        setvisibleRowsNyt(prevVisibleRows => prevVisibleRows + 2);
    };

    const articlesToDisplayNewsApi = filteredNews.filter(article => article.source === "News API").slice(0, visibleRowsNewsApi * 3);
    const articlesToDisplayGuardian = filteredNews.filter(article => article.source === "The Guardian").slice(0, visibleRowsGuardian * 3);
    const articlesToDisplayNyt = filteredNews.filter(article => article.source === "The New York Times").slice(0, visibleRowsNyt * 3);

    return (
        <>
            <Head title="Welcome" />
            <header>
                <Navbar bg="dark" data-bs-theme="dark" >
                    <Container>
                    <Navbar.Brand href="#home">NEWS APIs</Navbar.Brand>
                    <Nav className="ml-auto flex justify-content-end py-2">

                        <Nav.Link
                            href='javascript:void(0)'
                            className='search_btn p-2.5 ms-2 mr-4 text-sm font-medium text-white rounded-lg focus:ring-4 focus:outline-none'
                        >
                                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                                <span class="sr-only">Search</span>

                        </Nav.Link>
                    
                        {auth.user ? (
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                                >
                                                    {auth.user.name}

                                                    <svg
                                                        className="ms-2 -me-0.5 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
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


            <div className='search_filter_form bg-dark'>

                <input type="text" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} id="type_search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Type here" />
                <input type="date" placeholder="Search" value={fromDate} onChange={(e) => setFromDate(e.target.value)} id="type_search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Type here" />

            
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            >
                <option value="popularity">Popularity</option>
                <option value="relevance">Relevance</option>
                <option value="publishedAt">Published Date</option>
            </select>
            <button onClick={handleSearch}>Search</button>

            {error && <p>Error: {error}</p>}
            
        </div>            

            <main>
                <section className='main_banner_news_sec'>
                    <Container>
                        <Row>
                            
                            <Col md={12}>
                                <div className='inner_section_banner_news grid grid-cols-2 gap-4'>

                                {all.length > 0 ? (
                                    all.slice(0,4).map((article) => (
                                        <div className='single_news'>
                                            <a href={article.url} target="_blank" rel="noopener noreferrer">
                                                <div className='content_main_wrapper'>
                                                    <div className='article_title'>
                                                        <h2>{article.title}</h2>
                                                    </div>
                                                    <div className='article_content_wrapper'>
                                                        <p>{article.content}</p>
                                                    </div>
                                                    <div className='source_author_detail_wrapper'>
                                                        {article.source ? (
                                                            <p>
                                                                <span>{article.source}</span> |
                                                            </p>
                                                        ) : (
                                                            <p>
                                                                <span>No Source Available</span> |
                                                            </p>
                                                        )}
                                                        {article.published_at ? (
                                                            <p>
                                                                <span>{moment(article.published_at).format('MMMM DD, YYYY HH:mm:ss')}</span>
                                                            </p>
                                                        ) : (
                                                            <p>
                                                                <span>Unknown</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            
                                                <div className='img_wrapper'>
                                                    <img className='img-fluid' src={article.image_url}></img>
                                                </div>
                                            </a>
                                        </div>
                                    ))
                                ) : (
                                    <p>No news available</p>
                                )}

                                </div>
                                
                            </Col>
                        </Row>
                    </Container>
                </section>

                {articlesToDisplayNewsApi.filter(article => article.source === "News API").length > 0 ? (
                <section className='articles_by_author'>
                    <Container>
                        <Row>
                            <Col md={12}>
                                <h1>Articles By News API</h1>
                            </Col>
                        </Row>
                        <Row>
                        
                            {articlesToDisplayNewsApi.filter(article => article.source === "News API").map((article) => (
                            <Col sm="12" md="6" lg="4" key={article.url}>
                                <div className="article-card">
                                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                                        <div className='img_wrapper'>
                                            <div className='author_name'>
                                                <span>{article.author}</span>
                                            </div>
                                            <img className='img-fluid' src={article.image_url}></img>
                                        </div>
                                        <div className='article_title'>
                                            <h3>{article.title}</h3>
                                        </div>
                                        <div className='article_description'>
                                            <p>{article.content}</p>
                                        </div>
                                        <div className='publish_date'>
                                            {article.source ? (
                                                <p>
                                                    <span>{article.source}</span> |
                                                </p>
                                            ) : (
                                                <p>
                                                    <span>No Source Available</span> |
                                                </p>
                                            )}
                                            <p>Published: {new Date(article.published_at).toLocaleString()}</p>
                                        </div>
                                    </a>
                                </div>
                            </Col>
                                ))}
                                             
                                  
                        </Row>
                        {articlesToDisplayNewsApi.length < filteredNews.filter(article => article.source === "News API").length && (
                            <Row>
                                <Col md={12}>
                                    <div className='loadmore_btn_wrapper'>
                                        <Button className='btn_orange_bordered' onClick={handleLoadMoreNewsApi} variant="">
                                            Load More
                                        </Button>
                                    </div>                                    
                                </Col>
                            </Row>
                        )}
                    </Container>
                </section>
                ) :  null}



                {articlesToDisplayNyt.filter(article => article.source === "The New York Times").length > 0 ? (
                <section className='articles_by_author'>
                    <Container>
                        <Row>
                            <Col md={12}>
                                <h1>Articles By New York Times</h1>
                            </Col>
                        </Row>
                        <Row>
                        
                            {articlesToDisplayNyt.filter(article => article.source === "The New York Times").map((article) => (
                            <Col sm="12" md="6" lg="4" key={article.url}>
                                <div className="article-card">
                                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                                        <div className='img_wrapper'>
                                            <div className='author_name'>
                                                <span>{article.author}</span>
                                            </div>
                                            <img className='img-fluid' src={article.image_url}></img>
                                        </div>
                                        <div className='article_title'>
                                            <h3>{article.title}</h3>
                                        </div>
                                        <div className='article_description'>
                                            <p>{article.content}</p>
                                        </div>
                                        <div className='publish_date'>
                                            {article.source ? (
                                                <p>
                                                    <span>{article.source}</span> |
                                                </p>
                                            ) : (
                                                <p>
                                                    <span>No Source Available</span> |
                                                </p>
                                            )}
                                            <p>Published: {new Date(article.published_at).toLocaleString()}</p>
                                        </div>
                                    </a>
                                </div>
                            </Col>
                                ))}
                                             
                                   
                        </Row>
                        {articlesToDisplayNyt.length < filteredNews.filter(article => article.source === "The New York Times").length && (
                            <Row>
                                <Col md={12}>
                                    <div className='loadmore_btn_wrapper'>
                                        <Button className='btn_orange_bordered' onClick={handleLoadMoreNyt} variant="">
                                            Load More
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        )}
                    </Container>
                </section>

                ) :  null}


                {articlesToDisplayGuardian.filter(article => article.source === "The Guardian").length > 0 ? (
                <section className='articles_by_author'>
                    <Container>
                        <Row>
                            <Col md={12}>
                                <h1>Articles By The Guardian</h1>
                            </Col>
                        </Row>
                        <Row>
                                                                
                            {articlesToDisplayGuardian.filter(article => article.source === "The Guardian").map((article) => (
                            <Col sm="12" md="6" lg="4" key={article.url}>
                                <div className="article-card">
                                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                                        <div className='img_wrapper'>
                                            <div className='author_name'>
                                                <span>{article.author}</span>
                                            </div>
                                            <img className='img-fluid' src={article.image_url}></img>
                                        </div>
                                        <div className='article_title'>
                                            <h3>{article.title}</h3>
                                        </div>
                                        <div className='article_description'>
                                            <p>{article.content}</p>
                                        </div>
                                        <div className='publish_date'>
                                            {article.source ? (
                                                <p>
                                                    <span>{article.source}</span> |
                                                </p>
                                            ) : (
                                                <p>
                                                    <span>No Source Available</span> |
                                                </p>
                                            )}
                                            <p>Published: {new Date(article.published_at).toLocaleString()}</p>
                                        </div>
                                    </a>
                                </div>
                            </Col>
                                ))}
                                             
                        </Row>
                        {articlesToDisplayGuardian.length < filteredNews.filter(article => article.source === "The Guardian").length && (
                            <Row>
                                <Col md={12}>
                                    <div className='loadmore_btn_wrapper'>
                                        <Button className='btn_orange_bordered' onClick={handleLoadMoreGuardian} variant="">
                                            Load More
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        )}
                    </Container>
                </section>

                ) : null}

            </main>

        </>
    );
}
