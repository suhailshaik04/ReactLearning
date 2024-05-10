import React, {useCallback, useEffect, useMemo, useState} from 'react';

const fetchPosts = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    return await response.json();
};

const heavyComputation = (item) => {
    const start = performance.now();
    const computedValue = `Processed ${item.title}`;
    const end = performance.now();
    console.log(`Computation time: ${end - start} ms`);
    return computedValue;
};

const PostItem = ({ item, onClick }) => {
    const computedDetails = useMemo(() => heavyComputation(item), [item]);
    return (
        <div style={{ padding: '10px', border: '1px solid #ccc', margin: '5px', cursor: 'pointer' }} onClick={() => onClick(item.id)}>
            <h4>{item.id}</h4>
            <p>{item.title}</p>
            <p>{computedDetails}</p>
        </div>
    );
};

const PostDetails = ({ postId }) => {
    const [details, setDetails] = useState(null);

    useEffect(() => {
        console.log('PostDetails component re-rendered');
        const fetchDetails = async () => {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
            const data = await response.json();
            setDetails(data);
        };
        fetchDetails();
    }, [postId]);

    if (!details) return <p>Loading...</p>;

    return (
        <div style={{ padding: '20px', border: '2px solid #007BFF', margin: '10px' }}>
            <h4>{details.id}</h4>
            <p>{details.title}</p>
        </div>
    );
};

const Pagination = ({ postsPerPage, totalPosts, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul style={{ listStyleType: 'none', display: 'flex', justifyContent: 'center' }}>
                {pageNumbers.map(number => (
                    <li key={number} style={{ margin: '5px' }}>
                        <button onClick={() => paginate(number)} style={{ padding: '5px' }}>
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);
    const [selectedPostId, setSelectedPostId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchPosts();
            setPosts(data);
        };
        fetchData();
    }, []);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const handlePostClick = useCallback((id) => {
        setSelectedPostId(id);
    }, []);

    return (
        <div>
            {currentPosts.map(post => (
                <PostItem key={post.id} item={post} onClick={handlePostClick} />
            ))}
            <Pagination postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate} />
            {selectedPostId && <PostDetails postId={selectedPostId} />}
        </div>
    );
};

export default PostList;
