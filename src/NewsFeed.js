import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from './features/postsSlice';
import { EyeOutlined } from '@ant-design/icons';
import { Card, Spin, Alert, Rate, Divider, Flex, Tag } from 'antd';

const NewsFeed = () => {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.posts.posts);
    const postStatus = useSelector((state) => state.posts.status);
    const [skip, setSkip] = useState(0);
    const [loadingMore, setLoadingMore] = useState(true);

    useEffect(() => {
        if (!loadingMore) return;

        setLoadingMore(false);
        dispatch(fetchPosts(skip)).finally(() => {
            setLoadingMore(true);
        });
    }, [dispatch, skip, postStatus]);

    const loadMorePosts = () => {
        if (postStatus !== 'loading') {
            setLoadingMore(true);
            setSkip((prevSkip) => prevSkip + 10);
        }
    };

    const handleScroll = (e) => {
        const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
        if (bottom) {
            loadMorePosts();
        }
    };

    const uniquePosts = posts.filter((obj, index, self) =>
        index === self.findIndex((t) => (
            t.id === obj.id
        ))
    );

    return (
        <div onScroll={handleScroll} style={{ height: '80vh', overflowY: 'auto' }}>
            {postStatus === 'loading' && <Spin />}
            {postStatus === 'failed' && <Alert message="Ошибка загрузки новостей" type="error" />}
            {uniquePosts.length === 0 && postStatus === 'succeeded' && <Alert message="Нет доступных постов" type="info" />}
            {uniquePosts.map((post) => (
                <Card key={post.id} title={post.title} style={{ margin: '10px 0' }}>
                    {/* <p>{post.body.slice(0, 100)}...</p> */}
                    <p>{post.body}</p>
                    <Divider orientation="left" style={{ borderColor: '#7cb305' }}>Tags</Divider>
                    <Flex gap="4px 0" wrap>
                        {post.tags.map((element, index) => (
                            <Tag key={index} color="green">{element}</Tag>
                        ))}
                    </Flex>
                    <Divider orientation="left" style={{ borderColor: '#7cb305' }}>Rating</Divider>
                    <div><Rate disabled allowHalf defaultValue={(post.reactions.likes / (post.reactions.likes + post.reactions.dislikes)) * 100 / 20} /></div>
                    <p>Likes: {post.reactions.likes}, Dislikes: {post.reactions.dislikes}</p>
                    <p><EyeOutlined />  {post.views}</p>
                </Card>
            ))}
        </div>
    );
};

export default NewsFeed;