import { render } from 'react-dom';
import App from './App';

declare global {
  interface Window {
    electron: any; // eslint-disable-line
  }
}

render(<App />, document.getElementById('root'));
