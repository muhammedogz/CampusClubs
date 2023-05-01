import {
  Link as ReactRouterLink,
  LinkProps as ReactRouterLinkProps,
} from 'react-router-dom';

type LinkProps = ReactRouterLinkProps;

export const Link = ({ to, ...rest }: LinkProps) => {
  const basePath = import.meta.env.VITE_BASE_PATH;

  return (
    <ReactRouterLink
      style={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
      }}
      to={`/${basePath}${to}`}
      {...rest}
    />
  );
};
