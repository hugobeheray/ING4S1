
/** @jsxImportSource @emotion/react */
// Layout
import { useTheme } from '@mui/styles';

const useStyles = (theme) => ({
  root: {
    background: theme.palette.background.default,
    overflow: 'hidden',
    flex: '1 1 auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default function Oups() {
  const styles = useStyles(useTheme())
  return (
    <main css={styles.root}>
      <div>
        An unexpected error occured, it is probably not your fault. Sorry.
      </div>
    </main>
  );
}
