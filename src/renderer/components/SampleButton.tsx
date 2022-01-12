import { Button } from '@mui/material';

const SampleButton = () => {
  return (
    <a
      href="https://electron-react-boilerplate.js.org/"
      target="_blank"
      rel="noreferrer"
    >
      <Button variant="outlined">
        <span role="img" aria-label="books">
          📚
        </span>
        Read our docs
      </Button>
    </a>
  );
};

export default SampleButton;
