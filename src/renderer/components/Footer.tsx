import Typography from '@mui/material/Typography';

const Footer = () => {
  return (
    <footer
      style={{
        textAlign: 'center',
        marginTop: 'calc(1% + 1px)',
        bottom: 0,
      }}
    >
      <Typography variant="caption" component="p">
        Copyright @ {new Date().getFullYear()}
      </Typography>
      <Typography variant="caption" component="p">
        Proudly created by{' '}
        <a
          href="https://linktr.ee/andreyxdd"
          style={{ textDecoration: 'none', color: 'grey' }}
        >
          Andrey Volkov
        </a>
      </Typography>
    </footer>
  );
};

export default Footer;
