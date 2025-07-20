import { Provider } from 'react-redux';
import { store } from './store';
import NewsFeed from './NewsFeed';
import 'antd';

const App = () => {
  return (
    <Provider store={store}>
      <div style={{ padding: '20px', maxWidth: '60%' }}>
        <h1>Лента новостей</h1>
        <NewsFeed />
      </div>
    </Provider>
  );
};

export default App;